from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.schemas import TrainRequest
from app.services import decision_tree_model
from app.services import visualizer
from app.config import MODEL_PATH

router = APIRouter(prefix="/api/model", tags=["model"])


@router.post("/train")
async def train(req: TrainRequest):
    try:
        history = decision_tree_model.train(
            max_depth=req.max_depth,
            criterion=req.criterion,
            test_size=req.test_size,
            min_samples_split=req.min_samples_split,
            min_samples_leaf=req.min_samples_leaf,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {e}")

    bundle = decision_tree_model.load_model()
    vis = visualizer.render_all(bundle["model"], history)
    return {"success": True, "history": history, "visualizations": vis}


@router.get("/info")
async def info():
    info = decision_tree_model.model_info()
    if info is None:
        return {"trained": False}
    return {"trained": True, **info}


@router.get("/download")
async def download():
    if not MODEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Model belum dilatih")
    return FileResponse(
        MODEL_PATH, media_type="application/octet-stream",
        filename="decision_tree_latest.pkl"
    )
