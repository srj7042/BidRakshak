"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />
        
        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Platform Settings & Compliance Parameters</h1>
              <p className="text-xs text-secondary">Configure statutory verification rules, theme preferences, and API integrations</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-6">
            <div className="space-y-4">
              <h2 className="font-bold text-sm text-on-surface border-b border-outline-variant/30 pb-3">Theme & Visual Preferences</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-on-surface">Application Theme Switcher</div>
                  <div className="text-[11px] text-secondary">Switch between Enterprise Light Mode and High-Legibility Dark Mode</div>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-sm text-on-surface border-b border-outline-variant/30 pb-3">Compliance Rules Parameters</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-secondary mb-1">Minimum Local Content Threshold (%)</label>
                  <input type="number" defaultValue={50} className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono text-on-surface" />
                </div>
                <div>
                  <label className="block text-secondary mb-1">Mandatory Financial Turnover Exemption Threshold</label>
                  <input type="text" defaultValue="₹15,00,000" className="w-full p-2 bg-surface rounded border border-outline-variant/50 font-mono text-on-surface" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
