"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl">
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-secondary">
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>/</span>
          <span className="text-on-surface font-medium">GeM Compliance Nodal Portal</span>
        </div>
        <div className="hidden md:flex items-center gap-space-sm px-space-sm py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>GeM Portal Telemetry: Synced (2m ago)</span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="relative hidden sm:flex items-center">
          <span className="material-symbols-outlined absolute left-space-sm text-secondary text-[18px]">
            search
          </span>
          <input
            className="w-80 pl-8 pr-12 py-space-xs bg-surface text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
            placeholder="Search Tender ID, Bidder, PAN, GSTIN..."
            type="text"
          />
          <div className="absolute right-space-sm px-space-xs py-space-xxs rounded bg-surface-container-high text-secondary font-mono text-[10px]">
            Ctrl+K
          </div>
        </div>

        <Link
          href="/ai-verification"
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span className="font-semibold">New Audit Workspace</span>
        </Link>

        <ThemeToggle />

        <Link
          href="/notifications"
          className="relative p-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error"></span>
        </Link>
      </div>
    </header>
  );
}
