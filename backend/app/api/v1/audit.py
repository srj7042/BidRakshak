from fastapi import APIRouter
from typing import List
from app.core.db import get_db

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("")
@router.get("/")
def get_audit_trail():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    
    logs = []
    for r in rows:
        logs.append({
            "id": r["id"],
            "user_name": r["user_name"] or "System Actor",
            "action": r["action"],
            "entity_type": r["entity_type"],
            "entity_id": r["entity_id"],
            "tender_ref": r["tender_ref"] or "N/A",
            "bidder_name": r["bidder_name"] or "N/A",
            "previous_state": r["previous_state"],
            "new_state": r["new_state"],
            "ip_address": r["ip_address"] or "127.0.0.1",
            "timestamp": r["timestamp"]
        })
    return logs
