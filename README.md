# BidRakshak: AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement

BidRakshak is an enterprise SaaS platform engineered for government procurement officers, nodal auditors, and bid evaluation committees operating on or interfacing with **Government e-Marketplace (GeM)**.

It combines real-time statutory API queries (Udyam, GSTN, MCA-21, PAN/NSDL, EPFO, ESIC, Central Debarment Registry), OCR document cross-validation, and explainable compliance scoring with a mandatory **Human-in-the-Loop Procurement Officer Decision Center**.

---

## Technical Stack & Architecture

- **Frontend**: Next.js 14 (App Router, TypeScript), Tailwind CSS (ProcureVerify design system tokens), Lucide React & Material Symbols Outlined icons, Recharts for analytics, `next-themes` (Light/Dark mode switcher).
- **Backend**: Python FastAPI, Pydantic v2 validation schemas, 16-point statutory compliance checking engine, AI/OCR extraction service, SHA-256 digital signature hash generator.
- **Database & Storage**: Supabase Cloud PostgreSQL with Row Level Security (RLS) policies and storage bucket `bid-documents`.
- **Knowledge Base**: Synchronized `brain/` AI knowledge base with `brain.md` master index.

---

## Key Features

1. **16-Point Statutory & Technical Verification Engine**:
   - Udyam / MSME verification & EMD exemption check
   - GSTIN registration status & 6-period GSTR-3B return filing track
   - PAN & NSDL legal entity linkage
   - Income Tax ITR return audit for AY 2023-24 & 2024-25
   - MCA-21 CIN active status & director validation
   - DPIIT Startup India certificate check
   - NSIC Single Point Registration validation
   - EPFO monthly ECR contribution track
   - ESIC 17-digit code & contribution audit
   - OEM Authorization Certificate (MAEF) digital signature verification
   - Make in India Class-I/II Local Content threshold check (Min 50%)
   - DigiLocker tamper-evident certificate verification via NeGD API
   - Bureau of Indian Standards (BIS) IS license check
   - Central Debarment & Blacklisting Registry query (CPPP/GeM)
   - Custom tender qualification clause evaluation (e.g. audited average annual turnover)

2. **AI & OCR Cross-Validation Workspace**:
   - Drag-and-drop PDF upload with field extraction.
   - 4-way visual comparison: Bidder Documents ↔ Extracted Fields ↔ Government Data ↔ Tender Requirements.
   - Highlighting matches, mismatches, missing fields, and critical anomalies.

3. **Human-in-the-Loop Procurement Officer Decision Center**:
   - AI recommendation (`QUALIFY` | `DISQUALIFY` | `REQUEST_CLARIFICATION`) serves strictly as **Decision Support**.
   - Procurement Officer retains exclusive statutory authority for final qualification/disqualification decisions.
   - Cryptographic SHA-256 digital signature logging.

4. **13 Integrated Enterprise SaaS Modules**:
   - Landing Page (`/`)
   - Auth & Onboarding (`/login`, `/register`, `/verify-email`, `/onboarding`)
   - Overview & Telemetry Dashboard (`/dashboard`)
   - Tenders & Bids (`/tenders`)
   - Bidder Directory (`/bidders`)
   - Document Center (`/documents`)
   - AI Verification Center (`/ai-verification`)
   - Compliance Engine (`/compliance-engine`)
   - Government Verification Hub (`/government-verifications`)
   - Risk Analysis (`/risk-analysis`)
   - Compliance Reports Exporter (`/reports`)
   - Immutable Audit Trail (`/audit-trail`)
   - Notifications (`/notifications`)
   - Profile (`/profile`)
   - Settings (`/settings`)

---

## Directory Structure

```
BidRakshak/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # FastAPI routes (tenders, bidders, documents, compliance, risk, etc.)
│   │   ├── core/            # Settings & configuration
│   │   ├── models/          # Pydantic schemas
│   │   ├── services/        # Compliance Engine & AI OCR Services
│   │   └── main.py          # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js 14 App Router routes & pages
│   ├── components/          # Sidebar, Header, ThemeToggle, KpiCards
│   ├── lib/                 # REST API client & Supabase JS client
│   ├── globals.css          # Tailwind & ProcureVerify styles
│   └── tailwind.config.js   # Stitch color & typography tokens
├── supabase/
│   └── migrations/          # PostgreSQL initial schema migration
├── brain/                   # AI Knowledge Base
│   ├── brain.md             # Master Index
│   ├── architecture.md
│   ├── modules_routing.md
│   ├── compliance_rules.md
│   ├── apis_backend.md
│   ├── database_schema.md
│   └── security_audit.md
├── README.md
└── implementation_plan.md
```

---

## Setup & Local Development

### 1. Database Setup (Supabase / PostgreSQL)
Apply the migration schema to your Supabase PostgreSQL database:
```bash
psql -h <SUPABASE_DB_HOST> -U postgres -d postgres -f supabase/migrations/20260906000000_init_schema.sql
```

### 2. Backend (FastAPI) Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```
FastAPI interactive Swagger docs will be live at `http://localhost:8002/docs`.

### 3. Frontend (Next.js) Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:2000` in your browser.

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8002/api/v1
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SECRET_KEY=your_random_secret
```

---

## Security Considerations

1. **AI Decision Boundaries**: AI findings are strictly informational. All statutory actions require explicit Procurement Officer sign-off.
2. **Cryptographic Auditability**: Decision records generate SHA-256 hashes to guarantee non-repudiation.
3. **No Hardcoded Secrets**: Secrets and database credentials managed via environment variables.

---

## License & Attribution
Ministry of Electronics & Information Technology (MeitY) / Government e-Marketplace (GeM) Bid Compliance Protocol.
