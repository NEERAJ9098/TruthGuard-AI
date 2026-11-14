import os
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file from backend root or workspace root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
load_dotenv()  # fallback

class Settings(BaseModel):
    PROJECT_NAME: str = "TruthGuard AI - Fake News Detection System"
    VERSION: str = "1.0.0"
    HACKATHON: str = "HackNova Bhopal 2K26"
    
    # API Keys
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_FACT_CHECK_API_KEY: Optional[str] = os.getenv("GOOGLE_FACT_CHECK_API_KEY", "")
    NEWS_API_KEY: Optional[str] = os.getenv("NEWS_API_KEY", "")
    
    # Model configuration
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")  # "gemini" or "demo"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./truthguard.db")
    
    # Rate Limiting & Safety
    MAX_REQUEST_LENGTH: int = 15000  # characters
    URL_REQUEST_TIMEOUT: int = 10    # seconds
    EXTERNAL_API_TIMEOUT: int = 8    # seconds

settings = Settings()
