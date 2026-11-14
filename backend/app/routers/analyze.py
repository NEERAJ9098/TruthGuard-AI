from fastapi import APIRouter, HTTPException, status
from app.schemas import AnalyzeRequest, AnalyzeUrlRequest, AnalysisResponse
from app.services.analyzer import NewsAnalyzer
from app.services.url_extractor import URLExtractor

router = APIRouter(prefix="/api", tags=["Analysis"])
analyzer = NewsAnalyzer()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_news_text(payload: AnalyzeRequest):
    """Analyze news text or headline with multi-stage AI verification pipeline."""
    text = payload.text.strip()
    if len(text) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text must contain at least 5 characters for analysis."
        )

    input_type = payload.input_type
    if input_type not in ["headline", "article", "text"]:
        input_type = "headline" if len(text.split()) <= 20 else "article"

    try:
        result = await analyzer.analyze_text(text=text, input_type=input_type)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification engine error: {str(e)}"
        )

@router.post("/analyze-url", response_model=AnalysisResponse)
async def analyze_news_url(payload: AnalyzeUrlRequest):
    """Extract readable news article from a safe public URL and analyze it."""
    url = payload.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="A valid URL is required.")

    # 1. SSRF check & article extraction
    try:
        extracted = await URLExtractor.extract_article_content(url)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except TimeoutError as te:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(te))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch content from URL: {str(e)}")

    content = f"{extracted['title']}\n\n{extracted['content']}"

    try:
        result = await analyzer.analyze_text(text=content, input_type="url")
        result.title = extracted["title"]
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification engine error: {str(e)}"
        )
