-- BidRakshak PostgreSQL Schema
-- Migration: 20260906000000_init_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    state_province VARCHAR(100),
    nodal_code VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Profile (maps to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_auth_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    role VARCHAR(50) DEFAULT 'PROCUREMENT_OFFICER', -- PROCUREMENT_OFFICER, AUDITOR, ADMIN
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bidders
CREATE TABLE IF NOT EXISTS bidders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    legal_status VARCHAR(100), -- Private Limited, Partnership, Proprietorship, LLP, Public Limited
    gstin VARCHAR(15) UNIQUE,
    pan VARCHAR(10) UNIQUE,
    cin VARCHAR(21) UNIQUE,
    udyam_reg_no VARCHAR(20) UNIQUE,
    epfo_code VARCHAR(20),
    esic_code VARCHAR(20),
    startup_india_id VARCHAR(50),
    nsic_reg_no VARCHAR(50),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    compliance_score NUMERIC(5,2) DEFAULT 0.00,
    risk_level VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    is_debarred BOOLEAN DEFAULT FALSE,
    debarment_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tenders
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gem_reference_no VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    estimated_value NUMERIC(15,2) NOT NULL,
    issuing_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    published_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, UNDER_EVALUATION, AWARDED, CANCELLED
    min_turnover_required NUMERIC(15,2) DEFAULT 0.00,
    msme_exemption_allowed BOOLEAN DEFAULT TRUE,
    local_content_min_percentage NUMERIC(5,2) DEFAULT 50.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bids
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES bidders(id) ON DELETE CASCADE,
    bid_reference_no VARCHAR(100) NOT NULL UNIQUE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    offered_price NUMERIC(15,2) NOT NULL,
    compliance_score NUMERIC(5,2) DEFAULT 0.00,
    risk_level VARCHAR(20) DEFAULT 'PENDING', -- LOW, MEDIUM, HIGH, CRITICAL, PENDING
    status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_AI_REVIEW, MANUALLY_FLAGGED, QUALIFIED, DISQUALIFIED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tender_bidder UNIQUE (tender_id, bidder_id)
);

-- 6. Documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    bidder_id UUID REFERENCES bidders(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- GST_CERTIFICATE, UDYAM_CERTIFICATE, BALANCE_SHEET, PAN_CARD, OEM_AUTH, MAKE_IN_INDIA_DECLARATION, ITR_RETURN
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    ocr_processed BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Document Extractions (OCR / Dynamic Extraction Data)
CREATE TABLE IF NOT EXISTS document_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    extracted_json JSONB NOT NULL,
    confidence_score NUMERIC(5,2) DEFAULT 0.00,
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Compliance Checks (16 statutory/technical checks)
CREATE TABLE IF NOT EXISTS compliance_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    check_type VARCHAR(100) NOT NULL, -- UDYAM, GST_REGISTRATION, GST_RETURNS, PAN, INCOME_TAX, MCA, STARTUP_INDIA, NSIC, EPFO, ESIC, OEM_AUTH, LOCAL_CONTENT, DIGILOCKER, BIS_DPIIT, BLACKLISTING, TENDER_RULES
    status VARCHAR(50) DEFAULT 'PENDING', -- VERIFIED, FAILED, PENDING, NOT_APPLICABLE, MANUAL_REVIEW
    evidence TEXT,
    source_agency VARCHAR(100),
    explanation TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Government Verifications Hub
CREATE TABLE IF NOT EXISTS government_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bidder_id UUID NOT NULL REFERENCES bidders(id) ON DELETE CASCADE,
    source_name VARCHAR(100) NOT NULL, -- GSTN_API, UDYAM_PORTAL, MCA_21, INCOME_TAX_NSDL, EPFO_PORTAL, ESIC_PORTAL, DEBARMENT_REGISTRY
    status VARCHAR(50) NOT NULL, -- ACTIVE, SUCCESS, FAILED, TIMED_OUT
    retrieved_data JSONB,
    verification_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    api_response_code INTEGER DEFAULT 200
);

-- 10. Risk Assessments & AI Findings
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    overall_risk_score NUMERIC(5,2) NOT NULL, -- 0-100 (higher = riskier)
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    risk_factors JSONB NOT NULL,
    suspicious_patterns JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    finding_type VARCHAR(100) NOT NULL, -- MISMATCH, CONTRADICTION, MISSING_DOC, EXPIRED_CERT, DEBARMENT_HIT
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    confidence_score NUMERIC(5,2) NOT NULL,
    evidence TEXT NOT NULL,
    explanation TEXT NOT NULL,
    suggested_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Recommendations & Officer Decisions
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    recommendation VARCHAR(50) NOT NULL, -- QUALIFY, DISQUALIFY, REQUEST_CLARIFICATION, MANUAL_AUDIT
    reasons JSONB NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS officer_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES users(id),
    decision VARCHAR(50) NOT NULL, -- APPROVED, REJECTED, CLARIFICATION_REQUESTED, REFERRED_TO_COMMITTEE
    remarks TEXT NOT NULL,
    digital_signature_hash VARCHAR(255),
    decided_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Logs (Immutable Timeline)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- BID, TENDER, BIDDER, DOCUMENT, DECISION
    entity_id UUID NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- INFO, WARNING, ERROR, URGENT
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- BID_COMPLIANCE, BIDDER_RISK, AUDIT_TRAIL, SUMMARY
    generated_by UUID REFERENCES users(id),
    file_path VARCHAR(500),
    parameters JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
