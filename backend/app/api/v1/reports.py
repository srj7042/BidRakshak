from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["Compliance Reports & Exports"])

@router.get("")
@router.get("/")
def get_reports():
    return [
        {
            "id": "rep-001",
            "report_name": "Executive_Bid_Compliance_Summary_GEM_98214.pdf",
            "report_type": "BID_COMPLIANCE",
            "generated_by": "Dr. Anita Roy, IAS",
            "file_size": "2.4 MB",
            "generated_at": datetime.now().isoformat()
        },
        {
            "id": "rep-002",
            "report_name": "Quarterly_Bidder_Risk_Audit_Q3_FY25.csv",
            "report_type": "BIDDER_RISK",
            "generated_by": "Dr. Anita Roy, IAS",
            "file_size": "1.1 MB",
            "generated_at": datetime.now().isoformat()
        }
    ]

@router.post("/generate")
def generate_report(payload: Dict[str, Any]):
    report_type = payload.get("report_type", "BID_COMPLIANCE")
    return {
        "id": "rep-new",
        "report_name": f"Generated_{report_type}_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
        "report_type": report_type,
        "status": "READY",
        "download_url": "/api/v1/reports/download/sample.pdf",
        "generated_at": datetime.now().isoformat()
    }
