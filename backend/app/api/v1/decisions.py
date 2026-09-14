from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
import hashlib
import json

from app.core.db import get_db

router = APIRouter(prefix="/decisions", tags=["Officer Decision Center"])

class DecisionSubmitRequest(BaseModel):
    bid_id: str
    decision: str # APPROVED, REJECTED, CLARIFICATION_REQUESTED, REFERRED_TO_COMMITTEE
    remarks: str
    officer_name: Optional[str] = "Procurement Officer"


@router.get("")
@router.get("/")
def get_decisions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM officer_decisions ORDER BY decided_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    decisions = []
    for r in rows:
        decisions.append({
            "id": r["id"],
            "bid_id": r["bid_id"],
            "officer_name": r["officer_name"] or "Procurement Officer",
            "designation": r["designation"] or "Chief Nodal Officer",
            "decision": r["decision"],
            "remarks": r["remarks"],
            "digital_signature_hash": r["digital_signature_hash"],
            "decided_at": r["decided_at"]
        })
    return decisions

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_officer_decision(payload: DecisionSubmitRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    dec_id = str(uuid4())
    now = datetime.now().isoformat()
    sign_raw = f"{payload.bid_id}:{payload.decision}:{payload.remarks}:{now}"
    sig_hash = f"sha256:{hashlib.sha256(sign_raw.encode()).hexdigest()}"
    
    cursor.execute("""
    INSERT INTO officer_decisions (
        id, bid_id, officer_id, officer_name, designation, decision, remarks, digital_signature_hash, decided_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        dec_id, payload.bid_id, "usr-849201", payload.officer_name,
        "Chief Nodal Officer", payload.decision, payload.remarks, sig_hash, now
    ))
    
    # Immutable audit trail entry
    cursor.execute("""
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, new_state, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid4()), payload.officer_name or "Procurement Officer",
        f"OFFICER_DECISION_{payload.decision}", "DECISION", dec_id,
        json.dumps({"decision": payload.decision, "hash": sig_hash}), now
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "id": dec_id,
        "bid_id": payload.bid_id,
        "officer_name": payload.officer_name,
        "designation": "Chief Nodal Officer",
        "decision": payload.decision,
        "remarks": payload.remarks,
        "digital_signature_hash": sig_hash,
        "decided_at": now
    }
