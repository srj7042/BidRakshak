from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
import json
import sqlite3

from app.core.db import get_db
from app.models.schemas import TenderResponse, TenderCreate

router = APIRouter(prefix="/tenders", tags=["Tenders & Bids"])

@router.get("", response_model=List[TenderResponse])
@router.get("/", response_model=List[TenderResponse])
def get_tenders(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM tenders WHERE 1=1"
    params = []
    
    if status:
        query += " AND UPPER(status) = UPPER(?)"
        params.append(status)
    if category:
        query += " AND UPPER(category) = UPPER(?)"
        params.append(category)
    if search:
        query += " AND (LOWER(title) LIKE ? OR LOWER(gem_reference_no) LIKE ?)"
        s = f"%{search.lower()}%"
        params.extend([s, s])
        
    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    tenders = []
    for r in rows:
        tenders.append({
            "id": r["id"],
            "gem_reference_no": r["gem_reference_no"],
            "title": r["title"],
            "category": r["category"],
            "estimated_value": r["estimated_value"],
            "issuing_organization_id": r["issuing_organization_id"],
            "published_date": r["published_date"],
            "closing_date": r["closing_date"],
            "status": r["status"],
            "min_turnover_required": r["min_turnover_required"],
            "msme_exemption_allowed": bool(r["msme_exemption_allowed"]),
            "local_content_min_percentage": r["local_content_min_percentage"],
            "created_at": r["created_at"]
        })
    return tenders

@router.get("/{tender_id}", response_model=TenderResponse)
def get_tender(tender_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenders WHERE id = ? OR gem_reference_no = ?", (tender_id, tender_id))
    r = cursor.fetchone()
    conn.close()
    
    if not r:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    return {
        "id": r["id"],
        "gem_reference_no": r["gem_reference_no"],
        "title": r["title"],
        "category": r["category"],
        "estimated_value": r["estimated_value"],
        "issuing_organization_id": r["issuing_organization_id"],
        "published_date": r["published_date"],
        "closing_date": r["closing_date"],
        "status": r["status"],
        "min_turnover_required": r["min_turnover_required"],
        "msme_exemption_allowed": bool(r["msme_exemption_allowed"]),
        "local_content_min_percentage": r["local_content_min_percentage"],
        "created_at": r["created_at"]
    }

@router.post("", response_model=TenderResponse, status_code=201)
@router.post("/", response_model=TenderResponse, status_code=201)
def create_tender(tender_in: TenderCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        t_id = str(uuid4())
        now = datetime.now().isoformat()
        org_id = str(tender_in.issuing_organization_id) if tender_in.issuing_organization_id else str(uuid4())

        cursor.execute("""
        INSERT INTO tenders (
            id, gem_reference_no, title, category, estimated_value, issuing_organization_id,
            published_date, closing_date, status, min_turnover_required,
            msme_exemption_allowed, local_content_min_percentage, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t_id, tender_in.gem_reference_no, tender_in.title, tender_in.category,
            tender_in.estimated_value, org_id, now, tender_in.closing_date.isoformat(),
            "ACTIVE", tender_in.min_turnover_required,
            1 if tender_in.msme_exemption_allowed else 0,
            tender_in.local_content_min_percentage, now
        ))

        cursor.execute("""
        INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, tender_ref, new_state, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid4()), "Procurement Officer", "CREATE_TENDER", "TENDER", t_id,
            tender_in.gem_reference_no, json.dumps({"title": tender_in.title}), now
        ))

        conn.commit()
    except sqlite3.IntegrityError as exc:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Tender with this GeM reference number already exists") from exc
    finally:
        conn.close()

    return {
        "id": t_id,
        "gem_reference_no": tender_in.gem_reference_no,
        "title": tender_in.title,
        "category": tender_in.category,
        "estimated_value": tender_in.estimated_value,
        "issuing_organization_id": org_id,
        "published_date": now,
        "closing_date": tender_in.closing_date.isoformat(),
        "status": "ACTIVE",
        "min_turnover_required": tender_in.min_turnover_required,
        "msme_exemption_allowed": tender_in.msme_exemption_allowed,
        "local_content_min_percentage": tender_in.local_content_min_percentage,
        "created_at": now
    }

@router.delete("/{tender_id}")
def delete_tender(tender_id: str):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tenders WHERE id = ? OR gem_reference_no = ?", (tender_id, tender_id))
    tender = cursor.fetchone()
    if not tender:
        conn.close()
        raise HTTPException(status_code=404, detail="Tender not found")

    cursor.execute("SELECT id FROM bids WHERE tender_id = ?", (tender["id"],))
    bid_ids = [row["id"] for row in cursor.fetchall()]

    for bid_id in bid_ids:
        cursor.execute("DELETE FROM documents WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM compliance_checks WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM risk_assessments WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM ai_findings WHERE bid_id = ?", (bid_id,))
        cursor.execute("DELETE FROM officer_decisions WHERE bid_id = ?", (bid_id,))

    cursor.execute("DELETE FROM bids WHERE tender_id = ?", (tender["id"],))
    cursor.execute("DELETE FROM tenders WHERE id = ?", (tender["id"],))

    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, tender_ref, previous_state, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid4()), "Procurement Officer", "DELETE_TENDER", "TENDER", tender["id"],
        tender["gem_reference_no"], json.dumps({"title": tender["title"]}), now
    ))

    conn.commit()
    conn.close()
    return {"status": "deleted", "id": tender["id"]}
