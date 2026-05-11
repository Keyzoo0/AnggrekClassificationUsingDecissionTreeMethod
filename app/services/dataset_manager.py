import shutil
from pathlib import Path
from app.config import RAW_DIR, CLASSES, ALLOWED_IMAGE_EXT, MAX_FILE_SIZE


def _valid_class(cls: str) -> bool:
    return cls in CLASSES


def save_uploaded_file(cls: str, filename: str, content: bytes) -> Path:
    if not _valid_class(cls):
        raise ValueError(f"Kelas tidak valid: {cls}")
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXT:
        raise ValueError(f"Format tidak didukung: {ext}")
    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File terlalu besar (>10MB): {filename}")
    target_dir = RAW_DIR / cls
    target_dir.mkdir(parents=True, exist_ok=True)
    # Cari nama unik
    base = Path(filename).stem.replace(" ", "_")
    target = target_dir / f"{base}{ext}"
    counter = 1
    while target.exists():
        target = target_dir / f"{base}_{counter}{ext}"
        counter += 1
    target.write_bytes(content)
    return target


def stats() -> dict:
    out = {}
    for c in CLASSES:
        d = RAW_DIR / c
        if not d.exists():
            out[c] = 0
            continue
        out[c] = sum(1 for p in d.iterdir() if p.suffix.lower() in ALLOWED_IMAGE_EXT)
    out["total"] = sum(v for k, v in out.items() if k in CLASSES)
    return out


def list_files(cls: str | None = None):
    classes = [cls] if cls else CLASSES
    out = {}
    for c in classes:
        d = RAW_DIR / c
        if not d.exists():
            out[c] = []
            continue
        out[c] = sorted(
            p.name for p in d.iterdir() if p.suffix.lower() in ALLOWED_IMAGE_EXT
        )
    return out


def delete_file(cls: str, filename: str) -> bool:
    if not _valid_class(cls):
        raise ValueError(f"Kelas tidak valid: {cls}")
    # Cegah path traversal
    safe_name = Path(filename).name
    target = RAW_DIR / cls / safe_name
    if not target.exists() or not target.is_file():
        return False
    if target.suffix.lower() not in ALLOWED_IMAGE_EXT:
        raise ValueError("Bukan file gambar valid")
    target.unlink()
    return True


def get_file_path(cls: str, filename: str) -> Path | None:
    if not _valid_class(cls):
        return None
    safe_name = Path(filename).name
    target = RAW_DIR / cls / safe_name
    if not target.exists() or not target.is_file():
        return None
    if target.suffix.lower() not in ALLOWED_IMAGE_EXT:
        return None
    return target


def clear(cls: str | None = None) -> int:
    deleted = 0
    classes = [cls] if cls else CLASSES
    for c in classes:
        if not _valid_class(c):
            continue
        d = RAW_DIR / c
        if not d.exists():
            continue
        for p in d.iterdir():
            if p.suffix.lower() in ALLOWED_IMAGE_EXT:
                p.unlink()
                deleted += 1
    return deleted


def iter_dataset():
    """Yield (class_name, file_path) untuk semua gambar."""
    for c in CLASSES:
        d = RAW_DIR / c
        if not d.exists():
            continue
        for p in sorted(d.iterdir()):
            if p.suffix.lower() in ALLOWED_IMAGE_EXT:
                yield c, p
