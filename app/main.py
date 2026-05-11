from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import STATIC_DIR, BASE_DIR
from app.routers import dataset, model, predict

FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

app = FastAPI(
    title="Anggrek Classifier",
    description="Klasifikasi anggrek menggunakan Decision Tree berbasis fitur morfologi",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dataset.router)
app.include_router(model.router)
app.include_router(predict.router)

# /static -> visualisasi (tree, confusion matrix, dll)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health")
async def health():
    return {"status": "ok", "frontend_built": FRONTEND_DIST.exists()}


# Serve hasil build Vite (kalau sudah ada).
# Saat dev, frontend jalan di Vite (port 5173) — buka langsung di sana.
if FRONTEND_DIST.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_DIST / "assets")),
        name="assets",
    )

    @app.get("/")
    async def index():
        return FileResponse(str(FRONTEND_DIST / "index.html"))

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        # Untuk SPA routing: kembalikan index.html untuk path non-API
        if full_path.startswith(("api/", "static/", "assets/", "health")):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        candidate = FRONTEND_DIST / full_path
        if candidate.is_file():
            return FileResponse(str(candidate))
        return FileResponse(str(FRONTEND_DIST / "index.html"))

else:
    @app.get("/")
    async def index_dev():
        return JSONResponse({
            "message": "Frontend belum di-build. Jalankan:\n"
                       "  cd frontend && npm install && npm run dev\n"
                       "atau\n"
                       "  cd frontend && npm install && npm run build\n"
                       "Backend API tersedia di /api/*.",
            "api_docs": "/docs",
            "frontend_dev": "http://localhost:5173",
        })
