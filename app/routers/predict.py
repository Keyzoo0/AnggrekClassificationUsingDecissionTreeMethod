import base64
import io
import json
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect, Form
from app.services import decision_tree_model
from app.services.feature_extractor import extract_features_from_image
from app.services.image_processor import load_image
from app.config import FEATURE_NAMES

router = APIRouter(prefix="/api/predict", tags=["predict"])


def _annotated_image_b64(img_bgr, bbox, prediction, confidence):
    out = img_bgr.copy()
    if bbox is not None:
        x, y, w, h = bbox
        cv2.rectangle(out, (x, y), (x + w, y + h), (147, 51, 234), 3)
        label = f"{prediction} ({confidence*100:.1f}%)"
        cv2.putText(out, label, (x, max(20, y - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (147, 51, 234), 2)
    ok, buf = cv2.imencode(".jpg", out, [cv2.IMWRITE_JPEG_QUALITY, 85])
    if not ok:
        return None
    return "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode()


def _mask_b64(mask):
    ok, buf = cv2.imencode(".png", mask)
    if not ok:
        return None
    return "data:image/png;base64," + base64.b64encode(buf.tobytes()).decode()


def _predict_from_bgr(img_bgr):
    extracted = extract_features_from_image(img_bgr)
    if not extracted["has_flower"]:
        raise HTTPException(
            status_code=400,
            detail="Bunga tidak terdeteksi pada gambar. Coba foto lebih dekat / background lebih kontras."
        )
    pred = decision_tree_model.predict(extracted["feature_vector"])
    annotated = _annotated_image_b64(
        extracted["image"], extracted["bbox"],
        pred["prediction"], pred["confidence"]
    )
    mask_img = _mask_b64(extracted["mask"])
    return {
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "probabilities": pred["probabilities"],
        "features": extracted["features"],
        "decision_path": pred["decision_path"],
        "bbox": extracted["bbox"],
        "annotated_image": annotated,
        "mask_image": mask_img,
    }


@router.post("/image")
async def predict_image(file: UploadFile = File(...)):
    content = await file.read()
    try:
        img = load_image(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    try:
        result = _predict_from_bgr(img)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"success": True, "result": result}


@router.post("/video")
async def predict_video(file: UploadFile = File(...), skip_frames: int = Form(5)):
    import tempfile
    import os

    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    cap = cv2.VideoCapture(tmp_path)
    if not cap.isOpened():
        os.unlink(tmp_path)
        raise HTTPException(status_code=400, detail="Video tidak dapat dibaca")

    frames_result = []
    counts = {}
    frame_idx = 0
    max_frames = 200
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % max(1, skip_frames) == 0:
                try:
                    extracted = extract_features_from_image(frame)
                    if extracted["has_flower"]:
                        pred = decision_tree_model.predict(extracted["feature_vector"])
                        frames_result.append({
                            "frame": frame_idx,
                            "prediction": pred["prediction"],
                            "confidence": pred["confidence"],
                        })
                        counts[pred["prediction"]] = counts.get(pred["prediction"], 0) + 1
                except Exception:
                    pass
            frame_idx += 1
            if len(frames_result) >= max_frames:
                break
    finally:
        cap.release()
        os.unlink(tmp_path)

    summary = None
    if counts:
        dominant = max(counts.items(), key=lambda kv: kv[1])
        summary = {
            "dominant_class": dominant[0],
            "counts": counts,
            "total_analyzed": sum(counts.values()),
        }
    return {
        "success": True,
        "frames": frames_result,
        "summary": summary,
        "total_frames_read": frame_idx,
    }


@router.websocket("/webcam")
async def webcam_ws(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_text()
            try:
                data = json.loads(msg)
                b64 = data.get("image", "")
                if "," in b64:
                    b64 = b64.split(",", 1)[1]
                raw = base64.b64decode(b64)
                arr = np.frombuffer(raw, np.uint8)
                img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                if img is None:
                    await ws.send_json({"error": "decode_failed"})
                    continue
                extracted = extract_features_from_image(img)
                if not extracted["has_flower"]:
                    await ws.send_json({"detected": False})
                    continue
                pred = decision_tree_model.predict(extracted["feature_vector"])
                await ws.send_json({
                    "detected": True,
                    "prediction": pred["prediction"],
                    "confidence": pred["confidence"],
                    "probabilities": pred["probabilities"],
                    "features": extracted["features"],
                    "bbox": extracted["bbox"],
                })
            except Exception as e:
                await ws.send_json({"error": str(e)})
    except WebSocketDisconnect:
        pass
