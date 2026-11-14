import json
import logging
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "You are a responsible news verification assistant. Analyze the supplied news text and available external evidence. "
    "Identify factual claims, compare them with credible sources, detect inconsistencies, and explain uncertainty. "
    "Never invent sources, citations, facts, or URLs. Do not classify a claim as fake merely because it sounds sensational. "
    "If evidence is insufficient, return UNVERIFIED. Separate writing-style indicators from factual verification. "
    "Provide a structured JSON response."
)

EXPECTED_SCHEMA_DESCRIPTION = """
Return ONLY a valid JSON object with EXACTLY this structure:
{
  "verdict": "LIKELY_REAL" | "LIKELY_FAKE" | "UNVERIFIED" | "MIXED_OR_MISLEADING",
  "confidence_score": <number between 0 and 100 representing model-estimated confidence>,
  "summary": "<2-3 sentence objective overview of the news content>",
  "claims": ["<specific verifiable factual claim 1>", "<specific verifiable factual claim 2>"],
  "suspicious_phrases": ["<phrase with sensationalism, exaggeration, or unverified assertion>"],
  "supporting_evidence": [
    {
      "claim": "<claim this supports>",
      "source": "<credible source name>",
      "url": "<source URL if provided in evidence, otherwise empty>",
      "stance": "SUPPORT",
      "snippet": "<brief factual excerpt>",
      "date": "<date or year>"
    }
  ],
  "contradicting_evidence": [
    {
      "claim": "<claim this refutes>",
      "source": "<debunking publisher / authority>",
      "url": "<source URL if provided in evidence, otherwise empty>",
      "stance": "CONTRADICT",
      "snippet": "<brief refutation excerpt>",
      "date": "<date or year>"
    }
  ],
  "sources": [
    {
      "name": "<source or publisher>",
      "url": "<url>",
      "reliability_tier": "High" | "Medium" | "Caution",
      "published_date": "<date>"
    }
  ],
  "reasoning": "<thorough explanation distinguishing writing style from factual verification>",
  "limitations": "<explicit statement of limitations, missing evidence, or need for further official corroboration>"
}
"""

class BaseAIProvider(ABC):
    @abstractmethod
    async def analyze(
        self,
        news_text: str,
        title: str,
        fact_check_matches: List[Dict[str, Any]],
        news_matches: List[Dict[str, Any]],
        ml_style: Dict[str, Any],
        suspicious_words: List[str]
    ) -> Dict[str, Any]:
        pass

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    async def analyze(
        self,
        news_text: str,
        title: str,
        fact_check_matches: List[Dict[str, Any]],
        news_matches: List[Dict[str, Any]],
        ml_style: Dict[str, Any],
        suspicious_words: List[str]
    ) -> Dict[str, Any]:
        prompt = f"""
{SYSTEM_INSTRUCTION}

{EXPECTED_SCHEMA_DESCRIPTION}

INPUT NEWS TO VERIFY:
Title: {title}
Content:
{news_text}

EXTERNAL EVIDENCE RETRIEVED:
1. Fact-Check Database Matches ({len(fact_check_matches)} found):
{json.dumps(fact_check_matches, indent=2)}

2. Global News Coverage Matches ({len(news_matches)} found):
{json.dumps(news_matches, indent=2)}

3. Complementary Writing Style Signals:
- ML Sensationalism Score: {ml_style.get('sensationalism_score', 0)}% ({ml_style.get('style_label')})
- Flagged Suspicious Words/Phrases: {json.dumps(suspicious_words)}

Remember:
- Distinguish writing style from factual truth.
- If trustworthy corroboration or debunking is absent, output UNVERIFIED.
- Do NOT invent sources or URLs. Only use verified information from the evidence or widely established general knowledge.
"""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            raw_text = response.text.strip()
            # Clean possible markdown wrapping if any
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            parsed = json.loads(raw_text)
            self._validate_and_sanitize(parsed)
            parsed["ai_provider"] = f"Gemini ({self.model_name})"
            parsed["is_demo"] = False
            return parsed
        except Exception as e:
            logger.error(f"Gemini API execution error: {e}")
            raise e

    def _validate_and_sanitize(self, data: Dict[str, Any]):
        valid_verdicts = ["LIKELY_REAL", "LIKELY_FAKE", "UNVERIFIED", "MIXED_OR_MISLEADING"]
        if data.get("verdict") not in valid_verdicts:
            data["verdict"] = "UNVERIFIED"

        try:
            score = float(data.get("confidence_score", 50))
            data["confidence_score"] = max(0.0, min(100.0, round(score, 1)))
        except (ValueError, TypeError):
            data["confidence_score"] = 50.0

        for key in ["claims", "suspicious_phrases", "supporting_evidence", "contradicting_evidence", "sources"]:
            if key not in data or not isinstance(data[key], list):
                data[key] = []

        if not data.get("summary"):
            data["summary"] = "AI verification assessment conducted on the submitted text."
        if not data.get("reasoning"):
            data["reasoning"] = "Evaluated against available external databases and linguistic markers."
        if not data.get("limitations"):
            data["limitations"] = "Model-estimated confidence. Users should independently review primary sources."

class DemoAIProvider(BaseAIProvider):
    """
    Intelligent fallback provider when Gemini API Key is not set or network is offline.
    Uses rule-based factual synthesis without pretending fake API calls.
    """
    async def analyze(
        self,
        news_text: str,
        title: str,
        fact_check_matches: List[Dict[str, Any]],
        news_matches: List[Dict[str, Any]],
        ml_style: Dict[str, Any],
        suspicious_words: List[str]
    ) -> Dict[str, Any]:
        text_lower = (title + " " + news_text).lower()

        # Check fact-check matches
        has_debunk = any(
            m.get("textual_rating", "").lower() in ["false", "pants on fire", "misleading", "incorrect"]
            for m in fact_check_matches
        )
        has_verified_true = any(
            m.get("textual_rating", "").lower() in ["true", "verified", "correct", "mostly true"]
            for m in fact_check_matches
        )

        supporting_evidence = []
        contradicting_evidence = []
        sources = []

        for m in fact_check_matches:
            rating = m.get("textual_rating", "")
            is_false = rating.lower() in ["false", "pants on fire", "misleading", "incorrect"]
            ev_item = {
                "claim": m.get("claim", title),
                "source": m.get("publisher", "Fact Checker"),
                "url": m.get("url", ""),
                "stance": "CONTRADICT" if is_false else "SUPPORT",
                "snippet": f"Fact-check determination: '{rating}'. Review of claimant assertions.",
                "date": m.get("claim_date", "")
            }
            if is_false:
                contradicting_evidence.append(ev_item)
            else:
                supporting_evidence.append(ev_item)
            sources.append({
                "name": m.get("publisher", "Fact Checker"),
                "url": m.get("url", ""),
                "reliability_tier": "High",
                "published_date": m.get("claim_date", "")
            })

        for n in news_matches:
            supporting_evidence.append({
                "claim": n.get("title", title),
                "source": n.get("source", "News Media"),
                "url": n.get("url", ""),
                "stance": "SUPPORT",
                "snippet": n.get("snippet", ""),
                "date": n.get("published_date", "")
            })
            sources.append({
                "name": n.get("source", "News Media"),
                "url": n.get("url", ""),
                "reliability_tier": "Medium",
                "published_date": n.get("published_date", "")
            })

        # Synthesize verdict cautiously
        sensationalism = ml_style.get("sensationalism_score", 0.0)
        
        if has_debunk:
            verdict = "LIKELY_FAKE"
            confidence = 88.0
            reasoning = (
                "Verified debunking records were identified in established fact-checking databases "
                "directly refuting the central assertions of this article. Furthermore, "
                f"linguistic analysis identified {len(suspicious_words)} suspicious or sensational phrasing patterns."
            )
        elif has_verified_true or (len(news_matches) >= 2 and sensationalism < 40):
            verdict = "LIKELY_REAL"
            confidence = 82.0
            reasoning = (
                "Multiple reputable news outlets and verified documentation corroborate the core factual claims. "
                "The text exhibits standard journalistic syntax without indicators of deceptive intent."
            )
        elif sensationalism > 60 and len(news_matches) == 0:
            verdict = "MIXED_OR_MISLEADING"
            confidence = 65.0
            reasoning = (
                "The text utilizes high-intensity sensationalist, emotional, or clickbait framing without "
                "supporting corroboration from mainstream news wires or verified records. While styling alone "
                "does not prove falsehood, the lack of corroborating evidence warrants significant caution."
            )
        else:
            verdict = "UNVERIFIED"
            confidence = 50.0
            reasoning = (
                "Insufficient external evidence was retrieved to substantiate or refute the claims. In accordance "
                "with TruthGuard AI's responsible verification standards, uncorroborated reports are classified as UNVERIFIED "
                "rather than making an unfounded presumption of falsehood."
            )

        summary = (
            f"Analysis of article: '{title[:90]}...'. Text examined against global news databases, "
            f"fact-checking archives, and linguistic style models."
        )

        limitations = (
            "Demo Mode Notice: Running with built-in heuristic synthesis because GEMINI_API_KEY is not configured in backend/.env. "
            "Confidence is model-estimated and should not replace primary research."
        )

        return {
            "verdict": verdict,
            "confidence_score": confidence,
            "summary": summary,
            "claims": [title] if title else ["Primary factual claim in article"],
            "suspicious_phrases": suspicious_words,
            "supporting_evidence": supporting_evidence,
            "contradicting_evidence": contradicting_evidence,
            "sources": sources,
            "reasoning": reasoning,
            "limitations": limitations,
            "ai_provider": "TruthGuard Demo Engine (Offline/Fallback)",
            "is_demo": True
        }

def get_ai_provider() -> BaseAIProvider:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:
        return GeminiProvider(api_key=settings.GEMINI_API_KEY, model_name=settings.GEMINI_MODEL)
    return DemoAIProvider()
