import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Download, AlertCircle } from "lucide-react";
import { api, TrainHistory } from "@/lib/api";

interface Props { onTrained: () => void }

export default function TrainingPage({ onTrained }: Props) {
  const [maxDepth, setMaxDepth] = useState(5);
  const [criterion, setCriterion] = useState("gini");
  const [testSize, setTestSize] = useState(0.2);
  const [mss, setMss] = useState(4);
  const [msl, setMsl] = useState(2);
  const [training, setTraining] = useState(false);
  const [history, setHistory] = useState<TrainHistory | null>(null);
  const [vis, setVis] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const train = async () => {
    setTraining(true);
    setError("");
    setHistory(null);
    setVis(null);
    try {
      const res = await api<any>("/api/model/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_depth: maxDepth, criterion, test_size: testSize,
          min_samples_split: mss, min_samples_leaf: msl,
        }),
      });
      setHistory(res.history);
      setVis(res.visualizations);
      onTrained();
    } catch (e: any) {
      setError(e.message || "Training gagal");
    } finally {
      setTraining(false);
    }
  };

  const metric = (label: string, val: number) => (
    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold text-primary">{(val * 100).toFixed(1)}%</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Training</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>max_depth: <span className="font-mono text-primary">{maxDepth}</span></Label>
            <Slider value={[maxDepth]} min={2} max={15} step={1} onValueChange={(v) => setMaxDepth(v[0])} />
            <p className="text-xs text-muted-foreground">Kedalaman maksimum tree. Lebih dalam = mungkin overfitting.</p>
          </div>
          <div className="space-y-2">
            <Label>Criterion</Label>
            <Select value={criterion} onValueChange={setCriterion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gini">gini</SelectItem>
                <SelectItem value="entropy">entropy</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Metrik untuk evaluasi split node.</p>
          </div>
          <div className="space-y-2">
            <Label>test_size: <span className="font-mono text-primary">{testSize.toFixed(2)}</span></Label>
            <Slider value={[testSize]} min={0.1} max={0.4} step={0.05} onValueChange={(v) => setTestSize(v[0])} />
          </div>
          <div className="space-y-2">
            <Label>min_samples_split: <span className="font-mono text-primary">{mss}</span></Label>
            <Slider value={[mss]} min={2} max={20} step={1} onValueChange={(v) => setMss(v[0])} />
          </div>
          <div className="space-y-2">
            <Label>min_samples_leaf: <span className="font-mono text-primary">{msl}</span></Label>
            <Slider value={[msl]} min={1} max={10} step={1} onValueChange={(v) => setMsl(v[0])} />
          </div>
          <div className="flex items-end">
            <Button onClick={train} disabled={training} size="lg" className="w-full">
              <Play className="h-4 w-4 mr-2" />
              {training ? "Training berjalan..." : "Mulai Training"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-2 pt-6 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {history && (
        <>
          <Card>
            <CardHeader><CardTitle>Metrik Evaluasi (Macro Average)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metric("Accuracy", history.metrics.accuracy)}
                {metric("Precision", history.metrics.precision_macro)}
                {metric("Recall", history.metrics.recall_macro)}
                {metric("F1-Score", history.metrics.f1_macro)}
              </div>
              {history.cv_scores && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Cross-Validation: <span className="font-mono">{(history.cv_scores.mean * 100).toFixed(1)}% ± {(history.cv_scores.std * 100).toFixed(1)}%</span>
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Sampel: {history.n_samples} · Kelas: {history.classes.join(", ")}
              </p>
            </CardContent>
          </Card>

          {vis && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Confusion Matrix</CardTitle></CardHeader>
                <CardContent>
                  <img src={`/static/visualizations/${vis.confusion_matrix}?t=${Date.now()}`} alt="CM" className="rounded-md w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Feature Importance</CardTitle></CardHeader>
                <CardContent>
                  <img src={`/static/visualizations/${vis.feature_importance}?t=${Date.now()}`} alt="FI" className="rounded-md w-full" />
                </CardContent>
              </Card>
            </div>
          )}

          {vis && (
            <Card>
              <CardHeader><CardTitle>Visualisasi Decision Tree</CardTitle></CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={`/static/visualizations/${vis.tree}?t=${Date.now()}`}
                      alt="Tree"
                      className="rounded-md w-full cursor-zoom-in border"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh]">
                    <DialogHeader><DialogTitle>Decision Tree (Full Size)</DialogTitle></DialogHeader>
                    <img src={`/static/visualizations/${vis.tree}?t=${Date.now()}`} alt="Tree full" className="w-full" />
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-muted-foreground mt-2">Klik untuk lihat ukuran penuh.</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <Button asChild variant="outline">
                <a href="/api/model/download" download>
                  <Download className="h-4 w-4 mr-2" /> Download Model (.pkl)
                </a>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
