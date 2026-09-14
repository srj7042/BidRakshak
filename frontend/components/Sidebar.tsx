"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { fetchApi } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeType?: "ai" | "alert";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetchApi<any[]>("/notifications")
      .then((data) => {
        if (Array.isArray(data)) {
          const unread = data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => setUnreadCount(0));
  }, []);

  const navigationSections: NavSection[] = [
    {
      title: "Main",
      items: [
        { label: "Overview / Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "Bids & Tenders", href: "/tenders", icon: "gavel" },
        { label: "Bidder Directory", href: "/bidders", icon: "corporate_fare" },
      ],
    },
    {
      title: "Verification Suite",
      items: [
        { label: "Documents", href: "/documents", icon: "folder_open" },
        { label: "AI Verification", href: "/ai-verification", icon: "neurology", badge: "AI Active", badgeType: "ai" },
        { label: "Compliance Engine", href: "/compliance-engine", icon: "verified" },
        { label: "Risk Analysis", href: "/risk-analysis", icon: "warning" },
      ],
    },
    {
      title: "Governance",
      items: [
        { label: "Audit Trail", href: "/audit-trail", icon: "history_edu" },
        { label: "Reports & Exports", href: "/reports", icon: "summarize" },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Notifications",
          href: "/notifications",
          icon: "notifications",
          badge: unreadCount > 0 ? String(unreadCount) : undefined,
          badgeType: "alert",
        },
        { label: "Profile", href: "/profile", icon: "person" },
        { label: "Settings", href: "/settings", icon: "settings" },
      ],
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "AR";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header Logo */}
        <div className="h-14 px-space-lg flex items-center justify-between border-b border-surface-container-high/40 bg-surface-container-lowest">
          <Link href="/dashboard" className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                BidRakshak
              </span>
              <span className="font-label-sm text-[10px] text-primary tracking-wide uppercase font-semibold">
                GeM Compliance AI
              </span>
            </div>
          </Link>
          <span className="px-space-xs py-space-xxs rounded bg-primary-container/15 text-primary font-label-sm text-[10px] font-bold">
            GeM Sync
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-space-md py-space-md space-y-space-lg">
          {navigationSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-space-xxs">
              <div className="px-space-sm py-space-xxs font-label-sm text-[11px] text-secondary uppercase tracking-wider font-semibold">
                {section.title}
              </div>
              <nav className="space-y-space-xxs">
                {section.items.map((item, iIdx) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      className={`flex items-center justify-between px-space-sm py-space-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-on-primary font-semibold shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span className="font-body-md text-body-md">{item.label}</span>
                      </div>
                      {item.badge && item.badgeType === "ai" && (
                        <span className="px-space-xs py-space-xxs rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {item.badge && item.badgeType === "alert" && (
                        <span className="h-4 w-4 flex items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-space-sm bg-surface-container-low border-t border-surface-container-high/40 space-y-2">
          <div className="flex items-center gap-space-sm p-space-xs rounded-lg bg-surface-container-lowest">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {getInitials(user?.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-label-md text-label-md text-on-surface truncate font-semibold">
                {user?.fullName || "Dr. Anita Roy, IAS"}
              </div>
              <div className="font-label-sm text-[11px] text-secondary truncate">
                {user?.designation || "Chief Nodal Officer"}
              </div>
              <div className="font-label-sm text-[10px] text-outline truncate">
                {user?.nodalCode || "NIC-DELHI-04"}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold text-error hover:bg-error-container/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
