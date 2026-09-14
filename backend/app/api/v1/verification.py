from fastapi import APIRouter
from typing import Dict, Any
from app.services.ai_ocr_service import AIOCRVerificationService
from app.services.compliance_engine import ComplianceEngine

router = APIRouter(prefix="/verification", tags=["AI Verification Center"])

@router.post("/workspace")
def get_ai_workspace(payload: Dict[str, Any]):
    bidder = payload.get("bidder")
    tender = payload.get("tender")
    
    if not bidder or not tender:
        return {
            "status": "NO_BID_SELECTED",
            "message": "Select a tender and bidder to run AI verification workspace.",
            "bidder": None,
            "tender": None,
            "extracted_fields": {},
            "cross_validation_findings": [],
            "compliance_summary": {"overall_score": 0.0, "risk_level": "PENDING", "verified_count": 0, "failed_count": 0, "total_checks": 0, "checks": []},
            "ai_recommendation": {
                "recommendation": "MANUAL_AUDIT",
                "reasons": ["Select bid entity to initialize AI verification dossier."],
                "confidence_score": 0.0,
                "disclaimer": "AI Recommendation is decision support only."
            }
        }
        
    extracted_fields = AIOCRVerificationService.extract_document_fields("BALANCE_SHEET", "Audited_Balance_Sheet.pdf")
    cross_val_findings = AIOCRVerificationService.perform_cross_validation(bidder, extracted_fields, tender)
    compliance_summary = ComplianceEngine.evaluate_bid_compliance(bidder, tender, [])
    recommendation = AIOCRVerificationService.generate_recommendation(compliance_summary, cross_val_findings)

    return {
        "status": "ACTIVE",
        "bidder": bidder,
        "tender": tender,
        "extracted_fields": extracted_fields,
        "cross_validation_findings": cross_val_findings,
        "compliance_summary": compliance_summary,
        "ai_recommendation": recommendation
    }
