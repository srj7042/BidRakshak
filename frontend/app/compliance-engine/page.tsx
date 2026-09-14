"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CheckCircle2, ShieldCheck, FileCheck, Layers } from "lucide-react";

export default function ComplianceEnginePage() {
  const complianceModules = [
    { title: "Udyam / MSME Verification", agency: "Ministry of MSME", description: "Validates micro, small, and medium enterprise registration and exemption eligibility." },
    { title: "GST Registration Status", agency: "GSTN Portal", description: "Verifies active 15-digit GSTIN, state code, and tax registration validity." },
    { title: "GST Return Filing Track", agency: "GSTN Portal", description: "Cross-checks 6 consecutive GSTR-3B and GSTR-1 filing records for compliance." },
    { title: "PAN & NSDL Linkage", agency: "Income Tax Department", description: "Validates 10-digit Permanent Account Number and Aadhaar/NSDL linkage." },
    { title: "Income Tax ITR Audit", agency: "ITD e-Filing Portal", description: "Audits income tax return filings for preceding two assessment years." },
    { title: "MCA-21 Company Check", agency: "Ministry of Corp Affairs", description: "Cross-references Corporate Identification Number (CIN) and Director DIN records." },
    { title: "DPIIT Startup India", agency: "DPIIT Portal", description: "Validates DPIIT recognition certificate for startup turnover/experience relaxation." },
    { title: "NSIC Registration", agency: "NSIC Portal", description: "Checks Single Point Registration Scheme (SPRS) validity and monetary limits." },
    { title: "EPFO Monthly ECR Track", agency: "EPFO Portal", description: "Audits monthly Electronic Challan cum Return (ECR) for employee provident fund." },
    { title: "ESIC Contribution Audit", agency: "ESIC Portal", description: "Verifies establishment ESIC registration and monthly contribution compliance." },
    { title: "OEM Authorization (MAEF)", agency: "OEM Registry", description: "Validates Manufacturer Authorization Form authenticity and valid tenure." },
    { title: "Make in India Content", agency: "DPIIT Procurement Cell", description: "Verifies Class-I / Class-II Local Content self-declaration percentage thresholds." },
    { title: "DigiLocker Tamper-Proof", agency: "NeGD DigiLocker", description: "Verifies digital certificates uploaded via DigiLocker URI." },
    { title: "BIS Quality Standards", agency: "Bureau of Indian Standards", description: "Validates mandatory BIS License / ISI mark compliance for technical specifications." },
    { title: "Debarment / Blacklisting", agency: "Central Debarment Registry", description: "Checks CPPP, GeM, and central ministry blacklisting/debarment database." },
    { title: "Tender Custom Rules", agency: "GeM Clause Engine", description: "Evaluates minimum turnover, past experience, and custom tender clause criteria." },
  ];

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />
        
        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">16-Point Statutory Compliance Engine</h1>
              <p className="text-xs text-secondary">Automated government verification routines and statutory evaluation modules</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-primary-container/20 text-primary text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Engine Active</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {complianceModules.map((c, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-secondary uppercase font-mono">Module {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-outline-variant/40 text-secondary font-bold text-[10px]">
                      READY
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">{c.title}</h3>
                  <p className="text-[11px] font-semibold text-primary">{c.agency}</p>
                </div>
                <div className="p-2.5 rounded bg-surface text-[11px] text-secondary border border-outline-variant/30 leading-relaxed mt-2">
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
