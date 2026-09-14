from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users & Profile"])

@router.get("/me")
def get_current_user():
    return {
        "id": "usr-849201",
        "email": "anita.roy@gov.in",
        "full_name": "Dr. Anita Roy, IAS",
        "designation": "Chief Nodal Officer",
        "department": "Ministry of Electronics & IT (MeitY)",
        "role": "PROCUREMENT_OFFICER",
        "organization": "Government of India",
        "nodal_code": "NIC-DELHI-04",
        "phone": "+91-11-24368102",
        "profile_completion": 100,
        "is_active": True,
        "created_at": datetime.now().isoformat()
    }
