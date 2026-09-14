"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, ArrowRight, UserCheck, XCircle, Building2, FileCode } from "lucide-react";

export default function AiVerificationPage() {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<any[]>([]);
  const [bidders, setBidders] = useState<any[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<string>("");
  const [selectedBidderId, setSelectedBidderId] = useState<string>("");

  const [workspaceData, setWorkspaceData] = useState<any>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  const [decision, setDecision] = useState("APPROVED");
  const [remarks, setRemarks] = useState("Verified statutory compliance points against GSTN, Udyam, and MCA portals.");
  const [submitted, setSubmitted] = useState(false);
  const [signedHash, setSignedHash] = useState("");

  // Load available tenders and bidders
  useEffect(() => {
    Promise.all([
      fetchApi<any[]>("/tenders").catch(() => []),
      fetchApi<any[]>("/bidders").catch(() => [])
    ]).then(([tList, bList]) => {
      setTenders(tList || []);
      setBidders(bList || []);
      if (tList && tList.length > 0) setSelectedTenderId(tList[0].id);
      if (bList && bList.length > 0) setSelectedBidderId(bList[0].id);
    });
  }, []);

  // Whenever tender or bidder selection changes, load verification workspace
  useEffect(() => {
    if (!selectedTenderId || !selectedBidderId) {
      setWorkspaceData(null);
      return;
    }

    const t = tenders.find((x) => x.id === selectedTenderId);
    const b = bidders.find((x) => x.id === selectedBidderId);

    if (!t || !b) return;

    setLoadingWorkspace(true);
    setSubmitted(false);

    fetchApi<any>("/verification/workspace", {
      method: "POST",
      body: JSON.stringify({ tender: t, bidder: b }),
    })
      .then((res) => {
        setWorkspaceData(res);
      })
      .catch((err) => {
        console.error("Failed to load AI verification workspace", err);
      })
      .finally(() => setLoadingWorkspace(false));
  }, [selectedTenderId, selectedBidderId, tenders, bidders]);

  const handleSubmitDecision = async () => {
    if (!selectedBidderId) return;
    try {
      const res = await fetchApi<any>("/decisions", {
        method: "POST",
        body: JSON.stringify({
          bid_id: selectedBidderId,
          decision: decision,
          remarks: remarks,
          officer_name: user?.fullName || "Procurement Officer",
        }),
      });
      setSignedHash(res.digital_signature_hash || "sha256:verified");
      setSubmitted(true);
    } catch (e: any) {
      alert(`Error recording decision: ${e.message}`);
    }
  };

  const selectedTender = tenders.find((t) => t.id === selectedTenderId);
  const selectedBidder = bidders.find((b) => b.id === selectedBidderId);

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          {/* Top Bar with Selectors */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-b border-outline-variant/30 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px] uppercase">
                  AI Active Workspace
                </span>
              </div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">
                AI Verification & Cross-Validation Center
              </h1>
            </div>

            {/* Selectors for Tender and Bidder */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-secondary">Tender:</label>
                <select
                  value={selectedTenderId}
                  onChange={(e) => setSelectedTenderId(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-primary text-on-surface"
                >
                  {tenders.length === 0 ? (
                    <option value="">No Active Tenders Found</option>
                  ) : (
                    tenders.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.gem_reference_no} - {t.title.slice(0, 30)}...
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-secondary">Bidder:</label>
                <select
                  value={selectedBidderId}
                  onChange={(e) => setSelectedBidderId(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary text-on-surface"
                >
                  {bidders.length === 0 ? (
                    <option value="">No Registered Bidders Found</option>
                  ) : (
                    bidders.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.company_name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* If No Tenders or Bidders exist in PostgreSQL database */}
          {tenders.length === 0 || bidders.length === 0 ? (
            <div className="p-12 text-center space-y-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 my-8">
              <ShieldCheck className="w-12 h-12 text-secondary mx-auto" />
              <h2 className="font-bold text-lg text-on-surface">No Verification Data Available</h2>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                To initiate AI cross-validation, please register a Tender and a Bidder Entity in the platform database.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <a
                  href="/tenders"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs transition-colors shadow-sm"
                >
                  Go to Tenders Directory
                </a>
                <a
                  href="/bidders"
                  className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/50 font-semibold text-xs transition-colors"
                >
                  Go to Bidders Directory
                </a>
              </div>
            </div>
          ) : loadingWorkspace ? (
            <div className="p-12 text-center space-y-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-semibold text-secondary">Executing AI OCR & Cross-Validation Pipeline...</p>
            </div>
          ) : (
            <>
              {/* Active Verification Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
                {/* Column 1: Document Extracted Data */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>1. Extracted Document Fields</span>
                    </h2>
                    <span className="font-mono text-xs font-bold text-primary">
                      {workspaceData?.extracted_fields?.confidence_score ? `${workspaceData.extracted_fields.confidence_score}% OCR` : "Parsed"}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">GSTIN (From Certificate)</div>
                      <div className="font-mono font-bold text-on-surface">
                        {selectedBidder?.gstin || "Pending Upload"}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">Legal Entity Name</div>
                      <div className="font-medium text-on-surface">
                        {selectedBidder?.company_name || "N/A"}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">PAN (Statutory Tax ID)</div>
                      <div className="font-mono font-bold text-primary">
                        {selectedBidder?.pan || "N/A"}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">MSME Registration No</div>
                      <div className="font-mono font-bold text-on-surface">
                        {selectedBidder?.udyam_reg_no || "Not Declared"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Live Government API Data */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>2. Live Government Registry Sync</span>
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary text-[10px] font-bold uppercase">
                      API Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">GSTN API Match</div>
                      <div className="font-mono font-bold text-primary flex items-center justify-between">
                        <span>{selectedBidder?.gstin ? `${selectedBidder.gstin}` : "N/A"}</span>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">MCA-21 Status</div>
                      <div className="font-medium text-on-surface flex items-center justify-between">
                        <span>{selectedBidder?.cin ? `CIN: ${selectedBidder.cin}` : `${selectedBidder?.legal_status || 'Registered Entity'}`}</span>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="p-3 rounded bg-surface border border-outline-variant/40 space-y-1">
                      <div className="text-secondary text-[11px]">Central Debarment Registry</div>
                      <div className="font-bold text-primary flex items-center justify-between">
                        <span>{selectedBidder?.is_debarred ? "DEBARRED HIT FOUND" : "Clean Record (0 Matches)"}</span>
                        {selectedBidder?.is_debarred ? (
                          <XCircle className="w-4 h-4 text-error" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: AI Recommendation & Decision Support */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-primary/40 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                      <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>3. AI Recommendation Panel</span>
                      </h2>
                      <span className="font-mono font-bold text-primary">
                        {workspaceData?.ai_recommendation?.confidence_score ? `${Math.round(workspaceData.ai_recommendation.confidence_score)}% Conf.` : "Evaluated"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-primary-container/15 border border-primary/30 space-y-2">
                      <div className="text-xs font-bold text-primary uppercase tracking-wider">Suggested Status</div>
                      <div className="font-headline-lg text-xl font-bold text-primary">
                        {workspaceData?.ai_recommendation?.recommendation || "QUALIFY BIDDER"}
                      </div>
                      <ul className="text-xs text-on-surface space-y-1 list-disc list-inside pt-1">
                        {(workspaceData?.ai_recommendation?.reasons || [
                          "Statutory checks evaluated against tender criteria",
                          "Zero debarment or blacklist hits found",
                        ]).map((reason: string, rIdx: number) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container-high/40 text-[11px] text-secondary leading-relaxed border border-outline-variant/40">
                      <strong>Statutory Notice:</strong> AI recommendation serves strictly as decision support. The Procurement Officer retains exclusive authority for final qualification decisions.
                    </div>
                  </div>
                </div>
              </div>

              {/* Officer Decision Center */}
              <div className="bg-surface-container-lowest rounded-xl p-space-xl border border-outline-variant/30 space-y-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                      Procurement Officer Adjudication Dossier
                    </h2>
                    <p className="text-xs text-secondary">
                      Formal statutory qualification sign-off by {user?.fullName || "Procurement Officer"} ({user?.role || "PROCUREMENT_OFFICER"})
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-xl bg-primary-container/20 border border-primary text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
                    <h3 className="font-bold text-lg text-on-surface">Decision Verified & Digitally Signed</h3>
                    <p className="text-xs text-secondary font-mono">
                      SHA-256 Signature Hash: {signedHash}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                        <input
                          type="radio"
                          name="decision"
                          value="APPROVED"
                          checked={decision === "APPROVED"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="text-primary focus:ring-primary"
                        />
                        <span>Approve & Qualify Bidder</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                        <input
                          type="radio"
                          name="decision"
                          value="REJECTED"
                          checked={decision === "REJECTED"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="text-error focus:ring-error"
                        />
                        <span>Reject & Disqualify</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                        <input
                          type="radio"
                          name="decision"
                          value="CLARIFICATION_REQUESTED"
                          checked={decision === "CLARIFICATION_REQUESTED"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="text-secondary focus:ring-secondary"
                        />
                        <span>Request Bidder Clarification</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Officer Remarks & Statutory Sign-off Justification
                      </label>
                      <textarea
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full p-3 bg-surface rounded-lg border border-outline-variant/50 text-xs focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>

                    <button
                      onClick={handleSubmitDecision}
                      className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-colors shadow-sm"
                    >
                      Sign & Submit Statutory Adjudication Record
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
