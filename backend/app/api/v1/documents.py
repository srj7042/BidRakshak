from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
import json

from app.core.db import get_db
from app.services.ai_ocr_service import AIOCRVerificationService
from app.services.compliance_engine import ComplianceEngine

router = APIRouter(prefix="/documents", tags=["Document Management & OCR"])

def empty_to_none(value):
    if isinstance(value, str) and not value.strip():
        return None
    return value

def row_to_bidder(row):
    return {
        "id": row["id"],
        "company_name": row["company_name"],
        "legal_status": row["legal_status"],
        "gstin": row["gstin"],
        "pan": row["pan"],
        "cin": row["cin"],
        "udyam_reg_no": row["udyam_reg_no"],
        "epfo_code": row["epfo_code"],
        "esic_code": row["esic_code"],
        "startup_india_id": row["startup_india_id"],
        "address": row["address"],
        "contact_email": row["contact_email"],
        "contact_phone": row["contact_phone"],
        "compliance_score": row["compliance_score"],
        "risk_level": row["risk_level"],
        "is_debarred": bool(row["is_debarred"]),
        "debarment_reason": row["debarment_reason"],
        "created_at": row["created_at"],
    }

def find_existing_bidder(cursor, profile):
    keys = ["gstin", "pan", "cin", "udyam_reg_no"]
    clauses = []
    params = []
    for key in keys:
        value = empty_to_none(profile.get(key))
        if value:
            clauses.append(f"{key} = ?")
            params.append(value)
    if not clauses:
        return None
    cursor.execute(f"SELECT * FROM bidders WHERE {' OR '.join(clauses)} LIMIT 1", params)
    return cursor.fetchone()

def upsert_bidder_from_profile(cursor, profile, now):
    mca_id = empty_to_none(profile.get("cin") or profile.get("llpin"))
    normalized = {
        "company_name": empty_to_none(profile.get("company_name")) or "Unknown Bidder",
        "legal_status": empty_to_none(profile.get("legal_status")),
        "gstin": empty_to_none(profile.get("gstin")),
        "pan": empty_to_none(profile.get("pan")),
        "cin": mca_id,
        "udyam_reg_no": empty_to_none(profile.get("udyam_reg_no")),
        "epfo_code": empty_to_none(profile.get("epfo_code")),
        "esic_code": empty_to_none(profile.get("esic_code")),
        "startup_india_id": empty_to_none(profile.get("startup_india_id")),
        "address": empty_to_none(profile.get("address") or profile.get("state")),
        "contact_email": empty_to_none(profile.get("contact_email")),
        "contact_phone": empty_to_none(profile.get("contact_phone")),
    }

    existing = find_existing_bidder(cursor, normalized)
    if existing:
        bidder_id = existing["id"]
        cursor.execute("""
        UPDATE bidders
        SET company_name = ?, legal_status = COALESCE(?, legal_status),
            gstin = COALESCE(?, gstin), pan = COALESCE(?, pan), cin = COALESCE(?, cin),
            udyam_reg_no = COALESCE(?, udyam_reg_no), epfo_code = COALESCE(?, epfo_code),
            esic_code = COALESCE(?, esic_code), startup_india_id = COALESCE(?, startup_india_id),
            address = COALESCE(?, address), contact_email = COALESCE(?, contact_email),
            contact_phone = COALESCE(?, contact_phone)
        WHERE id = ?
        """, (
            normalized["company_name"], normalized["legal_status"], normalized["gstin"],
            normalized["pan"], normalized["cin"], normalized["udyam_reg_no"],
            normalized["epfo_code"], normalized["esic_code"], normalized["startup_india_id"],
            normalized["address"], normalized["contact_email"], normalized["contact_phone"], bidder_id
        ))
    else:
        bidder_id = str(uuid4())
        cursor.execute("""
        INSERT INTO bidders (
            id, company_name, legal_status, gstin, pan, cin, udyam_reg_no,
            epfo_code, esic_code, startup_india_id, address, contact_email, contact_phone,
            compliance_score, risk_level, is_debarred, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            bidder_id, normalized["company_name"], normalized["legal_status"], normalized["gstin"],
            normalized["pan"], normalized["cin"], normalized["udyam_reg_no"], normalized["epfo_code"],
            normalized["esic_code"], normalized["startup_india_id"], normalized["address"],
            normalized["contact_email"], normalized["contact_phone"], 0.0, "PENDING", 0, now
        ))

    cursor.execute("SELECT * FROM bidders WHERE id = ?", (bidder_id,))
    return row_to_bidder(cursor.fetchone())

def load_tender_for_scan(cursor):
    cursor.execute("SELECT * FROM tenders WHERE UPPER(status) = 'ACTIVE' ORDER BY created_at DESC LIMIT 1")
    tender = cursor.fetchone()
    if tender:
        return dict(tender)
    return {
        "id": "scan-default",
        "min_turnover_required": 0.0,
        "msme_exemption_allowed": True,
        "local_content_min_percentage": 60.0,
    }

def persist_compliance_result(cursor, doc_id, bidder_id, bidder_name, result, now):
    scan_bid_id = f"{doc_id}:{bidder_id}"
    cursor.execute("""
    UPDATE bidders SET compliance_score = ?, risk_level = ? WHERE id = ?
    """, (result["overall_score"], result["risk_level"], bidder_id))

    cursor.execute("DELETE FROM compliance_checks WHERE bid_id = ?", (scan_bid_id,))
    for check in result.get("checks", []):
        cursor.execute("""
        INSERT INTO compliance_checks (
            id, bid_id, check_type, status, evidence, source_agency, explanation, verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(uuid4()), scan_bid_id, check["check_type"], check["status"],
            check.get("evidence"), check.get("source_agency"), check.get("explanation"),
            check.get("verified_at") or now
        ))

    cursor.execute("""
    INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, bidder_name, new_state, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid4()), "Procurement Officer", "OCR_BIDDER_SCAN_AND_COMPLIANCE",
        "DOCUMENT", doc_id, bidder_name, json.dumps({
            "bidder_id": bidder_id,
            "scan_bid_id": scan_bid_id,
            "overall_score": result["overall_score"],
            "risk_level": result["risk_level"],
            "failed_count": result["failed_count"],
        }), now
    ))

@router.get("", response_model=List[dict])
@router.get("/", response_model=List[dict])
def list_documents(bidder_id: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = """
    SELECT d.*, e.extracted_json, e.confidence_score
    FROM documents d
    LEFT JOIN document_extractions e ON e.document_id = d.id
    """
    if bidder_id:
        cursor.execute(query + " WHERE d.bidder_id = ? ORDER BY d.uploaded_at DESC", (bidder_id,))
    else:
        cursor.execute(query + " ORDER BY d.uploaded_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    docs = []
    for r in rows:
        extracted_fields = json.loads(r["extracted_json"]) if r["extracted_json"] else None
        docs.append({
            "id": r["id"],
            "bid_id": r["bid_id"],
            "bidder_id": r["bidder_id"],
            "document_type": r["document_type"],
            "file_name": r["file_name"],
            "file_path": r["file_path"],
            "file_size_bytes": r["file_size_bytes"],
            "mime_type": r["mime_type"],
            "ocr_processed": bool(r["ocr_processed"]),
            "uploaded_at": r["uploaded_at"],
            "extracted_fields": extracted_fields,
            "confidence_score": r["confidence_score"]
        })
    return docs

@router.post("/upload")
async def upload_document(
    document_type: str = Form(...),
    bidder_id: str = Form(...),
    file: UploadFile = File(...)
):
    content = await file.read()
    extracted_fields = AIOCRVerificationService.extract_document_fields(document_type, file.filename, content)
    bidder_profiles = extracted_fields.get("bidder_profiles") or AIOCRVerificationService.extract_bidder_profiles(document_type, file.filename, content)

    conn = get_db()
    cursor = conn.cursor()

    doc_id = str(uuid4())
    now = datetime.now().isoformat()
    file_path = f"/storage/bid-documents/{file.filename}"
    file_size = len(content) or file.size or 1024500
    mime = file.content_type or "application/pdf"
    saved_bidders = []
    compliance_results = []

    for profile in bidder_profiles:
        saved_bidder = upsert_bidder_from_profile(cursor, profile, now)
        saved_bidders.append(saved_bidder)

    primary_bidder_id = saved_bidders[0]["id"] if saved_bidders else bidder_id
    
    cursor.execute("""
    INSERT INTO documents (
        id, bid_id, bidder_id, document_type, file_name, file_path, file_size_bytes, mime_type, ocr_processed, uploaded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        doc_id, doc_id, primary_bidder_id, document_type, file.filename, file_path, file_size, mime, 1, now
    ))

    tender_data = load_tender_for_scan(cursor)
    for saved_bidder, profile in zip(saved_bidders, bidder_profiles):
        bidder_for_check = {**saved_bidder, **profile}
        result = ComplianceEngine.evaluate_bid_compliance(bidder_for_check, tender_data, [extracted_fields])
        persist_compliance_result(cursor, doc_id, saved_bidder["id"], saved_bidder["company_name"], result, now)
        saved_bidder["compliance_score"] = result["overall_score"]
        saved_bidder["risk_level"] = result["risk_level"]
        compliance_results.append({
            "bidder_id": saved_bidder["id"],
            "company_name": saved_bidder["company_name"],
            **result,
        })

    if bidder_profiles:
        extracted_fields["bidder_profiles"] = bidder_profiles
    if saved_bidders:
        extracted_fields["saved_bidders"] = saved_bidders
    if compliance_results:
        extracted_fields["compliance_results"] = compliance_results

    cursor.execute("""
    INSERT INTO document_extractions (
        id, document_id, extracted_json, confidence_score, extracted_at
    ) VALUES (?, ?, ?, ?, ?)
    """, (
        str(uuid4()), doc_id, json.dumps(extracted_fields), extracted_fields.get("confidence_score", 0.0), now
    ))

    conn.commit()
    conn.close()
    
    return {
        "id": doc_id,
        "bid_id": doc_id,
        "bidder_id": primary_bidder_id,
        "document_type": document_type,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size_bytes": file_size,
        "mime_type": mime,
        "ocr_processed": True,
        "uploaded_at": now,
        "extracted_fields": extracted_fields,
        "confidence_score": extracted_fields.get("confidence_score", 0.0),
        "saved_bidders": saved_bidders,
        "compliance_results": compliance_results,
    }

@router.delete("/{document_id}")
def delete_document(document_id: str):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM documents WHERE id = ?", (document_id,))
    document = cursor.fetchone()
    if not document:
        conn.close()
        raise HTTPException(status_code=404, detail="Document not found")

    cursor.execute("DELETE FROM compliance_checks WHERE bid_id = ? OR bid_id LIKE ?", (document_id, f"{document_id}:%"))
    cursor.execute("DELETE FROM document_extractions WHERE document_id = ?", (document_id,))
    cursor.execute("DELETE FROM documents WHERE id = ?", (document_id,))
    conn.commit()
    conn.close()

    return {"status": "deleted", "id": document_id}
