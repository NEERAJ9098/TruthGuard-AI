import json
import logging
import datetime
from typing import Dict, Any, Optional

from app.services.text_processor import TextProcessor
from app.services.fact_check_api import FactCheckAPIService
from app.services.news_search_api import NewsSearchAPIService
from app.services.ml_classifier import MLClassifierService
from app.services.ai_service import get_ai_provider
from app.database import get_db
from app.schemas import AnalysisResponse, MLSignal, EvidenceItem, SourceItem

logger = logging.getLogger(__name__)

class NewsAnalyzer:
    def __init__(self):
        self.fact_check_service = FactCheckAPIService()
        self.news_search_service = NewsSearchAPIService()
        self.ml_service = MLClassifierService()

    async def analyze_text(
        self,
        text: str,
        input_type: str = "text"
    ) -> AnalysisResponse:
        """Complete multi-stage AI verification pipeline."""
        clean_text = TextProcessor.clean_text(text)
        is_headline = (input_type == "headline") or (len(clean_text.split()) <= 20)
        
        # 1. Extract title and body
        title, body = TextProcessor.extract_title_and_body(clean_text, is_headline_input=is_headline)
        
        # 2. Extract suspicious phrases & sensationalism
        suspicious_phrases = TextProcessor.detect_suspicious_phrases(clean_text)
        heuristic_claims = TextProcessor.extract_heuristic_claims(clean_text)

        # 3. Run ML Writing-Style Classifier (TF-IDF + Logistic Regression)
        ml_style_result = self.ml_service.predict_style(clean_text)

        # 4. Search external fact-check databases
        fact_check_query = title if title else clean_text[:80]
        fact_check_data = await self.fact_check_service.search_claims(fact_check_query)
        fact_check_matches = fact_check_data.get("matches", [])

        # 5. Search real global news coverage (GDELT / NewsAPI)
        news_search_data = await self.news_search_service.search_news_coverage(title)
        news_matches = news_search_data.get("articles", [])

        # 6. AI Engine synthesis (Gemini API or intelligent Demo fallback)
        ai_provider = get_ai_provider()
        try:
            ai_output = await ai_provider.analyze(
                news_text=clean_text,
                title=title,
                fact_check_matches=fact_check_matches,
                news_matches=news_matches,
                ml_style=ml_style_result,
                suspicious_words=suspicious_phrases
            )
        except Exception as e:
            logger.error(f"AI provider failed, falling back to Demo Provider: {e}")
            from app.services.ai_service import DemoAIProvider
            fallback = DemoAIProvider()
            ai_output = await fallback.analyze(
                news_text=clean_text,
                title=title,
                fact_check_matches=fact_check_matches,
                news_matches=news_matches,
                ml_style=ml_style_result,
                suspicious_words=suspicious_phrases
            )

        # Merge claims if AI returned empty
        if not ai_output.get("claims") and heuristic_claims:
            ai_output["claims"] = heuristic_claims

        # Merge suspicious phrases
        all_suspicious = list(set(ai_output.get("suspicious_phrases", []) + suspicious_phrases))
        ai_output["suspicious_phrases"] = all_suspicious

        # Determine evidence coverage level
        evidence_count = len(ai_output.get("supporting_evidence", [])) + len(ai_output.get("contradicting_evidence", [])) + len(fact_check_matches)
        if evidence_count >= 4:
            coverage = "HIGH"
        elif evidence_count >= 2:
            coverage = "MEDIUM"
        elif evidence_count >= 1:
            coverage = "LOW"
        else:
            coverage = "NONE"

        # Build response objects
        supporting_items = [
            EvidenceItem(**item) if isinstance(item, dict) else item
            for item in ai_output.get("supporting_evidence", [])
        ]
        contradicting_items = [
            EvidenceItem(**item) if isinstance(item, dict) else item
            for item in ai_output.get("contradicting_evidence", [])
        ]
        source_items = [
            SourceItem(**item) if isinstance(item, dict) else item
            for item in ai_output.get("sources", [])
        ]

        ml_signal = MLSignal(
            model_name=ml_style_result["model_name"],
            style_label=ml_style_result["style_label"],
            sensationalism_score=ml_style_result["sensationalism_score"],
            model_description=ml_style_result["model_description"]
        )

        response_data = AnalysisResponse(
            id=None,
            title=title,
            verdict=ai_output.get("verdict", "UNVERIFIED"),
            confidence_score=ai_output.get("confidence_score", 50.0),
            evidence_coverage=coverage,
            summary=ai_output.get("summary", ""),
            claims=ai_output.get("claims", []),
            suspicious_phrases=all_suspicious,
            supporting_evidence=supporting_items,
            contradicting_evidence=contradicting_items,
            sources=source_items,
            reasoning=ai_output.get("reasoning", ""),
            limitations=ai_output.get("limitations", ""),
            ml_signal=ml_signal,
            fact_check_count=len(fact_check_matches),
            news_search_count=len(news_matches),
            ai_provider=ai_output.get("ai_provider", "Gemini"),
            is_demo=ai_output.get("is_demo", False),
            created_at=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        )

        # 7. Persist to SQLite DB
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO analysis_records (
                        input_type, input_content, title, verdict, confidence_score,
                        evidence_coverage, summary, reasoning, limitations,
                        claims_json, suspicious_phrases_json, supporting_evidence_json,
                        contradicting_evidence_json, sources_json, ml_prediction_json,
                        fact_check_matches_json, news_search_matches_json,
                        ai_provider, is_demo, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    input_type,
                    clean_text[:5000],
                    title[:500],
                    response_data.verdict,
                    response_data.confidence_score,
                    coverage,
                    response_data.summary,
                    response_data.reasoning,
                    response_data.limitations,
                    json.dumps(response_data.claims),
                    json.dumps(response_data.suspicious_phrases),
                    json.dumps([item.dict() for item in supporting_items]),
                    json.dumps([item.dict() for item in contradicting_items]),
                    json.dumps([item.dict() for item in source_items]),
                    json.dumps(ml_style_result),
                    json.dumps(fact_check_matches),
                    json.dumps(news_matches),
                    response_data.ai_provider,
                    1 if response_data.is_demo else 0,
                    datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                ))
                conn.commit()
                response_data.id = cursor.lastrowid
        except Exception as dbe:
            logger.error(f"Error persisting record to SQLite: {dbe}")

        return response_data
