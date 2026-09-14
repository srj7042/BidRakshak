from fastapi import APIRouter
from app.core.db import get_db

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])

@router.get("/overview")
def get_risk_overview():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM bidders WHERE UPPER(risk_level) = 'LOW'")
    low_count = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM bidders WHERE UPPER(risk_level) = 'MEDIUM'")
    med_count = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM bidders WHERE UPPER(risk_level) = 'HIGH'")
    high_count = cursor.fetchone()["count"]
    
    cursor.execute("SELECT COUNT(*) as count FROM bidders WHERE UPPER(risk_level) = 'CRITICAL' OR is_debarred = 1")
    crit_count = cursor.fetchone()["count"]
    
    conn.close()
    
    return {
        "overall_risk_distribution": {
            "LOW": low_count,
            "MEDIUM": med_count,
            "HIGH": high_count,
            "CRITICAL": crit_count
        },
        "top_risk_factors": [],
        "suspicious_pattern_alerts": []
    }
