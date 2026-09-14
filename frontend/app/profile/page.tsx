"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { User, ShieldCheck, Mail, Phone, Building } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Header />
        
        <main className="relative pt-14 flex-1 w-full bg-surface px-space-xl py-space-lg space-y-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Officer Profile & Security Credentials</h1>
              <p className="text-xs text-secondary">Statutory designation, nodal node registration, and digital signature bindings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="md:col-span-1 bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center mx-auto">
                AR
              </div>
              <div>
                <h2 className="font-bold text-lg text-on-surface">Dr. Anita Roy, IAS</h2>
                <p className="text-xs text-secondary">Chief Nodal Officer</p>
                <span className="inline-block px-3 py-0.5 rounded bg-primary-container/20 text-primary font-bold text-[10px] mt-2 uppercase">
                  PROCUREMENT_OFFICER
                </span>
              </div>
            </div>

            <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-space-lg border border-outline-variant/30 space-y-4">
              <h2 className="font-bold text-sm text-on-surface border-b border-outline-variant/30 pb-3">Official Details</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-secondary block mb-1">Official Email</label>
                  <div className="font-medium text-on-surface">anita.roy@gov.in</div>
                </div>
                <div>
                  <label className="text-secondary block mb-1">Department</label>
                  <div className="font-medium text-on-surface">Ministry of Electronics & IT (MeitY)</div>
                </div>
                <div>
                  <label className="text-secondary block mb-1">Nodal Station Code</label>
                  <div className="font-mono font-bold text-primary">NIC-DELHI-04</div>
                </div>
                <div>
                  <label className="text-secondary block mb-1">Contact Phone</label>
                  <div className="font-mono text-on-surface">+91-11-24368102</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
