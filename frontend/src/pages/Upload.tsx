import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, Trash2, ImagePlus } from "lucide-react";
import { api, DatasetStats } from "@/lib/api";

const CLASSES = ["Phalaenopsis", "Dendrobium", "Vanda"] as const;

export default function UploadPage() {
  const [cls, setCls] = useState<string>("Phalaenopsis");
  const [files, setFiles] = useState<File[]>([]);
  const [stats, setStats] = useState<DatasetStats>({ Phalaenopsis: 0, Dendrobium: 0, Vanda: 0, total: 0 });
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<string>("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadStats = async () => {
    try {
      const data = await api<{ stats: DatasetStats }>("/api/dataset/stats");
      setStats(data.stats);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const upload = async () => {
    if (!files.length) return;
    setUploading(true);
    setLog("");
    const fd = new FormData();
    fd.append("class", cls);
    files.forEach((f) => fd.append("files", f));
    try {
      const res = await api<any>("/api/dataset/upload", { method: "POST", body: fd });
      let msg = `✅ ${res.uploaded_count} file terupload ke ${cls}.\n`;
      if (res.skipped?.length) {
        msg += `⚠️ ${res.skipped.length} di-skip:\n`;
        res.skipped.forEach((s: any) => (msg += `  · ${s.file}: ${s.reason}\n`));
      }
      setLog(msg);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      loadStats();
    } catch (e: any) {
      setLog(`❌ Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const clearClass = async (c: string) => {
    if (!confirm(`Hapus semua gambar ${c}?`)) return;
    await api(`/api/dataset/clear?class=${c}`, { method: "DELETE" });
    loadStats();
  };

  const clearAll = async () => {
    if (!confirm("Hapus SEMUA dataset?")) return;
    await api("/api/dataset/clear", { method: "DELETE" });
    loadStats();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" /> Upload Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Pilih Kelas</Label>
            <Select value={cls} onValueChange={setCls}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              drag ? "border-primary bg-primary/10" : "border-primary/40 bg-primary/5 hover:bg-primary/10"
            }`}
          >
            <UploadIcon className="mx-auto h-10 w-10 text-primary mb-2" />
            <p className="font-medium">Drag &amp; drop atau klik untuk pilih file</p>
            <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP · Max 10MB/file</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded border">
                  <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <Button onClick={upload} disabled={!files.length || uploading} className="w-full">
            {uploading ? "Mengupload..." : `Upload ${files.length || ""} file ke ${cls}`}
          </Button>

          {log && (
            <pre className="text-xs bg-muted rounded-md p-3 whitespace-pre-wrap max-h-40 overflow-auto">{log}</pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kelas</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLASSES.map((c) => (
                <TableRow key={c}>
                  <TableCell className="font-medium">{c}</TableCell>
                  <TableCell>
                    <Badge variant={(stats as any)[c] > 0 ? "default" : "secondary"}>
                      {(stats as any)[c] || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => clearClass(c)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell className="font-bold">TOTAL</TableCell>
                <TableCell className="font-bold">{stats.total || 0}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={clearAll} variant="destructive" size="sm" className="mt-4 w-full">
            <Trash2 className="h-4 w-4 mr-2" /> Hapus Semua Dataset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
