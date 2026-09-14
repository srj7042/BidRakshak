"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Building2, Landmark, FileCheck2, ShieldAlert } from "lucide-react";

export default function LandingPage() {
  const checkCategories = [
    {
      title: "Business & Tax",
      icon: Landmark,
      items: ["GSTIN Registration", "PAN / ITR Audit", "Udyam / MSME Status"],
    },
    {
      title: "Corporate & Statutory",
      icon: Building2,
      items: ["MCA-21 Check", "EPFO Monthly ECR", "ESIC Contribution", "NSIC Registration"],
    },
    {
      title: "Tender & Product Compliance",
      icon: FileCheck2,
      items: ["OEM Authorization (MAEF)", "Make in India (Local Content)", "BIS Standard Conformance", "GeM Custom Tender Rules"],
    },
    {
      title: "Government Verification",
      icon: ShieldAlert,
      items: ["DPIIT Startup India", "DigiLocker Verification", "Central Debarment Registry"],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-surface-container-high/40 bg-surface-container-lowest px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-lg">
            B
          </div>
          <div>
            <span className="font-headline-md font-bold text-xl text-on-surface">BidRakshak</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-primary-container/20 text-primary uppercase">
              GeM AI Compliance
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
          <a href="#checks" className="hover:text-primary transition-colors">Statutory Modules</a>
          <a href="#workflow" className="hover:text-primary transition-colors">How It Works</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
          >
            Launch Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-surface-container-lowest to-surface flex flex-col items-center text-center max-w-6xl mx-auto">
        <h1 className="font-headline-xl text-4xl md:text-6xl font-bold tracking-tight max-w-4xl text-on-surface leading-tight">
          AI-Powered Integrated Bid Compliance & Statutory Verification for GeM
        </h1>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-base flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container font-semibold text-base transition-colors"
          >
            Sign In to Portal
          </Link>
        </div>
      </section>

      {/* Categorized Statutory Compliance Grid */}
      <section id="checks" className="px-6 md:px-12 py-16 bg-surface-container-lowest border-y border-surface-container-high/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {checkCategories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-surface border border-outline-variant/40 space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/30 pb-3">
                      <IconComp className="w-5 h-5" />
                      <h3 className="font-bold text-sm text-on-surface">{cat.title}</h3>
                    </div>
                    <ul className="space-y-2 text-xs text-on-surface">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Workflow Section */}
      <section id="workflow" className="px-6 md:px-12 py-16 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-base">Bidder Submission & OCR</h3>
            <p className="text-xs text-secondary leading-relaxed">Drag-and-drop bid PDFs. Automatic field extraction & document categorization.</p>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-base">Registry Verification</h3>
            <p className="text-xs text-secondary leading-relaxed">Integrated registry verification across GSTN, MCA-21, Udyam, and other statutory sources.</p>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-base">Explainable AI Findings</h3>
            <p className="text-xs text-secondary leading-relaxed">Cross-document inconsistency scoring with cited page numbers and evidence lines.</p>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">4</div>
            <h3 className="font-bold text-base">Officer Adjudication</h3>
            <p className="text-xs text-secondary leading-relaxed">Procurement Officer signs qualification order with tamper-evident audit logging.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-container-high/40 bg-surface-container-lowest py-8 px-6 md:px-12 text-center text-xs text-secondary">
        <p>© 2026 BidRakshak Platform • Ministry of Electronics & Information Technology (MeitY) • GeM Procurement Cell</p>
      </footer>
    </div>
  );
}
