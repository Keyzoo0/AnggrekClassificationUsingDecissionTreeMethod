from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse
from app.services import dataset_manager

router = APIRouter(prefix="/api/dataset", tags=["dataset"])


@router.post("/upload")
async def upload(
    cls: str = Form(..., alias="class"),
    files: list[UploadFile] = File(...),
):
    uploaded = 0
    skipped = []
    for f in files:
        try:
            content = await f.read()
            dataset_manager.save_uploaded_file(cls, f.filename, content)
            uploaded += 1
        except ValueError as e:
            skipped.append({"file": f.filename, "reason": str(e)})
    return {
        "success": True,
        "uploaded_count": uploaded,
        "skipped": skipped,
        "total": dataset_manager.stats(),
    }


@router.get("/stats")
async def get_stats():
    return {"stats": dataset_manager.stats()}


@router.get("/list")
async def list_dataset(cls: str | None = Query(None, alias="class")):
    return {"files": dataset_manager.list_files(cls)}


@router.delete("/clear")
async def clear_dataset(cls: str | None = Query(None, alias="class")):
    try:
        deleted = dataset_manager.clear(cls)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"success": True, "deleted_count": deleted, "stats": dataset_manager.stats()}


@router.get("/image/{cls}/{filename}")
async def get_image(cls: str, filename: str):
    path = dataset_manager.get_file_path(cls, filename)
    if path is None:
        raise HTTPException(status_code=404, detail="File tidak ditemukan")
    return FileResponse(str(path))


@router.delete("/file")
async def delete_file(
    cls: str = Query(..., alias="class"),
    filename: str = Query(...),
):
    try:
        ok = dataset_manager.delete_file(cls, filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not ok:
        raise HTTPException(status_code=404, detail="File tidak ditemukan")
    return {"success": True, "stats": dataset_manager.stats()}
