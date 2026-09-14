"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { ShieldCheck, History } from "lucide-react";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>("/audit")
      .then((data) => setLogs(data || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Immutable Activity Audit Trail</h1>
              <p className="text-xs text-secondary">Audited database log of all officer decisions and platform actions</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
            {logs.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <History className="w-8 h-8 text-secondary mx-auto" />
                <h3 className="font-bold text-sm text-on-surface">No Audit Logs Recorded Yet</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Every important action (creating tenders, bidders, or submitting officer decisions) will write an immutable record into PostgreSQL.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="font-mono text-xs font-bold text-on-surface">{log.action}</span>
                      </div>
                      <span className="font-mono text-[11px] text-secondary">{log.timestamp}</span>
                    </div>
                    <div className="text-xs text-secondary flex items-center gap-4">
                      <span>User/Actor: <strong className="text-on-surface">{log.user_name}</strong></span>
                      <span>Entity: <strong className="text-on-surface">{log.entity_type} ({log.entity_id})</strong></span>
                    </div>
                    {log.new_state && (
                      <div className="p-2 rounded bg-surface-container-high/40 text-[10px] font-mono text-secondary truncate">
                        Payload: {log.new_state}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
