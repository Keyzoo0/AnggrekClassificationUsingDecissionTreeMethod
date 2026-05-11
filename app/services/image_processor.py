import cv2
import numpy as np
from app.config import IMAGE_MAX_SIZE


def load_image(path_or_bytes):
    if isinstance(path_or_bytes, (bytes, bytearray)):
        arr = np.frombuffer(path_or_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    else:
        img = cv2.imread(str(path_or_bytes))
    if img is None:
        raise ValueError("Gambar tidak dapat dibaca")
    return img


def resize_keep_aspect(img, max_size=IMAGE_MAX_SIZE):
    h, w = img.shape[:2]
    scale = min(max_size / max(h, w), 1.0)
    if scale < 1.0:
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    return img


def preprocess(img):
    img = resize_keep_aspect(img)
    blurred = cv2.GaussianBlur(img, (5, 5), 0)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    return img, hsv


def segment_flower_hsv(hsv):
    """Mask warna khas anggrek: pink, magenta, ungu, putih, kuning."""
    ranges = [
        ((140, 40, 40), (175, 255, 255)),   # pink-magenta
        ((120, 40, 40), (150, 255, 255)),   # ungu
        ((0, 0, 180), (180, 60, 255)),      # putih
        ((20, 60, 80), (40, 255, 255)),     # kuning
        ((0, 60, 60), (15, 255, 255)),      # merah-pink low
        ((160, 60, 60), (180, 255, 255)),   # merah-pink high
    ]
    mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
    for low, high in ranges:
        m = cv2.inRange(hsv, np.array(low), np.array(high))
        mask = cv2.bitwise_or(mask, m)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    return mask


def refine_with_grabcut(img, init_mask):
    """Refine HSV mask dengan GrabCut untuk bersihkan background ramai."""
    h, w = img.shape[:2]
    if cv2.countNonZero(init_mask) < (h * w * 0.01):
        return init_mask
    gc_mask = np.where(init_mask > 0, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
    # Center area kemungkinan besar foreground
    cy, cx = h // 2, w // 2
    rr, rc = h // 6, w // 6
    gc_mask[cy - rr:cy + rr, cx - rc:cx + rc] = cv2.GC_FGD
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    try:
        cv2.grabCut(img, gc_mask, None, bgd, fgd, 3, cv2.GC_INIT_WITH_MASK)
    except cv2.error:
        return init_mask
    refined = np.where((gc_mask == cv2.GC_FGD) | (gc_mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    return refined


def get_dominant_flower_contour(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    H, W = mask.shape
    cx_img, cy_img = W / 2, H / 2

    def score(c):
        area = cv2.contourArea(c)
        if area < 500:
            return -1
        M = cv2.moments(c)
        if M["m00"] == 0:
            return -1
        cx = M["m10"] / M["m00"]
        cy = M["m01"] / M["m00"]
        dist = np.hypot(cx - cx_img, cy - cy_img)
        # Skor: area besar dekat tengah
        return area / (1 + dist)

    best = max(contours, key=score)
    if cv2.contourArea(best) < 500:
        return None
    return best


def segment(img):
    """Pipeline lengkap: return (image_resized, mask_full, mask_dominant, bbox).
    mask_dominant hanya berisi 1 bunga utama (yang dominan / di tengah).
    bbox = (x, y, w, h) bunga dominan, None jika gagal.
    """
    img_resized, hsv = preprocess(img)
    raw_mask = segment_flower_hsv(hsv)
    refined = refine_with_grabcut(img_resized, raw_mask)
    contour = get_dominant_flower_contour(refined)
    h, w = img_resized.shape[:2]
    mask_dom = np.zeros((h, w), dtype=np.uint8)
    bbox = None
    if contour is not None:
        cv2.drawContours(mask_dom, [contour], -1, 255, thickness=cv2.FILLED)
        x, y, bw, bh = cv2.boundingRect(contour)
        bbox = (x, y, bw, bh)
    return img_resized, refined, mask_dom, bbox
