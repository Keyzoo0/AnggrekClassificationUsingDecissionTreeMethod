# Anggrek Classifier — Decision Tree + Computer Vision

Sistem klasifikasi anggrek (**Phalaenopsis · Dendrobium · Vanda**) menggunakan algoritma **Decision Tree** dengan fitur morfologi yang diekstrak dari citra digital. Web app full-feature dengan upload dataset, training model, dan prediksi (gambar/video/webcam).

---

## 🧱 Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | FastAPI · OpenCV · scikit-learn · NumPy · Pandas |
| Frontend | Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · Chart.js |
| ML | Decision Tree (CART) dengan 6 fitur morfologi |

---

## 📋 Prasyarat

1. **Python 3.10+** (test pada 3.14.5)
2. **Node.js 20+** dan **npm** — [download dari nodejs.org](https://nodejs.org/) (pilih LTS)
3. Browser modern (Chrome/Edge) untuk akses webcam

---

## 🚀 Setup Pertama Kali

### 1. Backend (Python)

```powershell
# Buat virtual environment (opsional tapi direkomendasikan)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend (Node.js + React)

```powershell
cd frontend
npm install
cd ..
```

---

## ▶️ Cara Menjalankan

### Mode A: Development (rekomendasi saat ngoding)

Buka **2 terminal**:

**Terminal 1 — Backend FastAPI:**
```powershell
python run.py
```
Backend jalan di http://127.0.0.1:8000  
Swagger API docs: http://127.0.0.1:8000/docs

**Terminal 2 — Frontend Vite:**
```powershell
cd frontend
npm run dev
```
Buka **http://localhost:5173** di browser. Vite akan otomatis proxy `/api/*` ke backend.

### Mode B: Production (siap demo / sidang)

```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Jalankan satu server saja
python run.py
```

Buka **http://127.0.0.1:8000** — FastAPI akan serve hasil build React.

---

## 📁 Struktur Proyek

```
.
├── app/                         # FastAPI backend
│   ├── main.py                  # Entry FastAPI
│   ├── config.py                # Path & konstanta
│   ├── routers/                 # API endpoints
│   │   ├── dataset.py           # /api/dataset/*
│   │   ├── model.py             # /api/model/*
│   │   └── predict.py           # /api/predict/*
│   ├── services/                # Business logic
│   │   ├── image_processor.py   # Preprocessing & segmentasi
│   │   ├── feature_extractor.py # Ekstraksi 6 fitur
│   │   ├── decision_tree_model.py # Wrapper sklearn
│   │   ├── dataset_manager.py   # CRUD dataset
│   │   └── visualizer.py        # Render tree, CM, FI
│   └── schemas/                 # Pydantic models
├── frontend/                    # Vite + React + shadcn
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/               # Upload, Training, Predict
│   │   ├── components/ui/       # shadcn components
│   │   └── lib/                 # api.ts, utils.ts
│   ├── package.json
│   └── vite.config.ts
├── data/
│   ├── raw/                     # Dataset per kelas
│   │   ├── Phalaenopsis/
│   │   ├── Dendrobium/
│   │   └── Vanda/
│   └── features/                # features.csv
├── models/                      # Model .pkl & history
├── static/visualizations/       # Tree, confusion matrix, FI
├── docs/                        # Dokumentasi skripsi
├── requirements.txt
└── run.py                       # Uvicorn launcher
```

---

## 🌸 Fitur yang Diekstrak

| # | Fitur | Tipe | Sumber |
|---|-------|------|--------|
| 1 | `diameter_relatif` | float | Lebar bbox bunga ÷ lebar gambar |
| 2 | `jumlah_bintik` | int | Blob detection (5–200 px, circularity ≥ 0.45) |
| 3 | `rasio_labelium` | float | K-Means k=2 berdasar saturasi |
| 4 | `aspect_ratio` | float | Lebar ÷ tinggi bbox |
| 5 | `dominant_hue` | float | Median Hue di area bunga |
| 6 | `dominant_saturation` | float | Median Saturation di area bunga |

Segmentasi: **HSV thresholding + GrabCut refinement** + pilih kontur terbesar terdekat ke tengah (auto-pick dominant flower).

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/dataset/upload` | Upload gambar ke kelas |
| `GET` | `/api/dataset/stats` | Statistik per kelas |
| `GET` | `/api/dataset/list` | List file per kelas |
| `DELETE` | `/api/dataset/clear?class=X` | Hapus dataset |
| `POST` | `/api/model/train` | Training model |
| `GET` | `/api/model/info` | Info model trained |
| `GET` | `/api/model/download` | Download .pkl |
| `POST` | `/api/predict/image` | Prediksi gambar |
| `POST` | `/api/predict/video` | Prediksi video |
| `WS` | `/api/predict/webcam` | Streaming webcam |

Swagger: http://127.0.0.1:8000/docs

---

## 🐛 Troubleshooting

**`ModuleNotFoundError: No module named 'cv2'`**  
→ `pip install -r requirements.txt`

**`node: command not found`**  
→ Install Node.js LTS dari https://nodejs.org/

**Frontend tampil tapi data tidak load**  
→ Pastikan backend Python juga jalan di port 8000.

**Webcam tidak bisa diakses**  
→ Browser butuh HTTPS atau localhost. Pakai `http://localhost:5173` (bukan IP).

**Training error: "Dataset terlalu sedikit"**  
→ Upload min 2 gambar per kelas, total min 6 gambar.

**OpenCV / numpy install gagal di Python 3.14**  
→ Beberapa wheel mungkin belum tersedia. Coba downgrade ke Python 3.12 LTS.

---

## 📝 Dokumentasi Lengkap

Lihat [`dokumentasi-proyek-anggrek.md`](dokumentasi-proyek-anggrek.md) untuk spesifikasi penuh proyek skripsi (16 bab).
