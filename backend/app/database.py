import sqlite3
import os
from contextlib import contextmanager
from app.config import settings

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "truthguard.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize database tables using standard library sqlite3."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analysis_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input_type TEXT DEFAULT 'text',
                input_content TEXT NOT NULL,
                title TEXT,
                verdict TEXT NOT NULL,
                confidence_score REAL DEFAULT 0.0,
                evidence_coverage TEXT DEFAULT 'LOW',
                summary TEXT,
                reasoning TEXT,
                limitations TEXT,
                claims_json TEXT DEFAULT '[]',
                suspicious_phrases_json TEXT DEFAULT '[]',
                supporting_evidence_json TEXT DEFAULT '[]',
                contradicting_evidence_json TEXT DEFAULT '[]',
                sources_json TEXT DEFAULT '[]',
                ml_prediction_json TEXT DEFAULT '{}',
                fact_check_matches_json TEXT DEFAULT '[]',
                news_search_matches_json TEXT DEFAULT '[]',
                ai_provider TEXT DEFAULT 'gemini',
                is_demo INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
