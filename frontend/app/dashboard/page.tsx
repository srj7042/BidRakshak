"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [bidders, setBidders] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tendersRes, biddersRes, decisionsRes, auditRes] = await Promise.all([
        fetchApi<any[]>("/tenders").catch(() => []),
        fetchApi<any[]>("/bidders").catch(() => []),
        fetchApi<any[]>("/decisions").catch(() => []),
        fetchApi<any[]>("/audit").catch(() => []),
      ]);
      setTenders(tendersRes || []);
      setBidders(biddersRes || []);
      setDecisions(decisionsRes || []);
      setAuditLogs(auditRes || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalBidders = bidders.length;
  const totalDecisions = decisions.length;
  const totalAuditLogs = auditLogs.length;

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-xl">
          {/* Executive Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
                Procurement Compliance Overview
              </h1>
              <p className="font-body-md text-body-md text-secondary mt-space-xxs">
                Statutory verification telemetry and evaluation records.
              </p>
            </div>

            <div className="flex items-center gap-space-sm">
              <Link
                href="/tenders"
                className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface border border-outline-variant/60 text-on-surface hover:bg-surface-container font-label-md text-label-md transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>New Tender</span>
              </Link>
              <Link
                href="/bidders"
                className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>New Bidder</span>
              </Link>
            </div>
          </div>

          {/* Dynamic 4 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Total Bidders */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold">
                  Registered Bidders
                </span>
                <span className="p-space-xxs rounded bg-primary-container/10 text-primary">
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                </span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-3xl font-bold text-on-surface">
                    {loading ? "..." : totalBidders}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Tenders */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold">
                  Active Solicitations
                </span>
                <span className="p-space-xxs rounded bg-secondary-container/30 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                </span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-3xl font-bold text-on-surface">
                    {loading ? "..." : tenders.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Officer Decisions */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold">
                  Officer Signed Decisions
                </span>
                <span className="p-space-xxs rounded bg-tertiary-fixed text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                </span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-3xl font-bold text-on-surface">
                    {loading ? "..." : totalDecisions}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-semibold">
                  Audit Logs Recorded
                </span>
                <span className="p-space-xxs rounded bg-surface-container-high text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                </span>
              </div>
              <div className="mt-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-3xl font-bold text-on-surface">
                    {loading ? "..." : totalAuditLogs}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tenders Table or Empty State */}
          <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                  Active GeM Tenders
                </h2>
                <p className="text-xs text-secondary">Registered Solicitations</p>
              </div>
              <Link href="/tenders" className="text-xs text-primary font-semibold hover:underline">
                Manage Tenders
              </Link>
            </div>

            {tenders.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-secondary">folder_open</span>
                <h3 className="font-bold text-sm text-on-surface">No Solicitations Registered Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Create your first GeM tender solicitation to initialize automated statutory verification.
                </p>
                <Link
                  href="/tenders"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Register First Tender</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="bg-surface border-b border-outline-variant/40 font-bold uppercase text-secondary">
                    <tr>
                      <th className="py-3 px-4">Tender Ref</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {tenders.map((t) => (
                      <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4 font-mono font-bold">{t.gem_reference_no}</td>
                        <td className="py-3 px-4 font-medium">{t.title}</td>
                        <td className="py-3 px-4 text-secondary">{t.category}</td>
                        <td className="py-3 px-4 font-mono">₹{t.estimated_value.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-semibold text-[10px]">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registered Bidders Table or Empty State */}
          <div className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                  Evaluated Bidder Entities
                </h2>
                <p className="text-xs text-secondary">Bidder Profiles</p>
              </div>
              <Link href="/bidders" className="text-xs text-primary font-semibold hover:underline">
                View All Bidders
              </Link>
            </div>

            {bidders.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-secondary">corporate_fare</span>
                <h3 className="font-bold text-sm text-on-surface">No Bidders Registered Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Add a bidder entity with GSTIN, PAN, and Udyam credentials to trigger compliance auditing.
                </p>
                <Link
                  href="/bidders"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Register First Bidder</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-on-surface">
                  <thead className="bg-surface border-b border-outline-variant/40 font-bold uppercase text-secondary">
                    <tr>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Legal Status</th>
                      <th className="py-3 px-4">GSTIN</th>
                      <th className="py-3 px-4">PAN</th>
                      <th className="py-3 px-4">Udyam No</th>
                      <th className="py-3 px-4">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {bidders.map((b) => (
                      <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4 font-bold">{b.company_name}</td>
                        <td className="py-3 px-4 text-secondary">{b.legal_status}</td>
                        <td className="py-3 px-4 font-mono">{b.gstin || "N/A"}</td>
                        <td className="py-3 px-4 font-mono">{b.pan || "N/A"}</td>
                        <td className="py-3 px-4 font-mono text-secondary">{b.udyam_reg_no || "N/A"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold text-[10px]">
                            {b.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
