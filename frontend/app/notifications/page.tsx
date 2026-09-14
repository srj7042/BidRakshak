"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { fetchApi } from "@/lib/api";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>("/notifications")
      .then((data) => setNotifications(data || []))
      .catch(() => setNotifications([]));
  }, []);

  const handleDelete = async (notification: any) => {
    try {
      await fetchApi(`/notifications/${notification.id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (err: any) {
      alert(`Error deleting notification: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />

        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">System Notifications Inbox</h1>
              <p className="text-xs text-secondary">Real-time alerts and officer pending tasks</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
            {notifications.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-surface rounded-xl border border-outline-variant/30">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                <h3 className="font-bold text-sm text-on-surface">No New Notifications</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  You are all caught up. New statutory alerts and officer adjudication requests will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-surface border border-outline-variant/40 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-error-container text-error flex-shrink-0 mt-0.5">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-on-surface">{n.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-secondary font-mono">{n.created_at}</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(n)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-error hover:bg-error-container transition-colors"
                            title="Delete notification"
                            aria-label={`Delete notification ${n.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-secondary mt-1">{n.message}</p>
                    </div>
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
