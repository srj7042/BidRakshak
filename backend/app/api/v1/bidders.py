from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
import json
import sqlite3

from app.core.db import get_db
from app.models.schemas import BidderResponse, BidderCreate

router = APIRouter(prefix="/bidders", tags=["Bidder Management"])

def empty_to_none(value: Optional[str]) -> Optional[str]:
    if isinstance(value, str) and not value.strip():
        return None
    return value

@router.get("", response_model=List[BidderResponse])
@router.get("/", response_model=List[BidderResponse])
def get_bidders(risk_level: Optional[str] = None, search: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM bidders WHERE 1=1"
    params = []
    
    if risk_level:
        query += " AND UPPER(risk_level) = UPPER(?)"
        params.append(risk_level)
    if search:
        query += " AND (LOWER(company_name) LIKE ? OR LOWER(gstin) LIKE ? OR LOWER(pan) LIKE ?)"
        s = f"%{search.lower()}%"
        params.extend([s, s, s])
        
    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    bidders = []
    for r in rows:
        bidders.append({
            "id": r["id"],
            "company_name": r["company_name"],
            "legal_status": r["legal_status"],
            "gstin": r["gstin"],
            "pan": r["pan"],
            "cin": r["cin"],
            "udyam_reg_no": r["udyam_reg_no"],
            "epfo_code": r["epfo_code"],
            "esic_code": r["esic_code"],
            "startup_india_id": r["startup_india_id"],
            "address": r["address"],
            "contact_email": r["contact_email"],
            "contact_phone": r["contact_phone"],
            "compliance_score": r["compliance_score"],
            "risk_level": r["risk_level"],
            "is_debarred": bool(r["is_debarred"]),
            "debarment_reason": r["debarment_reason"],
            "created_at": r["created_at"]
        })
    return bidders

@router.get("/{bidder_id}", response_model=BidderResponse)
def get_bidder(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bidders WHERE id = ? OR gstin = ? OR pan = ?", (bidder_id, bidder_id, bidder_id))
    r = cursor.fetchone()
    conn.close()
    
    if not r:
        raise HTTPException(status_code=404, detail="Bidder entity not found")
        
    return {
        "id": r["id"],
        "company_name": r["company_name"],
        "legal_status": r["legal_status"],
        "gstin": r["gstin"],
        "pan": r["pan"],
        "cin": r["cin"],
        "udyam_reg_no": r["udyam_reg_no"],
        "epfo_code": r["epfo_code"],
        "esic_code": r["esic_code"],
        "startup_india_id": r["startup_india_id"],
        "address": r["address"],
        "contact_email": r["contact_email"],
        "contact_phone": r["contact_phone"],
        "compliance_score": r["compliance_score"],
        "risk_level": r["risk_level"],
        "is_debarred": bool(r["is_debarred"]),
        "debarment_reason": r["debarment_reason"],
        "created_at": r["created_at"]
    }

@router.post("", response_model=BidderResponse, status_code=201)
@router.post("/", response_model=BidderResponse, status_code=201)
def create_bidder(bidder_in: BidderCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        b_id = str(uuid4())
        now = datetime.now().isoformat()
        gstin = empty_to_none(bidder_in.gstin)
        pan = empty_to_none(bidder_in.pan)
        cin = empty_to_none(bidder_in.cin)
        udyam_reg_no = empty_to_none(bidder_in.udyam_reg_no)

        cursor.execute("""
        INSERT INTO bidders (
            id, company_name, legal_status, gstin, pan, cin, udyam_reg_no,
            epfo_code, esic_code, startup_india_id, address, contact_email, contact_phone,
            compliance_score, risk_level, is_debarred, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            b_id, bidder_in.company_name, bidder_in.legal_status, gstin,
            pan, cin, udyam_reg_no, bidder_in.epfo_code,
            bidder_in.esic_code, bidder_in.startup_india_id, bidder_in.address,
            bidder_in.contact_email, bidder_in.contact_phone, 0.0, "LOW", 0, now
        ))

        cursor.execute("""
        INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, bidder_name, new_state, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid4()), "Procurement Officer", "CREATE_BIDDER", "BIDDER", b_id,
            bidder_in.company_name, json.dumps({"company_name": bidder_in.company_name}), now
        ))

        conn.commit()
    except sqlite3.IntegrityError as exc:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Bidder with same GSTIN, PAN, CIN, or Udyam number already exists") from exc
    finally:
        conn.close()

    return {
        "id": b_id,
        "company_name": bidder_in.company_name,
        "legal_status": bidder_in.legal_status,
        "gstin": gstin,
        "pan": pan,
        "cin": cin,
        "udyam_reg_no": udyam_reg_no,
        "epfo_code": bidder_in.epfo_code,
        "esic_code": bidder_in.esic_code,
        "startup_india_id": bidder_in.startup_india_id,
        "address": bidder_in.address,
        "contact_email": bidder_in.contact_email,
        "contact_phone": bidder_in.contact_phone,
        "compliance_score": 0.0,
        "risk_level": "LOW",
        "is_debarred": False,
        "debarment_reason": None,
        "created_at": now
    }

@router.delete("/{bidder_id}")
def delete_bidder(bidder_id: str):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM bidders WHERE id = ? OR gstin = ? OR pan = ?", (bidder_id, bidder_id, bidder_id))
    bidder = cursor.fetchone()
    if not bidder:
        conn.close()
        raise HTTPException(status_code=404, detail="Bidder entity not found")

    cursor.execute("SELECT id FROM bids WHERE bidder_id = ?", (bidder["id"],))
    bid_ids = [row["id"] for row in cursor.fetchall()]

    for bid_id in bid_ids:
        cursor.execute("DELETE FROM documents WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM compliance_checks WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM risk_assessments WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM ai_findings WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM officer_decisions WHERE bid_id = ?", (bid_id,))

    cursor.execute("DELETE FROM bids WHERE bidder_id = ?", (bidder["id"],))
    cursor.execute("DELETE FROM documents WHERE bidder_id = ?", (bidder["id"],))
    cursor.execute("DELETE FROM government_verifications WHERE bidder_id = ?", (bidder["id"],))
    cursor.execute("DELETE FROM bidders WHERE id = ?", (bidder["id"],))

    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, bidder_name, previous_state, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid4()), "Procurement Officer", "DELETE_BIDDER", "BIDDER", bidder["id"],
        bidder["company_name"], json.dumps({"company_name": bidder["company_name"]}), now
    ))

    conn.commit()
    conn.close()
    return {"status": "deleted", "id": bidder["id"]}
