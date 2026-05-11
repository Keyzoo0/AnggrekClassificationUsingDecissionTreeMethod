import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from "chart.js";
import { ImagePlus, Film, Video, ScanLine, Square } from "lucide-react";
import { api, PredictResult } from "@/lib/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PredictPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="img">
          <TabsList className="grid w-full grid-cols-3 max-w-xl">
            <TabsTrigger value="img" className="gap-2"><ImagePlus className="h-4 w-4" /> Gambar</TabsTrigger>
            <TabsTrigger value="vid" className="gap-2"><Film className="h-4 w-4" /> Video</TabsTrigger>
            <TabsTrigger value="cam" className="gap-2"><Video className="h-4 w-4" /> Webcam</TabsTrigger>
          </TabsList>
          <TabsContent value="img"><ImageMode /></TabsContent>
          <TabsContent value="vid"><VideoMode /></TabsContent>
          <TabsContent value="cam"><WebcamMode /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ResultView({ result }: { result: PredictResult }) {
  const data = {
    labels: Object.keys(result.probabilities),
    datasets: [{
      label: "Probabilitas",
      data: Object.values(result.probabilities).map((v) => v * 100),
      backgroundColor: ["#9333ea", "#ec4899", "#f59e0b", "#10b981"],
    }],
  };
  return (
    <div className="mt-6 space-y-4">
      <Card>
        <CardHeader><CardTitle>Hasil Prediksi</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">{result.prediction}</span>
            <Badge variant="secondary" className="text-base">{(result.confidence * 100).toFixed(1)}%</Badge>
          </div>
          {result.annotated_image && (
            <img src={result.annotated_image} alt="Annotated" className="rounded-md max-w-full border" />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Fitur yang Diekstrak</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(result.features).map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-1.5 text-muted-foreground">{k}</td>
                    <td className="py-1.5 text-right font-mono">{typeof v === "number" ? v.toFixed(3) : v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Probabilitas Tiap Kelas</CardTitle></CardHeader>
          <CardContent>
            <Bar data={data} options={{ scales: { y: { beginAtZero: true, max: 100 } } }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Decision Path</CardTitle></CardHeader>
        <CardContent>
          <ol className="space-y-1.5">
            {result.decision_path.map((node, i) => (
              <li
                key={i}
                className={`rounded-md px-3 py-2 font-mono text-sm ${
                  node.type === "LEAF"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold"
                    : "bg-muted"
                }`}
              >
                {node.type === "LEAF"
                  ? `→ LEAF: ${node.prediction} (${node.samples} sampel, purity ${(node.purity * 100).toFixed(1)}%)`
                  : `${node.feature} = ${node.value.toFixed(3)} ${node.go_left ? "≤" : ">"} ${node.threshold.toFixed(3)}`
                }
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function ImageMode() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const predict = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api<any>("/api/predict/image", { method: "POST", body: fd });
      setResult(res.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-xl p-8 text-center"
      >
        <ImagePlus className="mx-auto h-10 w-10 text-primary mb-2" />
        <p className="font-medium">Klik / drop gambar anggrek</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      {preview && <img src={preview} alt="" className="max-h-80 rounded-md border" />}
      <Button onClick={predict} disabled={!file || loading} className="w-full">
        <ScanLine className="h-4 w-4 mr-2" />
        {loading ? "Memprediksi..." : "Prediksi"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && <ResultView result={result} />}
    </div>
  );
}

function VideoMode() {
  const [file, setFile] = useState<File | null>(null);
  const [skip, setSkip] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("skip_frames", String(skip));
    try {
      const res = await api<any>("/api/predict/video", { method: "POST", body: fd });
      setResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>File Video</Label>
          <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <Label>Skip frames</Label>
          <Input type="number" min={1} max={30} value={skip} onChange={(e) => setSkip(Number(e.target.value))} />
        </div>
      </div>
      <Button onClick={run} disabled={!file || loading} className="w-full">
        <Film className="h-4 w-4 mr-2" />
        {loading ? "Memproses video..." : "Proses Video"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result?.summary && (
        <Card>
          <CardHeader><CardTitle>Ringkasan Video</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>Kelas dominan: <span className="font-bold text-primary text-lg">{result.summary.dominant_class}</span></p>
            <p className="text-sm text-muted-foreground">
              Total frame dianalisis: {result.summary.total_analyzed} dari {result.total_frames_read}
            </p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(result.summary.counts).map(([k, v]: any) => (
                <Badge key={k} variant="outline">{k}: {v}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WebcamMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [latest, setLatest] = useState<any>(null);
  const [fps, setFps] = useState(0);
  const fpsCounter = useRef({ count: 0, ts: Date.now() });

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setActive(false);
  };

  useEffect(() => stop, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${proto}//${window.location.host}/api/predict/webcam`);
      wsRef.current = ws;
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          setLatest(data);
          fpsCounter.current.count++;
          const now = Date.now();
          if (now - fpsCounter.current.ts >= 1000) {
            setFps(fpsCounter.current.count);
            fpsCounter.current.count = 0;
            fpsCounter.current.ts = now;
          }
        } catch {}
      };
      ws.onopen = () => setActive(true);
      ws.onclose = () => setActive(false);

      intervalRef.current = window.setInterval(() => {
        if (!videoRef.current || !canvasRef.current || ws.readyState !== WebSocket.OPEN) return;
        const v = videoRef.current;
        const c = canvasRef.current;
        c.width = v.videoWidth || 640;
        c.height = v.videoHeight || 480;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(v, 0, 0, c.width, c.height);
        const data = c.toDataURL("image/jpeg", 0.7);
        ws.send(JSON.stringify({ image: data }));
      }, 500);
    } catch (e: any) {
      alert("Gagal akses kamera: " + e.message);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex gap-2">
        <Button onClick={start} disabled={active}><Video className="h-4 w-4 mr-2" /> Aktifkan Kamera</Button>
        <Button onClick={stop} disabled={!active} variant="outline"><Square className="h-4 w-4 mr-2" /> Stop</Button>
      </div>
      <div className="relative max-w-2xl">
        <video ref={videoRef} className="w-full rounded-md bg-black" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        {active && latest && (
          <div className="absolute top-2 left-2 rounded-md bg-black/70 text-white px-3 py-2 text-sm">
            {latest.detected ? (
              <>
                <div className="font-bold text-lg">{latest.prediction}</div>
                <div className="opacity-80">{(latest.confidence * 100).toFixed(0)}% · {fps} FPS</div>
              </>
            ) : (
              <div>Bunga tidak terdeteksi · {fps} FPS</div>
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Target ~2 FPS (interval 500ms). Untuk laptop spek rendah.</p>
    </div>
  );
}
