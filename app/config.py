from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
FEATURES_DIR = DATA_DIR / "features"
MODELS_DIR = BASE_DIR / "models"
STATIC_DIR = BASE_DIR / "static"
VIS_DIR = STATIC_DIR / "visualizations"

for d in (RAW_DIR, FEATURES_DIR, MODELS_DIR, VIS_DIR):
    d.mkdir(parents=True, exist_ok=True)

CLASSES = ["Phalaenopsis", "Dendrobium", "Vanda"]
for c in CLASSES:
    (RAW_DIR / c).mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXT = {".mp4", ".mov", ".avi", ".webm"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

MODEL_PATH = MODELS_DIR / "decision_tree_latest.pkl"
FEATURES_CSV = FEATURES_DIR / "features.csv"
TRAINING_HISTORY = MODELS_DIR / "training_history.json"

FEATURE_NAMES = [
    "diameter_relatif",
    "jumlah_bintik",
    "rasio_labelium",
    "aspect_ratio",
    "dominant_hue",
    "dominant_saturation",
]

IMAGE_MAX_SIZE = 640
