import cv2
import numpy as np
from app.services.image_processor import load_image, segment
from app.config import FEATURE_NAMES


def _diameter_relatif(bbox, img_shape):
    if bbox is None:
        return 0.0
    _, _, bw, _ = bbox
    return float(bw) / float(img_shape[1])


def _aspect_ratio(bbox):
    if bbox is None:
        return 1.0
    _, _, bw, bh = bbox
    if bh == 0:
        return 1.0
    return float(bw) / float(bh)


def _jumlah_bintik(img_bgr, mask_dom):
    if cv2.countNonZero(mask_dom) == 0:
        return 0
    flower = cv2.bitwise_and(img_bgr, img_bgr, mask=mask_dom)
    gray = cv2.cvtColor(flower, cv2.COLOR_BGR2GRAY)
    # Adaptive threshold untuk highlight bintik kontras
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    thresh = cv2.adaptiveThreshold(
        blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 8
    )
    thresh = cv2.bitwise_and(thresh, thresh, mask=mask_dom)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    count = 0
    for c in contours:
        area = cv2.contourArea(c)
        if not (5 <= area <= 200):
            continue
        perim = cv2.arcLength(c, True)
        if perim == 0:
            continue
        circ = 4 * np.pi * area / (perim * perim)
        if circ >= 0.45:
            count += 1
    return int(count)


def _rasio_labelium(img_bgr, mask_dom):
    """Proxy labelium: area dengan saturasi tertinggi (cluster K-Means k=2).
    Labelium biasanya region paling jenuh / kontras di tengah bunga.
    """
    if cv2.countNonZero(mask_dom) == 0:
        return 0.0
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    sat = hsv[..., 1]
    val = hsv[..., 2]
    pixels = mask_dom > 0
    total = int(np.count_nonzero(pixels))
    if total == 0:
        return 0.0
    sat_vals = sat[pixels].astype(np.float32)
    val_vals = val[pixels].astype(np.float32)
    samples = np.stack([sat_vals, val_vals], axis=1)
    if len(samples) < 10:
        return 0.0
    try:
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        _, labels, centers = cv2.kmeans(
            samples, 2, None, criteria, 3, cv2.KMEANS_PP_CENTERS
        )
    except cv2.error:
        return 0.0
    # Cluster "labelium" = saturasi rata-rata tertinggi
    lab_cluster = int(np.argmax(centers[:, 0]))
    lab_count = int(np.sum(labels.flatten() == lab_cluster))
    return float(lab_count) / float(total)


def _dominant_color(img_bgr, mask_dom):
    if cv2.countNonZero(mask_dom) == 0:
        return 0.0, 0.0
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    pixels = mask_dom > 0
    h_vals = hsv[..., 0][pixels]
    s_vals = hsv[..., 1][pixels]
    if len(h_vals) == 0:
        return 0.0, 0.0
    # Median lebih robust dari mean (warna dominan)
    return float(np.median(h_vals)), float(np.median(s_vals))


def extract_features_from_image(img_bgr):
    """Extract semua fitur dari satu gambar BGR.
    Return dict berisi fitur + metadata (mask, bbox) untuk visualisasi.
    """
    img_resized, mask_full, mask_dom, bbox = segment(img_bgr)
    has_flower = bbox is not None and cv2.countNonZero(mask_dom) > 0

    diameter = _diameter_relatif(bbox, img_resized.shape) if has_flower else 0.0
    aspect = _aspect_ratio(bbox) if has_flower else 1.0
    bintik = _jumlah_bintik(img_resized, mask_dom) if has_flower else 0
    labelium = _rasio_labelium(img_resized, mask_dom) if has_flower else 0.0
    hue, sat = _dominant_color(img_resized, mask_dom) if has_flower else (0.0, 0.0)

    features = {
        "diameter_relatif": diameter,
        "jumlah_bintik": bintik,
        "rasio_labelium": labelium,
        "aspect_ratio": aspect,
        "dominant_hue": hue,
        "dominant_saturation": sat,
    }
    return {
        "features": features,
        "feature_vector": [features[k] for k in FEATURE_NAMES],
        "image": img_resized,
        "mask": mask_dom,
        "bbox": bbox,
        "has_flower": has_flower,
    }


def extract_from_path(path):
    img = load_image(path)
    return extract_features_from_image(img)
