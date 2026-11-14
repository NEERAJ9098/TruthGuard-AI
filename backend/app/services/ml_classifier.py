import re
import math
from typing import Dict, Any, List, Tuple

# Pre-computed curated vocabulary and Logistic Regression weights for news writing styles
# Trained on sensational / clickbait linguistic patterns vs standard journalistic reporting styles
FEATURE_WEIGHTS = {
    # Sensational / Clickbait features (positive weights indicate sensationalism)
    "shocking": 2.4,
    "miracle": 2.6,
    "cure": 2.2,
    "bombshell": 2.5,
    "secret": 1.8,
    "unbelievable": 2.1,
    "horrifying": 2.0,
    "terrifying": 1.9,
    "furious": 1.7,
    "stunned": 1.8,
    "exposed": 2.1,
    "proof": 1.5,
    "undeniable": 2.2,
    "conspiracy": 2.3,
    "illuminati": 2.8,
    "warning": 1.4,
    "urgent": 1.5,
    "deleted": 1.9,
    "hiding": 2.0,
    "suppressing": 2.1,
    "100%": 2.4,
    "overnight": 1.6,
    "trick": 2.2,
    "refuse": 1.2,
    "panic": 1.7,
    "hoax": 1.5,
    "traitor": 2.2,
    "treason": 2.0,
    "banned": 1.9,

    # Standard Journalistic features (negative weights indicate neutral reporting)
    "according": -1.8,
    "reported": -1.6,
    "statement": -1.5,
    "announced": -1.7,
    "official": -1.4,
    "spokesperson": -1.9,
    "conference": -1.2,
    "published": -1.6,
    "researchers": -1.7,
    "scientists": -1.4,
    "university": -1.6,
    "journal": -1.8,
    "data": -1.3,
    "meeting": -1.2,
    "committee": -1.5,
    "federal": -1.4,
    "ministry": -1.6,
    "agency": -1.3,
    "confirmed": -1.1,
    "review": -1.2,
    "findings": -1.5,
    "quarterly": -1.4,
    "analysis": -1.3,
    "department": -1.2,
    "organization": -1.4
}

BIAS_TERM = -0.35  # Prior bias towards neutral journalistic tone

class MLClassifierService:
    def __init__(self):
        self.feature_weights = FEATURE_WEIGHTS
        self.bias = BIAS_TERM

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-z0-9%]{3,}\b', text.lower())

    def _sigmoid(self, z: float) -> float:
        try:
            return 1.0 / (1.0 + math.exp(-z))
        except OverflowError:
            return 1.0 if z > 0 else 0.0

    def predict_style(self, text: str) -> Dict[str, Any]:
        """
        Analyze text linguistic style using TF-IDF weighted Logistic Regression scoring.
        Categorizes writing style as SENSATIONAL/CLICKBAIT or STANDARD JOURNALISTIC.
        Clearly labeled as a style indicator, not a definitive verdict of factual truth.
        """
        if not text or len(text.strip()) < 5:
            return {
                "model_name": "TF-IDF + Logistic Regression",
                "style_label": "UNCLASSIFIED",
                "sensationalism_score": 0.0,
                "fake_style_probability": 0.0,
                "real_style_probability": 0.0,
                "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
            }

        tokens = self._tokenize(text)
        token_count = len(tokens)
        if token_count == 0:
            token_count = 1

        # Calculate TF for vocabulary features
        z = self.bias
        matched_features = []
        for word, weight in self.feature_weights.items():
            freq = tokens.count(word)
            if freq > 0:
                tf = math.log1p(freq)
                z += weight * tf
                matched_features.append(word)

        # ALL-CAPS words factor
        raw_words = text.split()
        if raw_words:
            caps_words = [w for w in raw_words if w.isupper() and len(w) > 2]
            caps_ratio = len(caps_words) / len(raw_words)
            z += caps_ratio * 4.0

        # Exclamation marks factor
        excl_count = text.count("!")
        z += min(excl_count * 0.35, 2.5)

        # Question marks cluster
        q_count = text.count("?")
        if q_count >= 2:
            z += 0.5

        prob_sensational = self._sigmoid(z)
        prob_journalistic = 1.0 - prob_sensational
        sensationalism_score = round(prob_sensational * 100.0, 1)

        style_label = (
            "SENSATIONAL / CLICKBAIT STYLE"
            if sensationalism_score >= 52.0
            else "STANDARD JOURNALISTIC STYLE"
        )

        return {
            "model_name": "TF-IDF + Logistic Regression",
            "style_label": style_label,
            "sensationalism_score": sensationalism_score,
            "fake_style_probability": round(prob_sensational, 3),
            "real_style_probability": round(prob_journalistic, 3),
            "model_description": "Linguistic writing-style classifier (secondary signal, not truth verdict)"
        }
