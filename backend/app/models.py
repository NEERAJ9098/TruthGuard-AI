import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    input_type = Column(String(50), default="text")  # "headline", "article", "url"
    input_content = Column(Text, nullable=False)
    title = Column(String(500), nullable=True)
    
    # AI Verdict & Metrics
    verdict = Column(String(50), nullable=False)  # LIKELY_REAL, LIKELY_FAKE, UNVERIFIED, MIXED_OR_MISLEADING
    confidence_score = Column(Float, default=0.0)
    evidence_coverage = Column(String(50), default="LOW")  # HIGH, MEDIUM, LOW, NONE
    
    # Detailed AI Outputs (stored as JSON string)
    summary = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    
    claims_json = Column(Text, default="[]")
    suspicious_phrases_json = Column(Text, default="[]")
    supporting_evidence_json = Column(Text, default="[]")
    contradicting_evidence_json = Column(Text, default="[]")
    sources_json = Column(Text, default="[]")
    
    # Complementary signals
    ml_prediction_json = Column(Text, default="{}")
    fact_check_matches_json = Column(Text, default="[]")
    news_search_matches_json = Column(Text, default="[]")
    
    # Metadata
    ai_provider = Column(String(50), default="gemini")
    is_demo = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
