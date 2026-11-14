import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=5, max_length=15000, description="Headline or complete article text to analyze")
    input_type: Optional[str] = Field("auto", description="'headline', 'article', or 'auto'")

class AnalyzeUrlRequest(BaseModel):
    url: str = Field(..., description="Public HTTP/HTTPS news article URL to analyze")

class SourceItem(BaseModel):
    name: str
    url: Optional[str] = None
    reliability_tier: Optional[str] = "Mainstream"  # "High", "Medium", "Caution"
    published_date: Optional[str] = None

class EvidenceItem(BaseModel):
    claim: Optional[str] = None
    source: str
    url: Optional[str] = None
    stance: str = "NEUTRAL"  # "SUPPORT", "CONTRADICT", "NEUTRAL"
    snippet: str
    date: Optional[str] = None

class MLSignal(BaseModel):
    model_name: str = "TF-IDF + Logistic Regression"
    style_label: str  # "SENSATIONAL / CLICKBAIT" or "STANDARD JOURNALISTIC"
    sensationalism_score: float  # 0 to 100
    model_description: str = "Linguistic writing-style classifier (secondary signal, not truth verdict)"

class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    verdict: str  # "LIKELY_REAL", "LIKELY_FAKE", "UNVERIFIED", "MIXED_OR_MISLEADING"
    confidence_score: float  # 0 to 100
    evidence_coverage: str  # "HIGH", "MEDIUM", "LOW", "NONE"
    summary: str
    claims: List[str] = []
    suspicious_phrases: List[str] = []
    supporting_evidence: List[EvidenceItem] = []
    contradicting_evidence: List[EvidenceItem] = []
    sources: List[SourceItem] = []
    reasoning: str
    limitations: str
    ml_signal: Optional[MLSignal] = None
    fact_check_count: int = 0
    news_search_count: int = 0
    ai_provider: str = "gemini"
    is_demo: bool = False
    created_at: Optional[str] = None

class HistoryItem(BaseModel):
    id: int
    title: Optional[str]
    input_type: str
    verdict: str
    confidence_score: float
    evidence_coverage: str
    summary: Optional[str]
    created_at: str

class HistoryDetailResponse(AnalysisResponse):
    pass

class DashboardStats(BaseModel):
    total_analyzed: int
    likely_real_count: int
    likely_fake_count: int
    unverified_count: int
    mixed_count: int
    avg_confidence: float
    recent_verdicts: List[Dict[str, Any]]
    verdict_distribution: List[Dict[str, Any]]
    evidence_coverage_distribution: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    version: str
    project: str
    hackathon: str
    gemini_configured: bool
    fact_check_api_configured: bool
    news_api_configured: bool
    active_ai_provider: str
