const BASE = "";

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.detail || j.message || JSON.stringify(j);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export interface DatasetStats {
  Phalaenopsis: number;
  Dendrobium: number;
  Vanda: number;
  total: number;
}

export interface TrainHistory {
  trained_at: string;
  n_samples: number;
  classes: string[];
  hyperparameters: Record<string, any>;
  metrics: { accuracy: number; precision_macro: number; recall_macro: number; f1_macro: number };
  per_class: Record<string, { precision: number; recall: number; f1: number }>;
  confusion_matrix: number[][];
  confusion_matrix_labels: string[];
  feature_importance: Record<string, number>;
  cv_scores: { mean: number; std: number } | null;
  errors: any[];
}

export interface PredictResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  features: Record<string, number>;
  decision_path: any[];
  bbox: [number, number, number, number] | null;
  annotated_image: string;
  mask_image: string;
}
