import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "bidrakshak_db.sqlite")

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout = 30000")
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Organizations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        state_province TEXT,
        nodal_code TEXT UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        supabase_auth_id TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        designation TEXT,
        role TEXT DEFAULT 'PROCUREMENT_OFFICER',
        organization_id TEXT,
        phone TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Bidders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bidders (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        legal_status TEXT,
        gstin TEXT UNIQUE,
        pan TEXT UNIQUE,
        cin TEXT UNIQUE,
        udyam_reg_no TEXT UNIQUE,
        epfo_code TEXT,
        esic_code TEXT,
        startup_india_id TEXT,
        address TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        compliance_score REAL DEFAULT 0.0,
        risk_level TEXT DEFAULT 'LOW',
        is_debarred INTEGER DEFAULT 0,
        debarment_reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. Tenders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tenders (
        id TEXT PRIMARY KEY,
        gem_reference_no TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        estimated_value REAL NOT NULL,
        issuing_organization_id TEXT,
        published_date TEXT DEFAULT CURRENT_TIMESTAMP,
        closing_date TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        min_turnover_required REAL DEFAULT 0.0,
        msme_exemption_allowed INTEGER DEFAULT 1,
        local_content_min_percentage REAL DEFAULT 50.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Bids
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        tender_id TEXT NOT NULL,
        bidder_id TEXT NOT NULL,
        bid_reference_no TEXT NOT NULL UNIQUE,
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        offered_price REAL NOT NULL,
        compliance_score REAL DEFAULT 0.0,
        risk_level TEXT DEFAULT 'PENDING',
        status TEXT DEFAULT 'SUBMITTED',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 6. Documents
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        bid_id TEXT,
        bidder_id TEXT,
        document_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size_bytes INTEGER,
        mime_type TEXT,
        ocr_processed INTEGER DEFAULT 0,
        uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 7. Document Extractions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_extractions (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        extracted_json TEXT NOT NULL,
        confidence_score REAL DEFAULT 0.0,
        extracted_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 8. Compliance Checks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS compliance_checks (
        id TEXT PRIMARY KEY,
        bid_id TEXT NOT NULL,
        check_type TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        evidence TEXT,
        source_agency TEXT,
        explanation TEXT,
        verified_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 9. Government Verifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS government_verifications (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        source_name TEXT NOT NULL,
        status TEXT NOT NULL,
        retrieved_data TEXT,
        verification_timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        api_response_code INTEGER DEFAULT 200
    );
    """)

    # 10. Risk Assessments & AI Findings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id TEXT PRIMARY KEY,
        bid_id TEXT NOT NULL,
        overall_risk_score REAL NOT NULL,
        risk_level TEXT NOT NULL,
        risk_factors TEXT NOT NULL,
        suspicious_patterns TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_findings (
        id TEXT PRIMARY KEY,
        bid_id TEXT NOT NULL,
        finding_type TEXT NOT NULL,
        severity TEXT DEFAULT 'MEDIUM',
        confidence_score REAL NOT NULL,
        evidence TEXT NOT NULL,
        explanation TEXT NOT NULL,
        suggested_action TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 11. Officer Decisions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS officer_decisions (
        id TEXT PRIMARY KEY,
        bid_id TEXT NOT NULL,
        officer_id TEXT NOT NULL,
        officer_name TEXT,
        designation TEXT,
        decision TEXT NOT NULL,
        remarks TEXT NOT NULL,
        digital_signature_hash TEXT,
        decided_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 12. Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_name TEXT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        tender_ref TEXT,
        bidder_name TEXT,
        previous_state TEXT,
        new_state TEXT,
        ip_address TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 13. Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'INFO',
        is_read INTEGER DEFAULT 0,
        link_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 14. Reports
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        report_name TEXT NOT NULL,
        report_type TEXT NOT NULL,
        generated_by TEXT,
        file_path TEXT,
        parameters TEXT,
        generated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.executescript("""
    CREATE INDEX IF NOT EXISTS idx_tenders_status_category_created
    ON tenders(status, category, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_bidders_risk_created
    ON bidders(risk_level, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_documents_bidder_uploaded
    ON documents(bidder_id, uploaded_at DESC);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp
    ON audit_logs(timestamp DESC);
    """)

    conn.commit()
    conn.close()

# Initialize DB structure on import
init_db()
