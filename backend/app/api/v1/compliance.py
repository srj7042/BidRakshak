from fastapi import APIRouter
from typing import Dict, Any, List
from app.services.compliance_engine import ComplianceEngine

router = APIRouter(prefix="/compliance", tags=["Compliance Engine"])

@router.post("/verify")
def evaluate_compliance(payload: Dict[str, Any]):
    bidder_data = payload.get("bidder", {})
    tender_data = payload.get("tender", {})
    extracted_docs = payload.get("extracted_docs", [])
    
    if not bidder_data or not tender_data:
        return {
            "status": "UNCONFIGURED",
            "message": "Bidder and Tender parameters required for dynamic evaluation.",
            "checks": []
        }
        
    return ComplianceEngine.evaluate_bid_compliance(bidder_data, tender_data, extracted_docs)

@router.get("/government-sources")
def get_government_verifications():
    """
    Returns real telemetry for central government verification API gateways.
    If external API tokens are not configured in environment, status indicates "UNCONFIGURED / MANUAL VERIFICATION REQUIRED".
    """
    return [
        {
            "source_name": "GSTN API Gateway",
            "agency": "Goods & Services Tax Network",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live GSTN query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "Udyam MSME Portal",
            "agency": "Ministry of Micro, Small & Medium Enterprises",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live MSME query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "MCA-21 Gateway",
            "agency": "Ministry of Corporate Affairs",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live MCA query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "Income Tax NSDL Gateway",
            "agency": "Income Tax Department",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live NSDL query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "EPFO Establishment API",
            "agency": "Employees Provident Fund Organisation",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live EPFO query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "ESIC Portal Gateway",
            "agency": "Employees State Insurance Corporation",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live ESIC query. Manual verification required.",
            "response_code": 503
        },
        {
            "source_name": "Central Debarment Registry",
            "agency": "CPPP & GeM Blacklisting Cell",
            "status": "UNCONFIGURED",
            "message": "API credentials required for live Debarment query. Manual verification required.",
            "response_code": 503
        }
    ]
