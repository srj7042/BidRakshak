"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { Server, AlertCircle } from "lucide-react";

export default function GovernmentVerificationsPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const defaultGateways = [
    { source_name: "GSTN API Gateway", agency: "Goods & Services Tax Network", response_code: 503, message: "API credentials required for live GSTN query. Manual verification required." },
    { source_name: "Udyam MSME Portal", agency: "Ministry of Micro, Small & Medium Enterprises", response_code: 503, message: "API credentials required for live MSME query. Manual verification required." },
    { source_name: "MCA-21 Gateway", agency: "Ministry of Corporate Affairs", response_code: 503, message: "API credentials required for live MCA query. Manual verification required." },
    { source_name: "Income Tax NSDL Gateway", agency: "Income Tax Department", response_code: 503, message: "API credentials required for live NSDL query. Manual verification required." },
    { source_name: "EPFO Establishment API", agency: "Employees Provident Fund Organisation", response_code: 503, message: "API credentials required for live EPFO query. Manual verification required." },
    { source_name: "ESIC Portal Gateway", agency: "Employees State Insurance Corporation", response_code: 503, message: "API credentials required for live ESIC query. Manual verification required." },
    { source_name: "Central Debarment Registry", agency: "CPPP & GeM Blacklisting Cell", response_code: 503, message: "API credentials required for live Debarment query. Manual verification required." }
  ];

  useEffect(() => {
    fetchApi<any[]>("/compliance/government-sources")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSources(data);
        } else {
          setSources(defaultGateways);
        }
      })
      .catch(() => setSources(defaultGateways))
      .finally(() => setLoading(false));
  }, []);

  const displaySources = sources.length > 0 ? sources : defaultGateways;

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Government Registries Integration Hub</h1>
              <p className="text-xs text-secondary">Operational status across central government API gateways</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {displaySources.map((s, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded bg-yellow-500/10 text-yellow-600">
                    <Server className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-700 font-bold text-[10px] uppercase">
                    HTTP {s.response_code || 503} UNCONFIGURED
                  </span>
                </div>
                <h3 className="font-bold text-sm text-on-surface">{s.source_name}</h3>
                <p className="text-xs text-secondary font-medium">{s.agency}</p>
                <div className="p-3 rounded bg-surface border border-outline-variant/40 text-xs text-secondary leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-yellow-600 inline mr-1" />
                  {s.message || "Manual verification required."}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
