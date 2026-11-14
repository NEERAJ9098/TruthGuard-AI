import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db
from app.sample_data import seed_sample_data_if_empty
from app.routers import analyze, history, dashboard, health

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("truthguard")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables & seed demo data
    logger.info("Initializing SQLite database tables...")
    init_db()
    seed_sample_data_if_empty()
    logger.info(f"TruthGuard AI Backend ready for {settings.HACKATHON}!")
    yield
    # Shutdown
    logger.info("TruthGuard AI Backend shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Fake News Detection System for HackNova Bhopal 2K26",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite defaults to port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal verification engine error occurred. Please try again."}
    )

# Include Routers
app.include_router(analyze.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "event": settings.HACKATHON,
        "version": settings.VERSION,
        "documentation": "/docs",
        "health_check": "/api/health"
    }
