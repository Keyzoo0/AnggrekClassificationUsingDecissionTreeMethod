import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload as UploadIcon, Trash2, ImagePlus, X, Eye } from "lucide-react";
import { api, DatasetStats } from "@/lib/api";

const CLASSES = ["Phalaenopsis", "Dendrobium", "Vanda"] as const;

export default function UploadPage() {
  const [cls, setCls] = useState<string>("Phalaenopsis");
  const [files, setFiles] = useState<File[]>([]);
  const [stats, setStats] = useState<DatasetStats>({ Phalaenopsis: 0, Dendrobium: 0, Vanda: 0, total: 0 });
  const [filesByClass, setFilesByClass] = useState<Record<string, string[]>>({});
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<string>("");
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<{ cls: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadStats = async () => {
    try {
      const data = await api<{ stats: DatasetStats }>("/api/dataset/stats");
      setStats(data.stats);
      const list = await api<{ files: Record<string, string[]> }>("/api/dataset/list");
      setFilesByClass(list.files);
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

  const removePending = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const upload = async () => {
    if (!files.length) return;
    setUploading(true);
    setLog("");
    const fd = new FormData();
    fd.append("class", cls);
    files.forEach((f) => fd.append("files", f));
    try {
      const res = await api<any>("/api/dataset/upload", { method: "POST", body: fd });
      let msg = `✅ ${res.uploaded_count} file terupload ke ${cls}.`;
      if (res.skipped?.length) {
        msg += `\n⚠️ ${res.skipped.length} di-skip:`;
        res.skipped.forEach((s: any) => (msg += `\n  · ${s.file}: ${s.reason}`));
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

  const deleteOne = async (c: string, filename: string) => {
    if (!confirm(`Hapus "${filename}" dari kelas ${c}?`)) return;
    try {
      await api(`/api/dataset/file?class=${encodeURIComponent(c)}&filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      loadStats();
    } catch (e: any) {
      alert("Gagal hapus: " + e.message);
    }
  };

  const clearClass = async (c: string) => {
    if (!confirm(`Hapus SEMUA gambar di kelas ${c}?`)) return;
    await api(`/api/dataset/clear?class=${c}`, { method: "DELETE" });
    loadStats();
  };

  const clearAll = async () => {
    if (!confirm("Hapus SEMUA dataset (semua kelas)?")) return;
    await api("/api/dataset/clear", { method: "DELETE" });
    loadStats();
  };

  const totalFiles = stats.total || 0;

  return (
    <div className="space-y-6">
      {/* TOP ROW: Upload form + Stats summary */}
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
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md border group">
                    <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removePending(i); }}
                      className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Buang dari antrian"
                    >
                      <X className="h-3 w-3" />
                    </button>
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
            <CardTitle>Ringkasan Dataset</CardTitle>
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
                      <Button size="sm" variant="ghost" onClick={() => clearClass(c)} title={`Hapus semua di ${c}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold">TOTAL</TableCell>
                  <TableCell className="font-bold">{totalFiles}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
            <Button onClick={clearAll} variant="destructive" size="sm" className="mt-4 w-full" disabled={totalFiles === 0}>
              <Trash2 className="h-4 w-4 mr-2" /> Hapus Semua Dataset
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* GALLERY PER CLASS */}
      <Card>
        <CardHeader>
          <CardTitle>Galeri Dataset</CardTitle>
          <p className="text-sm text-muted-foreground">Klik thumbnail untuk preview · Hover untuk hapus per gambar</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {CLASSES.map((c) => {
            const items = filesByClass[c] || [];
            return (
              <div key={c}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">{c}</h3>
                  <Badge variant={items.length > 0 ? "default" : "secondary"}>{items.length} gambar</Badge>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4 border border-dashed rounded-md text-center">
                    Belum ada gambar untuk kelas {c}
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {items.map((name) => (
                      <div key={name} className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
                        <img
                          src={`/api/dataset/image/${encodeURIComponent(c)}/${encodeURIComponent(name)}`}
                          alt={name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center gap-1 p-1.5">
                          <button
                            onClick={() => setPreview({ cls: c, name })}
                            className="opacity-0 group-hover:opacity-100 bg-white/95 text-foreground rounded-md p-1.5 shadow"
                            title="Preview"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOne(c, name)}
                            className="opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-md p-1.5 shadow"
                            title="Hapus gambar ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-[10px] text-white truncate" title={name}>{name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.cls} · {preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <img
                src={`/api/dataset/image/${encodeURIComponent(preview.cls)}/${encodeURIComponent(preview.name)}`}
                alt={preview.name}
                className="w-full max-h-[70vh] object-contain rounded-md border bg-black/5"
              />
              <Button
                variant="destructive"
                onClick={() => {
                  deleteOne(preview.cls, preview.name);
                  setPreview(null);
                }}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Hapus Gambar Ini
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
