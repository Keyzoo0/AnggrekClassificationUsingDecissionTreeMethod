import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Flower2, Upload, Cog, ScanLine } from "lucide-react";
import { api } from "@/lib/api";
import UploadPage from "@/pages/Upload";
import TrainingPage from "@/pages/Training";
import PredictPage from "@/pages/Predict";

export default function App() {
  const [modelStatus, setModelStatus] = useState<{ trained: boolean; acc?: number }>({ trained: false });

  const refreshModel = async () => {
    try {
      const info = await api<any>("/api/model/info");
      if (info.trained) {
        setModelStatus({ trained: true, acc: info.history?.metrics?.accuracy });
      } else {
        setModelStatus({ trained: false });
      }
    } catch {
      setModelStatus({ trained: false });
    }
  };

  useEffect(() => {
    refreshModel();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary via-accent to-pink-500 text-primary-foreground shadow-md">
        <div className="container py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flower2 className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold leading-tight">Anggrek Classifier</h1>
              <p className="text-sm opacity-90">Phalaenopsis · Dendrobium · Vanda — Decision Tree + Computer Vision</p>
            </div>
          </div>
          <Badge variant={modelStatus.trained ? "success" : "secondary"} className="text-sm py-1 px-3">
            {modelStatus.trained
              ? `✅ Model trained${modelStatus.acc != null ? ` · Acc ${(modelStatus.acc * 100).toFixed(1)}%` : ""}`
              : "⚠️ Model belum dilatih"}
          </Badge>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" /> Upload Dataset
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <Cog className="h-4 w-4" /> Training
            </TabsTrigger>
            <TabsTrigger value="predict" className="gap-2">
              <ScanLine className="h-4 w-4" /> Prediksi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <UploadPage />
          </TabsContent>
          <TabsContent value="training" className="mt-6">
            <TrainingPage onTrained={refreshModel} />
          </TabsContent>
          <TabsContent value="predict" className="mt-6">
            <PredictPage />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="container py-6 text-center text-sm text-muted-foreground">
        Skripsi Klasifikasi Anggrek · Decision Tree + Computer Vision
      </footer>
    </div>
  );
}
