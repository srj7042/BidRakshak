"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Building2, ShieldCheck, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const { completeOnboarding, isLoading } = useAuth();
  const [orgName, setOrgName] = useState("Ministry of Electronics & Information Technology");
  const [nodalCode, setNodalCode] = useState("NIC-DELHI-04");
  const [department, setDepartment] = useState("Digital Infrastructure & Procurement Division");

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({ orgName, department, nodalCode });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-bold text-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Organization Profile Setup</h1>
          <p className="text-xs text-secondary">Configure nodal procurement parameters for GeM integration</p>
        </div>

        <form onSubmit={handleFinish} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Organization / Ministry Name</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Department / Cell Name</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Nodal Node Code / GeM Org ID</label>
            <input
              type="text"
              required
              value={nodalCode}
              onChange={(e) => setNodalCode(e.target.value)}
              className="w-full px-4 py-2 bg-surface text-on-surface font-mono text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface leading-relaxed">
              Your nodal profile will be verified and bound to GeM API endpoints for automated statutory verification.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{isLoading ? "Saving Setup..." : "Complete Setup & Enter Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
