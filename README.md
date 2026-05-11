<div align="center">

# 🌸 Anggrek Classifier

### Klasifikasi Jenis Bunga Anggrek Berbasis Kamera dan Raspberry Pi<br/>Menggunakan Algoritma Pohon Keputusan (Decision Tree)

Sistem klasifikasi otomatis untuk membedakan **3 jenis anggrek** — *Phalaenopsis*, *Dendrobium*, dan *Vanda* — menggunakan **computer vision** dan **algoritma Decision Tree**. Dilengkapi web application full-feature dengan dukungan prediksi dari **gambar, video, dan webcam realtime**.

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5%2B-F7931E?logo=scikit-learn&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-4.10%2B-5C3EE8?logo=opencv&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-blue)

</div>

---

## 📜 Tentang Proyek

> **Skripsi · Tugas Akhir**

| Field | Detail |
|---|---|
| **Penulis** | **Rena Faizatul Widarsono** |
| **NIM** | 24045000048 |
| **Program Studi** | Teknik Elektro |
| **Fakultas** | Fakultas Teknik |
| **Institusi** | Universitas Merdeka Malang |

### Latar Belakang

Indonesia adalah salah satu negara dengan keanekaragaman anggrek tertinggi di dunia. Identifikasi jenis anggrek umumnya dilakukan secara manual oleh ahli botani berdasarkan ciri morfologi seperti bentuk kelopak, ukuran, dan bentuk labelium (bibir bunga). Proses ini memakan waktu dan membutuhkan keahlian khusus.

Penelitian-penelitian existing menggunakan pendekatan **deep learning (CNN)** yang bersifat *black-box* — sulit menjelaskan mengapa model memutuskan suatu klasifikasi. Proyek ini mengadopsi pendekatan berbeda: **Decision Tree** dengan *handcrafted features* yang sesuai dengan ciri taksonomi botani, sehingga hasil klasifikasi dapat dipertanggungjawabkan dan dijelaskan (Explainable AI).

### Kenapa Decision Tree?

| Aspek | Alasan |
|---|---|
| **🔍 Interpretability** | Menghasilkan aturan *if-then* yang dapat dipahami manusia |
| **🌱 Domain Knowledge Driven** | Fitur input (diameter, bintik, labelium) sesuai ciri taksonomi botani anggrek |
| **⚡ Resource Friendly** | Training cepat (~detik), tidak butuh GPU — cocok untuk Raspberry Pi |
| **🧪 Novelty** | Kombinasi *computer vision* untuk feature extraction + *classical ML* untuk classification |
| **🎓 Explainable AI** | Sejalan dengan tren XAI yang penting di research modern |

---

## ✨ Fitur Utama

### 📤 Manajemen Dataset
- Upload gambar per kelas via drag-and-drop atau file picker
- **Galeri preview thumbnail** dengan zoom modal
- Hapus per-file atau per-kelas atau semua dataset
- Validasi otomatis (format, ukuran maks 10MB)

### 🌳 Training Model
- Hyperparameter tunable: `max_depth`, `criterion`, `test_size`, `min_samples_split`, `min_samples_leaf`
- **Progress bar real-time** + **log streaming** (Server-Sent Events)
- Background job — UI tetap responsif saat training
- **Cancel** kapan saja, **reconnect** otomatis kalau halaman direfresh
- Output: tree visualization, confusion matrix, feature importance, metrics per-class
- Download model `.pkl` untuk pemakaian offline

### 🔮 Prediksi Multi-mode

<table>
<tr>
<td width="33%">

**🖼️ Gambar**
- Upload single image
- Bounding box detection
- Decision path step-by-step
- Probability chart per kelas

</td>
<td width="33%">

**🎬 Video**
- Background job dengan SSE progress
- Live frame-by-frame analysis
- Skip-frame configurable
- Ringkasan kelas dominan

</td>
<td width="33%">

**📷 Webcam**
- Streaming realtime via WebSocket
- Busy-flag drop-frame protection
- Resolusi adaptif (320×240)
- FPS counter

</td>
</tr>
</table>

### 📖 Tab Info
- Profil proyek + identitas penulis
- 5 acuan morfologi anggrek (gambar referensi)
- Penjelasan 6 fitur yang diekstrak
- Penjelasan tech stack

### 🎨 UX untuk Awam
- Welcome banner 3-step tutorial (dismissable, bisa dimunculkan lagi)
- Help boxes di setiap tab (apa yang harus dilakukan, contoh foto bagus/jelek)
- Tooltip ⓘ pada setiap parameter teknis dengan penjelasan plain language
- Hasil prediksi dalam bahasa Indonesia natural ("Diameter relatif" bukan `diameter_relatif`)

### 🛡️ Reliability
- **Job manager** mencegah training paralel & race condition pada model file
- **`run_in_executor`** untuk operasi heavy → event loop FastAPI tetap responsif
- **Model file locking** dengan caching berbasis mtime
- **Auto-reconnect** SSE saat refresh halaman
- **Path traversal protection** pada endpoint file akses

---

## 🧱 Tech Stack

### Backend
| Komponen | Teknologi | Versi | Peran |
|---|---|---|---|
| Bahasa | Python | 3.10+ | Runtime utama |
| Web Framework | FastAPI | 0.115+ | Async REST API + WebSocket + SSE |
| ASGI Server | Uvicorn | 0.32+ | Production server |
| Image Processing | OpenCV | 4.10+ | Preprocessing, segmentasi, feature extraction |
| ML Library | scikit-learn | 1.5+ | Decision Tree (CART), evaluation |
| Numerical | NumPy, Pandas | latest | Data manipulation |
| Visualization | Matplotlib, Seaborn | latest | Tree, CM, FI plots |
| Model Serialization | Joblib | 1.4+ | Save/load model `.pkl` |

### Frontend
| Komponen | Teknologi | Versi | Peran |
|---|---|---|---|
| Build Tool | Vite | 5 | Dev server + production build |
| Framework | React + TypeScript | 18 + 5 | UI library |
| Styling | Tailwind CSS | 3 | Utility-first styling |
| UI Primitives | shadcn/ui (Radix) | latest | Accessible components |
| Icons | Lucide React | 0.460 | Icon system |
| Charts | Chart.js + react-chartjs-2 | 4 + 5 | Probability bar charts |
| HTTP | Fetch API | native | API calls + SSE streaming |
| WebSocket | Native WebSocket | native | Webcam realtime |

---

## 🏗️ Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                       │
│  ┌──────────┬──────────┬──────────┬──────────────────────┐   │
│  │   Info   │  Upload  │ Training │    Prediksi          │   │
│  │   Tab    │   Tab    │   Tab    │ (Gambar/Video/Webcam)│   │
│  └──────────┴──────────┴──────────┴──────────────────────┘   │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTP · SSE · WebSocket
                        ▼
┌──────────────────────────────────────────────────────────────┐
│              FASTAPI BACKEND (localhost:8000)                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Routers                                              │    │
│  │  • /api/dataset/*  — CRUD dataset                    │    │
│  │  • /api/model/*    — Training (job-based, SSE)       │    │
│  │  • /api/predict/*  — Image/Video/Webcam              │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Services                                             │    │
│  │  • image_processor    — HSV + GrabCut segmentation   │    │
│  │  • feature_extractor  — 6 morphology features        │    │
│  │  • decision_tree      — Train + predict + explain    │    │
│  │  • job_manager        — Background tasks + cancel    │    │
│  │  • visualizer         — Tree/CM/FI rendering         │    │
│  │  • dataset_manager    — File CRUD                    │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                    LOCAL FILE SYSTEM                          │
│  data/raw/{Phalaenopsis,Dendrobium,Vanda}/*.jpg              │
│  data/features/features.csv                                   │
│  models/decision_tree_latest.pkl                              │
│  static/visualizations/{tree,confusion_matrix,fi}.png         │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow — Training
```
User klik "Mulai Training"
  → POST /api/model/train (return job_id)
  → Backend spawn background thread
  → SSE stream /api/model/train/{id}/stream
  → Loop dataset:
      → Preprocessing (resize, blur)
      → Segmentasi (HSV + GrabCut)
      → Pilih kontur dominan
      → Ekstrak 6 fitur → emit progress
  → Build features.csv
  → train_test_split (stratified)
  → DecisionTreeClassifier.fit()
  → Evaluasi (accuracy, precision, recall, F1)
  → Save model.pkl (with lock)
  → Render tree.png, cm.png, fi.png
  → Emit "complete" event
```

### Data Flow — Prediction
```
User upload gambar
  → POST /api/predict/image
  → Backend: loop.run_in_executor (non-blocking)
      → Load image
      → Segmentasi
      → Ekstrak 6 fitur
      → Load model (cached, with mtime check)
      → DecisionTreeClassifier.predict()
      → Trace decision path (node-by-node)
      → Encode annotated image (base64)
  → Return JSON: {prediction, confidence, features, decision_path, ...}
```

---

## 🔬 6 Fitur Morfologi

Sistem mengekstrak 6 ciri kuantitatif dari setiap citra:

| # | Fitur | Tipe | Rentang | Sumber | Justifikasi Botani |
|---|---|---|---|---|---|
| 1 | `diameter_relatif` | float | 0.0–1.0 | Bounding box ÷ lebar gambar | Phalaenopsis sedang, Dendrobium kecil, Vanda besar |
| 2 | `jumlah_bintik` | int | 0–300+ | Blob detection (5–200 px, circularity ≥ 0.45) | Vanda 50–300+ (jaring), Dendrobium 0–50 |
| 3 | `rasio_labelium` | float | 0.0–1.0 | K-Means k=2 berbasis saturasi | Bentuk bibir bunga (trilobus / corong / strap-like) |
| 4 | `aspect_ratio` | float | 0.3–3.0 | Lebar ÷ tinggi bbox | Phalaenopsis bulat, Vanda lonjong |
| 5 | `dominant_hue` | float | 0–180 | Median Hue (HSV) di area bunga | Pink, ungu, kuning, putih |
| 6 | `dominant_saturation` | float | 0–255 | Median Saturation di area bunga | Kepekatan warna kelopak |

### Pipeline Segmentasi
1. **Resize** ke max 640px (jaga aspect ratio)
2. **Gaussian Blur** 5×5 untuk reduce noise
3. **HSV color thresholding** dengan multi-range (pink, magenta, ungu, putih, kuning)
4. **Morphological closing + opening** untuk bersihkan mask
5. **GrabCut refinement** dengan inisialisasi mask + center prior
6. **Dominant flower selection** — pilih kontur terbesar terdekat ke pusat gambar

---

## 🚀 Quick Start

### Prasyarat

- **Python** 3.10+ (tested pada 3.14.5)
- **Node.js** 20+ dan **npm** ([download LTS](https://nodejs.org/))
- Browser modern (Chrome / Edge) untuk akses webcam
- ~500 MB disk space untuk dependencies

### Instalasi

```bash
# 1. Clone repo
git clone <repo-url>
cd AnggrekClassificationUsingDecissionTreeMethod

# 2. Setup Python environment
python -m venv .venv
# Windows
.venv\Scripts\Activate.ps1
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt

# 3. Setup frontend
cd frontend
npm install
cd ..
```

### Menjalankan

#### 🛠️ Mode Development (hot reload)

```bash
# Terminal 1 — Backend
python run.py
# → http://127.0.0.1:8000
# → Swagger docs: http://127.0.0.1:8000/docs

# Terminal 2 — Frontend (hot reload)
cd frontend
npm run dev
# → http://localhost:5173
```

#### 🚢 Mode Production (1 server)

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Jalankan server (FastAPI serve React build)
python run.py
# → Buka http://127.0.0.1:8000
```

---

## 📁 Struktur Proyek

```
AnggrekClassificationUsingDecissionTreeMethod/
│
├── 📘 README.md                          # File ini
├── 📘 dokumentasi-proyek-anggrek.md      # Dokumentasi lengkap (16 bab)
├── 📄 requirements.txt                   # Python dependencies
├── 🐍 run.py                             # Uvicorn launcher
├── 🚫 .gitignore
│
├── 📂 app/                               # FastAPI backend
│   ├── main.py                          # FastAPI app + serve React build
│   ├── config.py                        # Paths & konstanta
│   │
│   ├── routers/                         # API endpoints
│   │   ├── dataset.py                   # /api/dataset/*
│   │   ├── model.py                     # /api/model/* (job-based)
│   │   └── predict.py                   # /api/predict/* (job-based untuk video)
│   │
│   ├── services/                        # Business logic
│   │   ├── image_processor.py           # Preprocessing + HSV + GrabCut
│   │   ├── feature_extractor.py         # Ekstrak 6 fitur morfologi
│   │   ├── decision_tree_model.py       # Wrapper sklearn + decision-path tracer
│   │   ├── dataset_manager.py           # CRUD dataset
│   │   ├── job_manager.py               # Background job orchestration
│   │   └── visualizer.py                # Render tree, CM, FI (matplotlib)
│   │
│   └── schemas/                         # Pydantic models
│
├── 📂 frontend/                          # Vite + React + shadcn frontend
│   ├── package.json
│   ├── vite.config.ts                   # Dev proxy /api → :8000
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx                     # React entry
│   │   ├── App.tsx                      # Header + 4 tabs
│   │   ├── index.css                    # Tailwind + theme tokens
│   │   ├── pages/
│   │   │   ├── Info.tsx                 # Tab: profil skripsi + acuan
│   │   │   ├── Upload.tsx               # Tab: upload + galeri dataset
│   │   │   ├── Training.tsx             # Tab: training + visualisasi
│   │   │   └── Predict.tsx              # Tab: image/video/webcam
│   │   ├── components/
│   │   │   ├── HelpBox.tsx              # Reusable help component
│   │   │   └── ui/                      # shadcn primitives
│   │   └── lib/
│   │       ├── api.ts                   # Fetch wrapper + SSE consumer
│   │       └── utils.ts                 # cn() utility
│   └── dist/                            # Hasil build (auto, di-serve FastAPI)
│
├── 📂 data/                              # Runtime data
│   ├── raw/                             # Dataset per kelas
│   │   ├── Phalaenopsis/
│   │   ├── Dendrobium/
│   │   └── Vanda/
│   └── features/
│       └── features.csv                 # Generated saat training
│
├── 📂 models/                            # Trained models
│   ├── decision_tree_latest.pkl
│   └── training_history.json
│
├── 📂 static/
│   ├── specs/                           # Gambar acuan morfologi (5 referensi)
│   └── visualizations/                  # Output matplotlib (tree, CM, FI)
│
├── 📂 rawDataset/                        # Foto mentah sebelum dilabeli per kelas
└── 📂 laporan/
    └── anggrek.pdf
```

---

## 🔌 API Reference

Swagger UI tersedia di **http://127.0.0.1:8000/docs**.

### Dataset

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/dataset/upload` | Upload gambar ke kelas tertentu (multipart) |
| `GET` | `/api/dataset/stats` | Statistik jumlah gambar per kelas |
| `GET` | `/api/dataset/list?class=X` | List nama file per kelas |
| `GET` | `/api/dataset/image/{cls}/{filename}` | Serve gambar dataset |
| `DELETE` | `/api/dataset/file?class=X&filename=Y` | Hapus 1 file spesifik |
| `DELETE` | `/api/dataset/clear?class=X` | Hapus semua di kelas (atau semua tanpa `class`) |

### Model (Training)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/model/train` | **Start** training job → `{ job_id, stream_url }` (409 kalau ada training aktif) |
| `GET` | `/api/model/train/{id}/stream` | SSE stream progress training |
| `GET` | `/api/model/train/active` | Info job training yang sedang aktif (untuk recovery) |
| `DELETE` | `/api/model/train/{id}` | Cancel job training |
| `GET` | `/api/model/info` | Info model yang sudah ter-training |
| `GET` | `/api/model/download` | Download `.pkl` |

### Prediksi

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/predict/image` | Prediksi 1 gambar (sync, non-blocking via executor) |
| `POST` | `/api/predict/video` | **Start** video job → `{ job_id, stream_url }` |
| `GET` | `/api/predict/video/{id}/stream` | SSE stream progress video (per frame) |
| `GET` | `/api/predict/video/active` | Info job video aktif |
| `DELETE` | `/api/predict/video/{id}` | Cancel job video |
| `WS` | `/api/predict/webcam` | WebSocket streaming webcam (drop-frame protection) |

### SSE Event Types

```jsonc
// Training events
{ "type": "scan",          "total": 14 }
{ "type": "feature_start", "current": 3, "total": 14, "file": "...", "class": "..." }
{ "type": "feature_done",  "features": { ... } }
{ "type": "feature_skip",  "message": "..." }
{ "type": "phase",         "phase": "split|fit|eval|done", "message": "..." }
{ "type": "complete",      "result": { "history": {...}, "visualizations": {...} } }
{ "type": "error",         "message": "..." }
{ "type": "cancelled",     "message": "..." }

// Video events
{ "type": "start",     "total_frames": 300, "message": "..." }
{ "type": "frame",     "frame_idx": 15, "prediction": "Phalaenopsis", "confidence": 0.87, "progress": 25.0 }
{ "type": "limit",     "message": "..." }
{ "type": "complete",  "result": { "frames": [...], "summary": {...} } }
```

---

## 🎓 Konsep Decision Tree (untuk Pembaca Awam)

Bayangkan permainan tebak-tebakan:

> *"Apakah bunganya besar?"* → Ya → *"Apakah ada banyak bintik?"* → Tidak → **"Ini Phalaenopsis!"**

Decision Tree bekerja persis seperti itu — aplikasi otomatis mencari urutan pertanyaan terbaik untuk membedakan 3 jenis anggrek. Hasil akhirnya adalah "pohon" yang bisa dilihat dan dipahami manusia.

### Cara Kerja Singkat

1. **Belajar**: Aplikasi diberi banyak foto + label (jenisnya apa). Dari foto, diukur 6 ciri (diameter, bintik, dll). Algoritma CART (Classification and Regression Tree) mencari titik split optimal berdasarkan **Gini Impurity** atau **Entropy**.

2. **Menebak**: Untuk foto baru, ukur 6 ciri yang sama, lalu telusuri pohon mulai dari atas — tiap node bertanya tentang satu ciri, jawabannya menentukan ke cabang kiri atau kanan. Sampai di daun (leaf), tertulis kesimpulannya.

3. **Menjelaskan**: Sistem menampilkan *decision path* — rangkaian pertanyaan yang dilewati. Tidak seperti deep learning yang "kotak hitam", semua keputusan terbaca jelas.

---

## 📸 Tampilan Aplikasi

> Screenshot akan menyusul setelah aplikasi dijalankan dengan dataset lengkap.

### Tab Info
Hero header dengan judul skripsi, identitas penulis, dan acuan morfologi 3 genus anggrek.

### Tab Upload
Drag-and-drop upload + galeri thumbnail per kelas dengan delete-per-file.

### Tab Training
Progress bar real-time + live log terminal style + visualisasi tree, confusion matrix, feature importance.

### Tab Prediksi
3 mode prediksi: gambar (decision path lengkap), video (SSE progress), webcam (realtime WebSocket).

---

## 📊 Dataset Plan & Tips

### Target Dataset
- **Minimum**: 50 gambar/kelas (total 150)
- **Ideal**: 100 gambar/kelas (total 300)
- Split: 70% train / 15% validation / 15% test

### Kriteria Gambar yang Baik ✅
- Bunga **mekar penuh** (bukan kuncup)
- Bunga sebagai **subjek utama** (porsi ≥ 30% gambar)
- **Pencahayaan cukup** (tidak terlalu gelap/silau)
- **Fokus tajam** pada bunga
- **Background kontras** (hindari multiple bunga sejenis)
- Resolusi minimum 640×480

### Kriteria Gambar yang Buruk ❌
- Buram berat
- Multiple bunga sejenis tumpang tindih
- Bunga tertutup tangan/objek lain > 30%
- Watermark besar
- Drawing/ilustrasi (harus foto asli)

### Augmentasi (jika dataset kurang)
- ✅ Horizontal flip
- ✅ Rotation ±15°
- ✅ Brightness ±20%
- ❌ **Vertical flip** (bunga punya orientasi alami)

---

## 🐛 Troubleshooting

<details>
<summary><b>ModuleNotFoundError: No module named 'cv2'</b></summary>

Belum install Python dependencies. Jalankan:
```bash
pip install -r requirements.txt
```
</details>

<details>
<summary><b>'node' / 'npm' is not recognized</b></summary>

Node.js belum terinstall atau PATH belum di-refresh.
1. Install Node.js LTS dari https://nodejs.org/
2. **Restart terminal/PowerShell** setelah install
3. Verifikasi: `node --version` dan `npm --version`
</details>

<details>
<summary><b>npm: File ... cannot be loaded because running scripts is disabled</b></summary>

PowerShell execution policy memblokir. Solusi:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Atau pakai `cmd.exe`/Command Prompt sebagai alternatif.
</details>

<details>
<summary><b>Frontend kosong / API tidak ke-load</b></summary>

Pastikan **backend FastAPI juga jalan** di port 8000 paralel dengan Vite dev server. Mode dev butuh 2 terminal aktif.
</details>

<details>
<summary><b>Webcam tidak bisa diakses</b></summary>

Browser hanya izinkan kamera via **HTTPS** atau **localhost**. Buka `http://localhost:5173` (bukan IP komputer).
</details>

<details>
<summary><b>Training error: "test_size = 2 should be greater or equal to the number of classes = 3"</b></summary>

Dataset terlalu sedikit untuk stratified split. Tambah minimal **2-3 foto per kelas** sebelum training. Idealnya 10+ per kelas.
</details>

<details>
<summary><b>Training error: "Dataset terlalu sedikit"</b></summary>

Minimum 6 sampel total dengan ≥2 kelas. Upload lebih banyak foto.
</details>

<details>
<summary><b>OpenCV / numpy install gagal di Python 3.14</b></summary>

Beberapa wheel mungkin belum tersedia untuk versi terbaru. Coba downgrade ke **Python 3.12 LTS** (recommended untuk stabilitas).
</details>

<details>
<summary><b>409 Conflict saat klik Mulai Training</b></summary>

Sudah ada training berjalan. Tunggu selesai atau **klik Cancel** dulu. Frontend otomatis re-attach ke job aktif.
</details>

---

## 🛣️ Roadmap & Future Work

- [ ] Deploy ke Raspberry Pi (target hardware skripsi)
- [ ] Dataset expansion ke 200+/kelas dengan variasi pencahayaan
- [ ] Auto-augmentation pipeline (Albumentations)
- [ ] Comparison benchmark: Decision Tree vs Random Forest vs SVM vs CNN
- [ ] Export model ke ONNX untuk inference yang lebih cepat
- [ ] Klasifikasi varietas (sub-spesies) per genus
- [ ] Deteksi kondisi/penyakit anggrek
- [ ] Multi-flower per image support
- [ ] Progressive Web App (PWA) untuk install di mobile

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi skripsi lengkap (16 bab — Latar Belakang, Metodologi, Spesifikasi, Timeline, Risiko, dll), lihat:

📖 **[dokumentasi-proyek-anggrek.md](dokumentasi-proyek-anggrek.md)**

---

## 🤝 Kontribusi

Proyek ini adalah implementasi skripsi. Saran, masukan, dan kontribusi sangat diapresiasi melalui Issues atau Pull Requests.

---

## 📄 Lisensi & Atribusi

**Skripsi/Tugas Akhir** — Program Studi Teknik Elektro, Fakultas Teknik, **Universitas Merdeka Malang** © 2026.

Penulis: **Rena Faizatul Widarsono** (NIM 24045000048).

Sumber kode tersedia untuk tujuan edukasi dan pengembangan riset.

---

<div align="center">

### 🌸 Dibuat dengan ❤️ untuk dunia botani Indonesia 🌸

*Phalaenopsis · Dendrobium · Vanda*

</div>
