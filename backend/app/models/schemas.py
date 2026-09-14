from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime
from uuid import UUID

# User & Auth
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    designation: Optional[str] = "Procurement Officer"
    role: Optional[str] = "PROCUREMENT_OFFICER"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    organization_id: Optional[UUID] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Bidder Schema
class BidderBase(BaseModel):
    company_name: str
    legal_status: Optional[str] = "Private Limited"
    gstin: Optional[str] = None
    pan: Optional[str] = None
    cin: Optional[str] = None
    udyam_reg_no: Optional[str] = None
    epfo_code: Optional[str] = None
    esic_code: Optional[str] = None
    startup_india_id: Optional[str] = None
    address: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None

class BidderCreate(BidderBase):
    pass

class BidderResponse(BidderBase):
    id: UUID
    compliance_score: float
    risk_level: str
    is_debarred: bool
    debarment_reason: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Tender Schema
class TenderBase(BaseModel):
    gem_reference_no: str
    title: str
    category: str
    estimated_value: float
    closing_date: datetime
    min_turnover_required: float = 0.0
    msme_exemption_allowed: bool = True
    local_content_min_percentage: float = 50.0

class TenderCreate(TenderBase):
    issuing_organization_id: Optional[UUID] = None

class TenderResponse(TenderBase):
    id: UUID
    status: str
    published_date: datetime
    created_at: datetime
    class Config:
        from_attributes = True

# Bid Schema
class BidCreate(BaseModel):
    tender_id: UUID
    bidder_id: UUID
    offered_price: float

class BidResponse(BaseModel):
    id: UUID
    tender_id: UUID
    bidder_id: UUID
    bid_reference_no: str
    submitted_at: datetime
    offered_price: float
    compliance_score: float
    risk_level: str
    status: str
    bidder: Optional[BidderResponse] = None
    tender: Optional[TenderResponse] = None
    class Config:
        from_attributes = True

# 16-Point Compliance Check Schema
class ComplianceCheckItem(BaseModel):
    check_type: str
    status: str # VERIFIED, FAILED, PENDING, NOT_APPLICABLE, MANUAL_REVIEW
    evidence: str
    source_agency: str
    explanation: str
    verified_at: datetime

# AI Findings & Recommendations
class AIFindingItem(BaseModel):
    id: UUID
    finding_type: str
    severity: str
    confidence_score: float
    evidence: str
    explanation: str
    suggested_action: str

class RecommendationResponse(BaseModel):
    recommendation: str # QUALIFY, DISQUALIFY, REQUEST_CLARIFICATION, MANUAL_AUDIT
    reasons: List[str]
    confidence_score: float

# Officer Decision
class OfficerDecisionCreate(BaseModel):
    bid_id: UUID
    decision: str # APPROVED, REJECTED, CLARIFICATION_REQUESTED, REFERRED_TO_COMMITTEE
    remarks: str

class OfficerDecisionResponse(BaseModel):
    id: UUID
    bid_id: UUID
    officer_id: UUID
    decision: str
    remarks: str
    digital_signature_hash: str
    decided_at: datetime

# Audit Log
class AuditLogResponse(BaseModel):
    id: UUID
    user_name: Optional[str] = "Officer Anita Roy"
    action: str
    entity_type: str
    entity_id: UUID
    previous_state: Optional[Dict[str, Any]] = None
    new_state: Optional[Dict[str, Any]] = None
    timestamp: datetime
