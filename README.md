<<<<<<< HEAD
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
=======
# DOKUMENTASI PROYEK
# Klasifikasi Jenis Anggrek Menggunakan Algoritma Decision Tree Berbasis Ekstraksi Fitur Morfologi Bunga

---

## DAFTAR ISI

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Latar Belakang & Justifikasi](#2-latar-belakang--justifikasi)
3. [Tujuan & Ruang Lingkup](#3-tujuan--ruang-lingkup)
4. [Spesifikasi Sistem](#4-spesifikasi-sistem)
5. [Arsitektur Sistem](#5-arsitektur-sistem)
6. [Metodologi](#6-metodologi)
7. [Spesifikasi Fitur (Feature Engineering)](#7-spesifikasi-fitur-feature-engineering)
8. [Spesifikasi Decision Tree](#8-spesifikasi-decision-tree)
9. [Spesifikasi Web Application](#9-spesifikasi-web-application)
10. [Struktur Proyek & File](#10-struktur-proyek--file)
11. [Stack Teknologi](#11-stack-teknologi)
12. [Dataset Plan](#12-dataset-plan)
13. [Evaluation Plan](#13-evaluation-plan)
14. [Timeline & Milestone](#14-timeline--milestone)
15. [Risiko & Mitigasi](#15-risiko--mitigasi)
16. [Glosarium](#16-glosarium)

---

## 1. RINGKASAN PROYEK

### 1.1 Judul

**"Implementasi Decision Tree dengan Computer Vision untuk Klasifikasi Jenis Anggrek Berdasarkan Karakteristik Diameter Kelopak, Pola Bintik, dan Bentuk Labelium"**

### 1.2 Deskripsi Singkat

Sistem klasifikasi otomatis untuk membedakan **3 jenis anggrek** (Phalaenopsis, Dendrobium, Vanda) menggunakan algoritma **Decision Tree** dengan fitur yang diekstrak secara manual (handcrafted features) dari citra digital. Sistem dilengkapi web application dengan fitur upload dataset, training model, dan prediksi (image/video/webcam) dengan output berupa hasil klasifikasi, jalur keputusan (decision path), serta tingkat akurasi.

### 1.3 Output Akhir

- ✅ Model Decision Tree terlatih (`.pkl` file)
- ✅ Web application full-feature (upload dataset, training, prediction)
- ✅ Visualisasi decision tree & feature importance
- ✅ Confusion matrix & metrik evaluasi
- ✅ Dokumentasi skripsi (BAB 1–5)

---

## 2. LATAR BELAKANG & JUSTIFIKASI

### 2.1 Latar Belakang

Indonesia merupakan salah satu negara dengan keanekaragaman anggrek tertinggi di dunia. Identifikasi jenis anggrek umumnya dilakukan secara manual oleh ahli botani berdasarkan ciri morfologi seperti bentuk kelopak, ukuran, dan bentuk labelium (bibir bunga). Proses ini memakan waktu dan membutuhkan keahlian khusus.

Dengan kemajuan teknologi computer vision dan machine learning, identifikasi tersebut dapat diotomatisasi. Namun, sebagian besar penelitian existing menggunakan pendekatan **deep learning (CNN)** yang bersifat *black-box* — sulit menjelaskan mengapa model memutuskan suatu klasifikasi tertentu.

### 2.2 Justifikasi Pemilihan Decision Tree

| Aspek | Alasan |
|-------|--------|
| **Interpretability** | Decision Tree menghasilkan aturan if-then yang dapat dipahami manusia. Cocok untuk justifikasi keilmuan. |
| **Domain Knowledge Driven** | Fitur yang digunakan (diameter, bintik, labelium) sesuai dengan ciri taksonomi botani anggrek. |
| **Resource Friendly** | Training cepat (~detik), tidak butuh GPU. Cocok untuk laptop spesifikasi rendah. |
| **Novelty untuk Skripsi** | Kombinasi *computer vision* untuk feature extraction + *classical ML* untuk classification. |
| **Explainable AI** | Sejalan dengan tren XAI (Explainable AI) yang penting di research modern. |

### 2.3 Justifikasi Pemilihan 3 Kelas

Phalaenopsis, Dendrobium, dan Vanda dipilih karena:
- Merupakan 3 genus anggrek paling populer di Indonesia
- Memiliki ciri morfologi yang **berbeda secara signifikan** (lihat infografis acuan)
- Dataset relatif mudah dikumpulkan dari kebun/penjual lokal

---

## 3. TUJUAN & RUANG LINGKUP

### 3.1 Tujuan Umum

Membangun sistem klasifikasi anggrek berbasis web yang dapat mengidentifikasi 3 jenis anggrek dengan justifikasi keputusan yang transparan.

### 3.2 Tujuan Khusus

1. Mengekstrak fitur morfologi (diameter relatif, jumlah bintik, rasio labelium) dari citra anggrek
2. Melatih model Decision Tree menggunakan fitur tersebut
3. Mengukur akurasi model dengan metrik standar (accuracy, precision, recall, F1-score)
4. Mengimplementasikan sistem dalam bentuk web application
5. Menyediakan visualisasi *decision path* untuk setiap prediksi

### 3.3 Ruang Lingkup (Scope)

**Termasuk dalam scope:**
- ✅ 3 kelas: Phalaenopsis, Dendrobium, Vanda
- ✅ Input: gambar (jpg/png), video (mp4), webcam streaming
- ✅ Hanya untuk **bunga yang sudah mekar** (bukan kuncup)
- ✅ Single flower per image (1 bunga dominan)
- ✅ Background relatif kontras dengan bunga

**Di luar scope (limitations):**
- ❌ Sub-spesies/varietas dalam tiap genus
- ❌ Identifikasi jenis selain 3 kelas tersebut
- ❌ Foto multiple species dalam 1 frame
- ❌ Foto sangat blur / pencahayaan ekstrim
- ❌ Identifikasi penyakit/kondisi tanaman
- ❌ Deteksi anggrek di dalam video kompleks (banyak objek)

---

## 4. SPESIFIKASI SISTEM

### 4.1 Spesifikasi Hardware Development

**Laptop Pengembang (Axioo SlimBook Hype 10):**
- CPU: Intel Celeron N4020 (2 cores, 1.1 GHz)
- RAM: 8 GB
- Storage: ~5 GB free space
- GPU: Tidak ada (integrated only)
- OS: Windows 11 Home

**Implikasi:**
- Training Decision Tree: ✅ Aman (CPU-based, cepat)
- Inference image: ✅ Aman (~1-3 detik per gambar)
- Inference video: ⚠️ Mungkin lag (skip frame strategy)
- Inference webcam realtime: ⚠️ Target 2-5 FPS, bukan 30 FPS

### 4.2 Spesifikasi Software

| Software | Versi | Keperluan |
|----------|-------|-----------|
| Python | 3.10+ | Runtime utama |
| OpenCV | 4.8+ | Image processing |
| scikit-learn | 1.3+ | Decision Tree |
| FastAPI | 0.104+ | Web backend |
| Uvicorn | 0.24+ | ASGI server |
| NumPy | 1.24+ | Numerical ops |
| Pandas | 2.0+ | Data manipulation |
| Matplotlib | 3.7+ | Visualisasi |
| Pillow | 10.0+ | Image I/O |
| python-multipart | latest | File upload handling |

### 4.3 Spesifikasi Browser (Client)

- Chrome/Edge versi terbaru (untuk `getUserMedia` API webcam)
- JavaScript enabled
- Permission akses kamera (untuk fitur webcam)

---

## 5. ARSITEKTUR SISTEM

### 5.1 Arsitektur High-Level

```
┌──────────────────────────────────────────────────────┐
│                   BROWSER (Client)                    │
│  ┌──────────────┬──────────────┬──────────────────┐  │
│  │ Tab: Upload  │ Tab: Train   │ Tab: Predict     │  │
│  │   Dataset    │   Model      │   (3 mode)       │  │
│  └──────────────┴──────────────┴──────────────────┘  │
└────────────────────┬─────────────────────────────────┘
                     │ HTTP / WebSocket
                     ▼
┌──────────────────────────────────────────────────────┐
│             FASTAPI BACKEND (localhost:8000)         │
│  ┌────────────────────────────────────────────────┐  │
│  │ Routes:                                        │  │
│  │  POST /api/dataset/upload                      │  │
│  │  GET  /api/dataset/stats                       │  │
│  │  DELETE /api/dataset/clear                     │  │
│  │  POST /api/model/train                         │  │
│  │  GET  /api/model/info                          │  │
│  │  POST /api/predict/image                       │  │
│  │  POST /api/predict/video                       │  │
│  │  WS   /api/predict/webcam                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Service Layer:                                 │  │
│  │  - feature_extractor.py                        │  │
│  │  - decision_tree_model.py                      │  │
│  │  - dataset_manager.py                          │  │
│  │  - visualizer.py                               │  │
│  └────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│                  LOCAL FILE SYSTEM                    │
│  /data/raw/Phalaenopsis/*.jpg                        │
│  /data/raw/Dendrobium/*.jpg                          │
│  /data/raw/Vanda/*.jpg                               │
│  /data/features/features.csv                         │
│  /models/decision_tree_latest.pkl                    │
│  /models/training_history.json                       │
│  /static/visualizations/*.png                        │
└──────────────────────────────────────────────────────┘
```

### 5.2 Data Flow — Upload Dataset

```
User pilih folder/file
    → Browser kirim file via FormData
    → Backend terima di /api/dataset/upload
    → Validasi (ekstensi, ukuran)
    → Simpan ke /data/raw/<class>/
    → Return: { success, jumlah_file, total_per_class }
```

### 5.3 Data Flow — Training

```
User klik "Train Model"
    → Backend baca semua file di /data/raw/<class>/
    → Loop tiap gambar:
        → Preprocessing
        → Segmentasi bunga
        → Ekstrak 3 fitur → [diameter, bintik, rasio_bibir]
    → Susun DataFrame [features + label]
    → Split train/test (80/20)
    → Fit DecisionTreeClassifier
    → Evaluasi (accuracy, precision, recall, F1)
    → Simpan model.pkl, visualisasi tree, confusion matrix
    → Return: { metrics, tree_image_url, cm_image_url }
```

### 5.4 Data Flow — Prediction

```
User upload gambar / start webcam
    → Backend terima frame/gambar
    → Preprocessing & segmentasi
    → Ekstrak fitur
    → Load model.pkl
    → Predict → class + probability
    → Trace decision path (node by node)
    → Return: {
        prediction: "Dendrobium",
        confidence: 0.87,
        features: { diameter: 0.45, bintik: 23, rasio: 0.18 },
        decision_path: [
          "diameter_relatif <= 0.55 → True",
          "jumlah_bintik <= 30 → True",
          "→ Prediksi: Dendrobium"
        ],
        feature_importance: { diameter: 0.5, bintik: 0.3, rasio: 0.2 }
      }
>>>>>>> 2dbac7157f0ef19952ad9a6552dc4e58fa95078d
```

---

<<<<<<< HEAD
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
=======
## 6. METODOLOGI

### 6.1 Tahapan Penelitian

```
┌─────────────────────────────────────────────────┐
│  TAHAP 1: STUDI LITERATUR & DATA COLLECTION     │
│  - Riset karakteristik 3 jenis anggrek          │
│  - Kumpulkan dataset (min 50 gambar/kelas)      │
│  - Validasi labeling dengan ahli/referensi      │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 2: IMAGE PROCESSING PIPELINE             │
│  - Eksperimen segmentasi (HSV threshold)        │
│  - Validasi visual hasil segmentasi             │
│  - Tuning parameter morfologi                   │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 3: FEATURE ENGINEERING                   │
│  - Implementasi 3 fitur ekstraksi               │
│  - Generate features.csv                        │
│  - Analisis distribusi fitur per kelas          │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 4: MODELING                              │
│  - Training Decision Tree                       │
│  - Hyperparameter tuning (max_depth, criterion) │
│  - Cross-validation                             │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 5: EVALUATION                            │
│  - Confusion matrix                             │
│  - Accuracy, Precision, Recall, F1              │
│  - Visualisasi tree & feature importance        │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 6: DEPLOYMENT (WEB APP)                  │
│  - Build FastAPI backend                        │
│  - Build frontend (HTML/CSS/JS)                 │
│  - Integration testing                          │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  TAHAP 7: DOKUMENTASI & PENULISAN SKRIPSI       │
└─────────────────────────────────────────────────┘
```

### 6.2 Metode Pemrosesan Citra

**Preprocessing:**
1. Load gambar (BGR via OpenCV)
2. Resize ke max 640px (jaga aspect ratio) — untuk efisiensi
3. Gaussian Blur (5×5 kernel) — reduce noise
4. Konversi ke HSV color space — untuk segmentasi warna

**Segmentasi:**
1. HSV thresholding untuk warna bunga:
   - Range 1: Pink-Magenta (H: 140–175)
   - Range 2: Ungu-Violet (H: 120–150)
   - Range 3: Putih (S rendah, V tinggi)
2. Gabungkan mask dengan operasi `bitwise_or`
3. Morphological closing (kernel 7×7) — isi lubang
4. Morphological opening — hapus noise kecil
5. Find contours → pilih yang terbesar = area bunga

**Verifikasi:** Simpan gambar segmentasi untuk visual check.

---

## 7. SPESIFIKASI FITUR (FEATURE ENGINEERING)

Sistem menggunakan **3 fitur utama** yang merepresentasikan ciri taksonomi anggrek.

### 7.1 Fitur 1: Diameter Relatif

**Definisi:** Rasio lebar bounding box bunga terhadap lebar gambar.

**Formula:**
```
diameter_relatif = bbox_width / image_width
```

**Rentang Nilai:** 0.0 – 1.0

**Interpretasi Botani:**
| Genus | Diameter Asli | Diameter Relatif (estimasi) |
|-------|---------------|------------------------------|
| Dendrobium | 3–7 cm | Kecil (< 0.45) |
| Phalaenopsis | 6–12 cm | Sedang (0.40 – 0.65) |
| Vanda | 7–15 cm | Besar (> 0.55) |

**Catatan:** Karena ini *relatif* (bukan cm absolut), nilai sangat tergantung jarak foto. Diasumsikan user memotret close-up dengan bunga sebagai subjek utama.

### 7.2 Fitur 2: Jumlah Bintik

**Definisi:** Banyaknya blob/spot pada permukaan kelopak yang warnanya kontras dengan warna dominan kelopak.

**Metode Deteksi:**
1. Crop area bunga dari mask segmentasi
2. Konversi ke grayscale
3. Adaptive thresholding untuk highlight bintik (area gelap di kelopak terang, atau sebaliknya)
4. Find contours kecil (area 5 ≤ A ≤ 200 piksel)
5. Filter berdasarkan circularity (> 0.5)
6. Hitung jumlahnya

**Rentang Nilai:** 0 – 300+

**Interpretasi Botani:**
| Genus | Jumlah Bintik |
|-------|---------------|
| Dendrobium | Sedikit (0–50) |
| Phalaenopsis | Sedang (0–200, banyak varietas) |
| Vanda | Banyak (50–300+, ciri khas pola jaring) |

### 7.3 Fitur 3: Rasio Labelium

**Definisi:** Rasio area labelium (bibir bunga) terhadap total area bunga.

**Formula:**
```
rasio_labelium = area_labelium / area_bunga_total
```

**Metode Deteksi:**
1. Pada area bunga, cari pixel dengan saturasi tertinggi & nilai paling kontras
2. Biasanya labelium = warna paling gelap/saturated di tengah bunga
3. K-Means clustering (k=2–3) untuk pisahkan kelopak vs labelium
4. Hitung area cluster yang di tengah

**Rentang Nilai:** 0.0 – 1.0

**Interpretasi Botani:**
| Genus | Bentuk Labelium | Rasio (estimasi) |
|-------|-----------------|-------------------|
| Phalaenopsis | Lebar, trilobus (kupu-kupu) | Sedang (0.10 – 0.25) |
| Dendrobium | Corong/trompet | Besar (0.20 – 0.35) |
| Vanda | Memanjang, strap-like | Kecil (< 0.15) |

### 7.4 Ringkasan Fitur

| # | Nama Fitur | Tipe | Rentang | Sumber |
|---|------------|------|---------|--------|
| 1 | `diameter_relatif` | float | 0.0–1.0 | Bounding box bunga |
| 2 | `jumlah_bintik` | int | 0–300+ | Blob detection |
| 3 | `rasio_labelium` | float | 0.0–1.0 | Segmentasi labelium |

**Catatan untuk Skripsi:** Pada bab metodologi, jelaskan setiap fitur dengan:
- Definisi formal
- Justifikasi botanis (rujukan ke infografis spesifikasi anggrek)
- Algoritma ekstraksi (pseudocode)
- Contoh visual hasil ekstraksi

---

## 8. SPESIFIKASI DECISION TREE

### 8.1 Algoritma

**Algoritma:** CART (Classification and Regression Tree) via `sklearn.tree.DecisionTreeClassifier`

**Hyperparameter Default:**
```python
DecisionTreeClassifier(
    criterion='gini',           # atau 'entropy' untuk perbandingan
    max_depth=5,                # batasi agar tidak overfitting
    min_samples_split=4,        # min sample untuk split node
    min_samples_leaf=2,         # min sample di leaf
    random_state=42             # reproducibility
)
```

**Hyperparameter Tuning (untuk skripsi):**
Eksperimen dengan:
- `criterion`: gini vs entropy
- `max_depth`: 3, 5, 7, None
- `min_samples_split`: 2, 4, 6

Pilih kombinasi dengan akurasi validasi tertinggi.

### 8.2 Decision Path & Explainability

Setelah prediksi, sistem menelusuri **decision path**:

```
Contoh output:
{
  "prediction": "Dendrobium",
  "confidence": 0.85,
  "decision_path": [
    {
      "node_id": 0,
      "feature": "jumlah_bintik",
      "threshold": 75.5,
      "value": 28,
      "decision": "28 <= 75.5 → True (kiri)"
    },
    {
      "node_id": 1,
      "feature": "diameter_relatif",
      "threshold": 0.48,
      "value": 0.42,
      "decision": "0.42 <= 0.48 → True (kiri)"
    },
    {
      "node_id": 3,
      "feature": "LEAF",
      "prediction": "Dendrobium",
      "samples": 45,
      "purity": 0.91
    }
  ]
}
```

### 8.3 Visualisasi Tree

Gunakan `sklearn.tree.plot_tree()` atau `graphviz` untuk render tree menjadi gambar PNG. Tampilkan di web app.

### 8.4 Feature Importance

Setelah training, ekstrak `model.feature_importances_`:
```
{
  "diameter_relatif": 0.42,
  "jumlah_bintik": 0.38,
  "rasio_labelium": 0.20
}
```

Visualisasi sebagai bar chart.

---

## 9. SPESIFIKASI WEB APPLICATION

### 9.1 Halaman & Fitur

#### 9.1.1 Halaman Utama (Dashboard)

**Komponen:**
- Header: Logo + Judul Proyek
- Statistik: Jumlah dataset per kelas, status model (trained/not trained)
- Navigasi 3 tab utama

#### 9.1.2 Tab 1: Upload Dataset

**Komponen:**
- Dropdown pilih kelas (Phalaenopsis / Dendrobium / Vanda)
- File input (multiple, accept image/*)
- Drag & drop area
- Preview thumbnail file yang akan diupload
- Tombol "Upload"
- Tabel statistik dataset:
  | Kelas | Jumlah Gambar | Aksi |
  |-------|---------------|------|
  | Phalaenopsis | 52 | [Lihat] [Hapus] |
  | Dendrobium | 48 | [Lihat] [Hapus] |
  | Vanda | 31 | [Lihat] [Hapus] |

**Validasi:**
- Min 1 file
- Max 10 MB per file
- Format: .jpg, .jpeg, .png

#### 9.1.3 Tab 2: Training Model

**Komponen:**
- Panel "Pengaturan Training":
  - Slider `max_depth`: 3–10 (default 5)
  - Radio `criterion`: gini / entropy
  - Slider `test_size`: 0.1–0.3 (default 0.2)
- Tombol "Mulai Training" (disabled jika dataset < 10 per kelas)
- Progress bar saat training
- Hasil Training:
  - **Card Metrik:** Accuracy, Precision, Recall, F1 (4 card)
  - **Confusion Matrix:** Gambar 3×3 dengan label
  - **Visualisasi Tree:** Gambar tree (dengan zoom feature)
  - **Feature Importance:** Bar chart
  - **Tombol Download Model** (.pkl)

#### 9.1.4 Tab 3: Prediksi

**Sub-tab:**

**A. Upload Gambar**
- Drag & drop / file picker
- Preview gambar
- Tombol "Prediksi"
- Output:
  - Hasil: "Phalaenopsis (87% confidence)"
  - Gambar dengan bounding box bunga
  - Tabel fitur yang diekstrak
  - **Decision Path** (step by step)
  - Bar chart probabilitas tiap kelas

**B. Upload Video**
- File picker (.mp4, .mov)
- Setting: skip N frames (default 5)
- Tombol "Proses Video"
- Output: video player dengan overlay prediksi + tabel ringkasan

**C. Webcam**
- Tombol "Aktifkan Kamera"
- Live preview (canvas) dengan overlay prediksi real-time
- FPS counter
- Tombol "Capture & Analisis Detail"

### 9.2 API Endpoint Specification

| Method | Endpoint | Body/Params | Response |
|--------|----------|-------------|----------|
| `POST` | `/api/dataset/upload` | `multipart: class, files[]` | `{success, uploaded_count, total}` |
| `GET` | `/api/dataset/stats` | - | `{Phalaenopsis: 50, Dendrobium: 48, Vanda: 30}` |
| `DELETE` | `/api/dataset/clear` | `?class=...` | `{success, deleted_count}` |
| `POST` | `/api/model/train` | `json: {max_depth, criterion, test_size}` | `{metrics, tree_url, cm_url, fi_url}` |
| `GET` | `/api/model/info` | - | `{trained_at, accuracy, classes, features}` |
| `POST` | `/api/predict/image` | `multipart: file` | `{prediction, confidence, features, decision_path}` |
| `POST` | `/api/predict/video` | `multipart: file` | `{frames: [{frame_idx, prediction}], summary}` |
| `WS` | `/api/predict/webcam` | base64 frames | streaming `{prediction, confidence}` per frame |

### 9.3 UI/UX Guidelines

- Warna utama: ungu/pink (sesuai tema anggrek)
- Font: sans-serif (Inter / system font)
- Layout: responsive (desktop priority)
- Loading state untuk setiap aksi async
- Error handling: tampilkan pesan error yang jelas
- Empty state untuk dataset/model yang belum ada

---

## 10. STRUKTUR PROYEK & FILE

```
orchid-classifier/
├── README.md
├── requirements.txt
├── .gitignore
├── run.py                          # Entry point: uvicorn launcher
│
├── app/                            # FastAPI application
│   ├── __init__.py
│   ├── main.py                     # FastAPI app instance
│   ├── config.py                   # Konfigurasi (paths, params)
│   │
│   ├── routers/                    # API endpoints
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   ├── model.py
│   │   └── predict.py
│   │
│   ├── services/                   # Business logic
│   │   ├── __init__.py
│   │   ├── feature_extractor.py    # Ekstrak 3 fitur
│   │   ├── decision_tree_model.py  # Wrapper sklearn
│   │   ├── dataset_manager.py      # CRUD dataset
│   │   ├── image_processor.py      # Segmentasi & preprocessing
│   │   └── visualizer.py           # Generate tree image, CM
│   │
│   └── schemas/                    # Pydantic models
│       ├── __init__.py
│       ├── dataset.py
│       ├── model.py
│       └── predict.py
│
├── static/                         # Frontend
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── upload.js
│   │   ├── training.js
│   │   ├── predict.js
│   │   └── webcam.js
│   └── visualizations/             # Generated images (tree, CM)
│
├── data/                           # Dataset & features
│   ├── raw/
│   │   ├── Phalaenopsis/*.jpg
│   │   ├── Dendrobium/*.jpg
│   │   └── Vanda/*.jpg
│   └── features/
│       └── features.csv
│
├── models/                         # Trained models
│   ├── decision_tree_latest.pkl
│   ├── decision_tree_v1.pkl
│   ├── decision_tree_v2.pkl
│   └── training_history.json
│
├── notebooks/                      # Jupyter untuk eksperimen
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_extraction_test.ipynb
│   └── 03_model_experiments.ipynb
│
├── tests/                          # Unit test (opsional tapi keren)
│   ├── test_feature_extractor.py
│   └── test_model.py
│
└── docs/                           # Dokumentasi skripsi
    ├── proposal.md
    ├── bab1_pendahuluan.md
    ├── bab2_tinjauan_pustaka.md
    ├── bab3_metodologi.md
    ├── bab4_hasil.md
    └── bab5_kesimpulan.md
>>>>>>> 2dbac7157f0ef19952ad9a6552dc4e58fa95078d
```

---

<<<<<<< HEAD
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
=======
## 11. STACK TEKNOLOGI

### 11.1 Backend

| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Bahasa | Python 3.10+ | Ekosistem ML/CV terbaik |
| Web Framework | FastAPI | Async, dokumentasi otomatis (Swagger), cepat |
| ASGI Server | Uvicorn | Standard FastAPI |
| Image Processing | OpenCV (cv2) | Library CV paling lengkap |
| ML Library | scikit-learn | Decision Tree implementation |
| Numerical | NumPy, Pandas | Standard data science |
| Visualization | Matplotlib, Seaborn | Untuk generate tree image, CM |
| Model Serialization | Joblib / Pickle | Simpan model trained |

### 11.2 Frontend

| Komponen | Teknologi | Alasan |
|----------|-----------|--------|
| Markup | HTML5 | Standard |
| Styling | Tailwind CSS (CDN) atau Vanilla CSS | Cepat, ringan |
| Scripting | Vanilla JavaScript (ES6+) | No build tool, simple |
| Webcam | `getUserMedia()` API | Native browser |
| Charts | Chart.js (CDN) | Untuk probability bar chart |
| HTTP | Fetch API | Native |
| WebSocket | Native WebSocket API | Untuk webcam streaming |

### 11.3 Development Tools

| Tool | Keperluan |
|------|-----------|
| VS Code | Editor |
| Git + GitHub | Version control |
| Jupyter Notebook | Eksperimen feature extraction |
| Postman / Thunder Client | Testing API |
| Browser DevTools | Debug frontend |

### 11.4 Tidak Digunakan (Justifikasi)

| Teknologi | Alasan Tidak Dipakai |
|-----------|----------------------|
| TensorFlow/PyTorch | Tidak butuh deep learning |
| Roboflow | Tidak butuh annotation bounding box |
| Google Colab | Training cepat, bisa local |
| React/Vue | Overkill untuk skala ini |
| Docker | Tidak butuh containerization untuk skripsi |
| Database (MySQL/PostgreSQL) | File system cukup, dataset tidak besar |

---

## 12. DATASET PLAN

### 12.1 Target Dataset

| Kelas | Target Min | Target Ideal | Sumber |
|-------|------------|--------------|--------|
| Phalaenopsis | 50 | 100 | Koleksi pribadi + kebun anggrek lokal |
| Dendrobium | 50 | 100 | Koleksi pribadi + kebun anggrek lokal |
| Vanda | 50 | 100 | Koleksi pribadi + internet (jika scarce) |
| **TOTAL** | **150** | **300** | |

### 12.2 Kriteria Gambar Valid

- ✅ Bunga **mekar penuh** (bukan kuncup)
- ✅ Bunga sebagai **subjek utama** (porsi ≥ 30% gambar)
- ✅ Pencahayaan **cukup** (tidak terlalu gelap/silau)
- ✅ Fokus **tajam** pada bunga
- ✅ Background **kontras** (hindari bunga di antara bunga lain sejenis)
- ✅ Resolusi minimum 640×480

### 12.3 Kriteria Gambar Invalid (skip)

- ❌ Buram berat
- ❌ Multiple bunga sejenis tumpang tindih
- ❌ Bunga tertutup tangan/objek lain > 30%
- ❌ Watermark besar
- ❌ Drawing/ilustrasi (harus foto asli)

### 12.4 Strategi Pengumpulan

1. **Koleksi pribadi:** Foto langsung dari kebun (sudah mulai)
2. **Komunitas pecinta anggrek:** Grup FB/WA, minta izin pakai
3. **Internet (last resort):** Google Images dengan filter "labeled for reuse"
4. **Augmentasi (jika dataset kurang):**
   - Horizontal flip
   - Rotation ±15°
   - Brightness ±20%
   - **JANGAN** vertical flip (bunga punya orientasi)

### 12.5 Split Strategy

- **Training:** 70%
- **Validation:** 15%
- **Testing:** 15%

Atau pakai **K-Fold Cross Validation (k=5)** untuk evaluasi lebih robust.

### 12.6 Labeling

Format folder-based (sesuai pendekatan classification):
```
data/raw/
├── Phalaenopsis/
│   ├── phal_001.jpg
│   ├── phal_002.jpg
│   └── ...
├── Dendrobium/
│   ├── dend_001.jpg
│   └── ...
└── Vanda/
    ├── vand_001.jpg
    └── ...
```

**Konvensi penamaan:** `<class_prefix>_<nomor_urut>.jpg`

---

## 13. EVALUATION PLAN

### 13.1 Metrik Evaluasi

| Metrik | Formula | Target |
|--------|---------|--------|
| **Accuracy** | (TP+TN)/(TP+TN+FP+FN) | ≥ 75% |
| **Precision (per kelas)** | TP/(TP+FP) | ≥ 70% |
| **Recall (per kelas)** | TP/(TP+FN) | ≥ 70% |
| **F1-Score (per kelas)** | 2·(P·R)/(P+R) | ≥ 70% |
| **Macro F1** | rata-rata F1 per kelas | ≥ 70% |

### 13.2 Confusion Matrix

Format 3×3:
```
                Predicted
              Pha  Den  Van
Actual  Pha [  ?    ?    ? ]
        Den [  ?    ?    ? ]
        Van [  ?    ?    ? ]
```

### 13.3 Analisis Tambahan

1. **Feature Importance Analysis** — fitur mana paling berpengaruh
2. **Error Analysis** — sample gambar yang miss-classified, why?
3. **Decision Tree Depth Analysis** — apakah tree overfitting di kedalaman tertentu?
4. **Per-class Performance** — kelas mana paling sulit dibedakan? (kemungkinan: foto Dendrobium ungu mirip Phalaenopsis ungu)

### 13.4 Baseline Comparison (opsional)

Untuk skripsi yang lebih kuat, bandingkan Decision Tree dengan:
- **Dummy Classifier** (random/most-frequent) — sebagai baseline minimum
- **Random Forest** dengan fitur yang sama
- **SVM** dengan fitur yang sama

Tabel hasil:
| Model | Accuracy | F1-Score | Training Time |
|-------|----------|----------|----------------|
| Dummy | ~33% | - | < 1s |
| **Decision Tree** | ? | ? | ? |
| Random Forest | ? | ? | ? |
| SVM | ? | ? | ? |

---

## 14. TIMELINE & MILESTONE

### 14.1 Timeline 6 Minggu (intensif)

| Minggu | Aktivitas | Deliverable |
|--------|-----------|--------------|
| **1** | Studi literatur + kumpulkan dataset (min 50/kelas) | Dataset awal di folder terstruktur |
| **2** | Eksperimen feature extraction di Jupyter | Notebook + features.csv |
| **3** | Training Decision Tree + evaluation | Model.pkl + confusion matrix + tree.png |
| **4** | Build FastAPI backend (semua endpoint) | API jalan local, tested via Postman |
| **5** | Build frontend (3 tab + webcam) | Web app lengkap, tested manual |
| **6** | Testing menyeluruh + dokumentasi skripsi | BAB 1-5 draft selesai |

### 14.2 Timeline 12 Minggu (santai/realistis untuk skripsi)

| Bulan | Minggu | Aktivitas |
|-------|--------|-----------|
| **Bulan 1** | 1–2 | Proposal + Bab 1 (Pendahuluan) + Bab 2 (Tinjauan Pustaka) |
| | 3–4 | Pengumpulan dataset + labeling |
| **Bulan 2** | 5–6 | Eksperimen feature extraction |
| | 7–8 | Training & evaluasi model |
| **Bulan 3** | 9 | Backend development |
| | 10 | Frontend development |
| | 11 | Integration & testing |
| | 12 | Penulisan Bab 4-5 + revisi |

### 14.3 Milestone Checkpoint

- ✅ **M1:** Dataset terkumpul (min 150 gambar)
- ✅ **M2:** Feature extraction berhasil untuk semua dataset
- ✅ **M3:** Model trained dengan akurasi ≥ 70%
- ✅ **M4:** Web app fungsional end-to-end
- ✅ **M5:** Skripsi draft selesai
- ✅ **M6:** Siap sidang

---

## 15. RISIKO & MITIGASI

### 15.1 Tabel Risiko

| # | Risiko | Probabilitas | Dampak | Mitigasi |
|---|--------|--------------|--------|----------|
| 1 | Dataset sulit terkumpul untuk Vanda | Tinggi | Tinggi | Cari ke kebun raya/komunitas, atau augmentasi |
| 2 | Akurasi model rendah (< 60%) | Sedang | Tinggi | Tambah fitur (warna, shape descriptor), tuning hyperparameter |
| 3 | Segmentasi gagal di background ramai | Sedang | Sedang | Pakai `rembg` (deep learning) untuk auto-background-removal |
| 4 | Laptop lambat untuk training | Rendah | Sedang | Decision Tree cepat, tidak masalah |
| 5 | Webcam tidak smooth realtime | Tinggi | Rendah | Set ekspektasi 2-5 FPS, atau capture mode |
| 6 | Diameter relatif tidak konsisten | Tinggi | Sedang | Ekspektasi setiap user foto dengan framing similar, atau ganti ke ratio bbox terhadap area |
| 7 | Bibir bunga sulit disegmentasi | Sedang | Sedang | Pakai K-means, atau fallback ke pakai 2 fitur saja |

### 15.2 Plan B (jika Decision Tree akurasi terlalu rendah)

1. **Tambah fitur:**
   - Warna dominan (rata-rata HSV kelopak)
   - Aspect ratio bunga (lebar/tinggi)
   - Texture features (GLCM)
2. **Ganti algoritma:**
   - Random Forest (ensemble, lebih robust)
   - Atau Hybrid: extract features + MLP simple
3. **Ubah scope:** Kurangi kelas (jadi 2 saja, atau sub-spesies yang lebih jelas berbeda)

---

## 16. GLOSARIUM

| Istilah | Definisi |
|---------|----------|
| **Anggrek** | Famili Orchidaceae, tumbuhan berbunga dengan ciri labelium |
| **Phalaenopsis** | Genus anggrek bulan, kelopak lebar bulat seperti kupu-kupu |
| **Dendrobium** | Genus anggrek dengan kelopak runcing, bibir berbentuk corong |
| **Vanda** | Genus anggrek dengan kelopak bermotif jaring, bibir strap-like |
| **Labelium** | Bibir bunga anggrek, kelopak ke-3 yang termodifikasi |
| **Diameter Kelopak** | Lebar terbentang dari ujung kelopak ke ujung lainnya |
| **Bounding Box** | Kotak terkecil yang menutupi objek dalam gambar |
| **HSV** | Color space Hue-Saturation-Value, lebih baik dari RGB untuk segmentasi warna |
| **Segmentasi** | Proses memisahkan objek (foreground) dari background |
| **Decision Tree** | Algoritma ML berbasis aturan pohon keputusan |
| **CART** | Classification and Regression Tree, algoritma decision tree |
| **Gini Impurity** | Metrik untuk evaluasi kualitas split node |
| **Entropy** | Alternatif Gini, dari information theory |
| **Feature Engineering** | Proses membuat fitur dari raw data |
| **Handcrafted Features** | Fitur yang didefinisikan manual oleh peneliti (vs learned features) |
| **Confusion Matrix** | Tabel evaluasi yang menunjukkan prediksi benar/salah per kelas |
| **Decision Path** | Jalur dari root ke leaf yang dilewati saat prediksi |
| **Feature Importance** | Skor kontribusi tiap fitur dalam keputusan model |
| **XAI** | Explainable AI, sub-bidang AI yang fokus interpretability |
| **FastAPI** | Web framework Python modern berbasis async |
| **WebSocket** | Protokol komunikasi 2-arah real-time |
| **getUserMedia** | JavaScript API untuk akses kamera/mikrofon browser |
| **Inference** | Proses prediksi menggunakan model yang sudah trained |

---

## CATATAN PENUTUP

Dokumentasi ini adalah **living document** — boleh direvisi seiring perkembangan proyek. Setiap perubahan signifikan (mis. tambah fitur, ganti algoritma) sebaiknya didokumentasikan di sini agar konsisten dengan laporan skripsi nantinya.

**Prinsip pengembangan:**
1. **Mulai dari prototype** — buat versi minimal dulu, baru iterasi
2. **Validasi tiap tahap** — jangan lanjut ke tahap berikutnya tanpa verifikasi
3. **Dokumentasikan keputusan** — terutama yang berbeda dari rencana awal
4. **Backup berkala** — gunakan Git, commit setiap milestone

---

**Versi Dokumen:** 1.0
**Tanggal:** 11 Mei 2026
**Status:** Draft Awal — Siap Diskusi
>>>>>>> 2dbac7157f0ef19952ad9a6552dc4e58fa95078d
