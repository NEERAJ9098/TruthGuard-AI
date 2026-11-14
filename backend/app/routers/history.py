import json
from typing import List
from fastapi import APIRouter, HTTPException, status

from app.database import get_db
from app.schemas import HistoryItem, HistoryDetailResponse, EvidenceItem, SourceItem, MLSignal

router = APIRouter(prefix="/api", tags=["History"])

@router.get("/history", response_model=List[HistoryItem])
def get_all_history(skip: int = 0, limit: int = 50):
    """Fetch previous analysis reports ordered by newest first."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, input_type, verdict, confidence_score, evidence_coverage, summary, created_at
            FROM analysis_records
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        """, (limit, skip))
        rows = cursor.fetchall()
        
    results = []
    for r in rows:
        results.append(HistoryItem(
            id=r["id"],
            title=r["title"] or "Untitled Analysis",
            input_type=r["input_type"] or "text",
            verdict=r["verdict"],
            confidence_score=r["confidence_score"] or 0.0,
            evidence_coverage=r["evidence_coverage"] or "LOW",
            summary=r["summary"],
            created_at=str(r["created_at"]) if r["created_at"] else ""
        ))
    return results

@router.get("/history/{record_id}", response_model=HistoryDetailResponse)
def get_history_by_id(record_id: int):
    """Get full details of a past analysis report."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM analysis_records WHERE id = ?", (record_id,))
        record = cursor.fetchone()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")

    def parse_json(val, default):
        if not val:
            return default
        try:
            return json.loads(val)
        except Exception:
            return default

    claims = parse_json(record["claims_json"], [])
    suspicious = parse_json(record["suspicious_phrases_json"], [])
    supporting = [EvidenceItem(**i) for i in parse_json(record["supporting_evidence_json"], [])]
    contradicting = [EvidenceItem(**i) for i in parse_json(record["contradicting_evidence_json"], [])]
    sources = [SourceItem(**i) for i in parse_json(record["sources_json"], [])]
    ml_dict = parse_json(record["ml_prediction_json"], {})
    ml_sig = MLSignal(**ml_dict) if ml_dict and "model_name" in ml_dict else None

    fact_matches = parse_json(record["fact_check_matches_json"], [])
    news_matches = parse_json(record["news_search_matches_json"], [])

    return HistoryDetailResponse(
        id=record["id"],
        title=record["title"],
        verdict=record["verdict"],
        confidence_score=record["confidence_score"] or 0.0,
        evidence_coverage=record["evidence_coverage"] or "LOW",
        summary=record["summary"] or "",
        claims=claims,
        suspicious_phrases=suspicious,
        supporting_evidence=supporting,
        contradicting_evidence=contradicting,
        sources=sources,
        reasoning=record["reasoning"] or "",
        limitations=record["limitations"] or "",
        ml_signal=ml_sig,
        fact_check_count=len(fact_matches),
        news_search_count=len(news_matches),
        ai_provider=record["ai_provider"] or "gemini",
        is_demo=bool(record["is_demo"]),
        created_at=str(record["created_at"]) if record["created_at"] else ""
    )

@router.delete("/history/{record_id}")
def delete_history_item(record_id: int):
    """Delete a specific analysis report from history."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analysis_records WHERE id = ?", (record_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")
        conn.commit()
    return {"status": "success", "message": f"Report #{record_id} successfully deleted."}

@router.delete("/history")
def clear_all_history():
    """Clear all analysis history."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analysis_records")
        conn.commit()
    return {"status": "success", "message": "All history records cleared."}
