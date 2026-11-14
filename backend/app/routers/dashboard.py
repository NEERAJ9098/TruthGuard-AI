from fastapi import APIRouter
from app.database import get_db
from app.schemas import DashboardStats

router = APIRouter(prefix="/api", tags=["Dashboard"])

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_statistics():
    """Fetch aggregated statistical metrics for visual dashboard charts."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Total count
        cursor.execute("SELECT COUNT(*) FROM analysis_records")
        total = cursor.fetchone()[0]

        # Counts by verdict
        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE verdict = 'LIKELY_REAL'")
        real_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE verdict = 'LIKELY_FAKE'")
        fake_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE verdict = 'UNVERIFIED'")
        unverified_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE verdict = 'MIXED_OR_MISLEADING'")
        mixed_count = cursor.fetchone()[0]

        # Average confidence
        cursor.execute("SELECT AVG(confidence_score) FROM analysis_records")
        avg_conf_row = cursor.fetchone()[0]
        avg_conf = float(avg_conf_row) if avg_conf_row is not None else 0.0

        # Evidence coverage breakdown
        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE evidence_coverage = 'HIGH'")
        cov_high = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE evidence_coverage = 'MEDIUM'")
        cov_med = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE evidence_coverage = 'LOW'")
        cov_low = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM analysis_records WHERE evidence_coverage = 'NONE'")
        cov_none = cursor.fetchone()[0]

        # Recent 10 analyses
        cursor.execute("""
            SELECT id, title, verdict, confidence_score, created_at
            FROM analysis_records
            ORDER BY id DESC
            LIMIT 10
        """)
        recent_rows = cursor.fetchall()

    verdict_distribution = [
        {"name": "Likely Real", "value": real_count, "color": "#10B981"},
        {"name": "Likely Fake", "value": fake_count, "color": "#EF4444"},
        {"name": "Unverified", "value": unverified_count, "color": "#F59E0B"},
        {"name": "Mixed / Misleading", "value": mixed_count, "color": "#8B5CF6"},
    ]

    evidence_distribution = [
        {"category": "High Evidence", "count": cov_high, "color": "#10B981"},
        {"category": "Medium Evidence", "count": cov_med, "color": "#3B82F6"},
        {"category": "Low Evidence", "count": cov_low, "color": "#F59E0B"},
        {"category": "No Evidence", "count": cov_none, "color": "#6B7280"},
    ]

    recent_list = []
    for r in reversed(recent_rows):
        recent_list.append({
            "id": r["id"],
            "title": (r["title"][:35] + "...") if r["title"] and len(r["title"]) > 35 else (r["title"] or "Untitled"),
            "verdict": r["verdict"],
            "confidence": r["confidence_score"] or 0.0,
            "created_at": str(r["created_at"])[-8:-3] if r["created_at"] else ""
        })

    return DashboardStats(
        total_analyzed=total,
        likely_real_count=real_count,
        likely_fake_count=fake_count,
        unverified_count=unverified_count,
        mixed_count=mixed_count,
        avg_confidence=round(avg_conf, 1),
        recent_verdicts=recent_list,
        verdict_distribution=verdict_distribution,
        evidence_coverage_distribution=evidence_distribution
    )
