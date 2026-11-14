import re
from typing import List, Dict, Any, Tuple

# Comprehensive list of suspicious / sensationalist / clickbait terms commonly found in misleading news
SENSATIONAL_PATTERNS = [
    # Hyperbolic claims & miracles
    r"\b100% (?:effective|cure|guaranteed|safe|proven)\b",
    r"\bmiracle (?:cure|drug|remedy|solution|pill|breakthrough)\b",
    r"\bsecret (?:cure|treatment|formula|method|doctors hate)\b",
    r"\binstant (?:cure|relief|fix|results)\b",
    r"\bwhat they don'?t want you to know\b",
    r"\bmainstream media (?:won'?t tell|is hiding|is lying|covers? up)\b",
    r"\bgovernment (?:coverup|is hiding|suppressing|conspiracy)\b",
    r"\bshocking (?:truth|revelation|video|proof|confession)\b",
    r"\byou won'?t believe\b",
    r"\bblows? your mind\b",
    r"\bundeniable proof\b",
    r"\babsolute bombshell\b",
    r"\bscientists? (?:baffled|shocked|silenced|terrified)\b",
    r"\bdoctors? (?:stunned|in shock|are furious|hate this)\b",
    r"\bbig pharma doesn'?t want\b",
    r"\bexposed once and for all\b",
    r"\bshare before it gets deleted\b",
    r"\bban(?:ned)? from the internet\b",
    r"\bthis one weird trick\b",
    r"\bthe real reason why\b",
    r"\burgent alert\b",
    r"\bwake up sheeple\b",
    r"\bthey are lying to you\b",
    r"\bsecret plot\b",
    r"\bdeadly secret\b",
    r"\billuminati\b",
    r"\bnew world order\b",
    r"\bdeep state plot\b",
]

EMOTIONAL_CLICKBAIT_WORDS = [
    "SHOCKING", "BOMBSHELL", "DISASTER", "TERRIFYING", "UNBELIEVABLE",
    "INSANE", "TRAVESTY", "APOCALYPSE", "HORRIFYING", "DESTROYED",
    "EXPOSED", "CONFIRMED", "WARNING", "MIRACLE", "COLLAPSE",
    "DEVASTATING", "CRUSHED", "OUTRAGEOUS", "TREASON", "CORRUPT"
]

class TextProcessor:
    @staticmethod
    def clean_text(text: str) -> str:
        """Strip non-printable chars, normalize whitespace."""
        if not text:
            return ""
        # Remove extra whitespaces
        text = re.sub(r"[\r\n\t]+", " ", text)
        text = re.sub(r"\s{2,}", " ", text)
        return text.strip()

    @staticmethod
    def extract_title_and_body(text: str, is_headline_input: bool = False) -> Tuple[str, str]:
        """Split text into title and remaining body."""
        clean = TextProcessor.clean_text(text)
        if is_headline_input or len(clean.split()) <= 20:
            return clean, clean
        
        # Split by first newline or period
        sentences = re.split(r'(?<=[.!?])\s+', clean)
        if sentences:
            title = sentences[0][:200]
            body = " ".join(sentences[1:]) if len(sentences) > 1 else clean
            return title, body
        return clean[:120], clean

    @staticmethod
    def detect_suspicious_phrases(text: str) -> List[str]:
        """Find clickbait, sensational, or manipulative phrases in text."""
        found = set()
        text_lower = text.lower()

        # Check regex patterns
        for pattern in SENSATIONAL_PATTERNS:
            matches = re.finditer(pattern, text_lower, re.IGNORECASE)
            for m in matches:
                found.add(m.group(0))

        # Check uppercase emotional words
        words = re.findall(r'\b[A-Z]{3,}\b', text)
        for w in words:
            if w in EMOTIONAL_CLICKBAIT_WORDS:
                found.add(w)

        # Check ALL-CAPS sentences
        caps_phrases = re.findall(r'([A-Z\s]{12,}[!?])', text)
        for cp in caps_phrases:
            if len(cp.strip()) > 10:
                found.add(cp.strip())

        return list(found)[:10]

    @staticmethod
    def extract_heuristic_claims(text: str) -> List[str]:
        """Extract candidate factual claims from text using linguistic cues."""
        clean = TextProcessor.clean_text(text)
        sentences = re.split(r'(?<=[.!?])\s+', clean)
        
        claims = []
        # Indicators of factual assertion
        assertion_markers = [
            "found that", "announced", "reported", "stated", "confirmed",
            "according to", "discovered", "study shows", "data reveals",
            "claims that", "alleged", "died", "passed away", "signed",
            "voted to", "arrested", "launched", "will be banned", "proves that"
        ]
        
        for s in sentences:
            s_stripped = s.strip()
            if 20 <= len(s_stripped) <= 250:
                s_lower = s_stripped.lower()
                if any(m in s_lower for m in assertion_markers) or re.search(r'\b\d{1,3}%\b|\b\$\d+|\b\d+\s+(?:people|patients|cases|dead|killed|arrested)\b', s_lower):
                    claims.append(s_stripped)

        if not claims and sentences:
            # Fallback: take first 2 coherent sentences
            claims = [s.strip() for s in sentences[:2] if len(s.strip()) > 15]

        return claims[:5]

    @staticmethod
    def calculate_sensationalism_index(text: str, suspicious_phrases: List[str]) -> float:
        """Calculate a 0-100 sensationalism score."""
        if not text:
            return 0.0
        
        score = 0.0
        # Exclamation marks count
        excl_count = text.count("!")
        score += min(excl_count * 5.0, 25.0)

        # Suspicious phrases weight
        score += min(len(suspicious_phrases) * 12.0, 45.0)

        # ALL-CAPS word ratio
        words = text.split()
        if words:
            caps_words = [w for w in words if w.isupper() and len(w) > 2]
            caps_ratio = len(caps_words) / len(words)
            score += min(caps_ratio * 100.0, 30.0)

        return min(round(score, 1), 100.0)
