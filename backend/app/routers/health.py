from fastapi import APIRouter
from app.config import settings
from app.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Verify backend status and API configuration state."""
    gemini_ready = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10)
    fact_check_ready = bool(settings.GOOGLE_FACT_CHECK_API_KEY and len(settings.GOOGLE_FACT_CHECK_API_KEY.strip()) > 10)
    news_api_ready = bool(settings.NEWS_API_KEY and len(settings.NEWS_API_KEY.strip()) > 10)

    active_provider = f"Gemini ({settings.GEMINI_MODEL})" if gemini_ready else "Demo Mode (Offline Fallback Engine)"

    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        project=settings.PROJECT_NAME,
        hackathon=settings.HACKATHON,
        gemini_configured=gemini_ready,
        fact_check_api_configured=fact_check_ready,
        news_api_configured=news_api_ready,
        active_ai_provider=active_provider
    )
