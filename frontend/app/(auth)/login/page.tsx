"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("anita.roy@gov.in");
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-bold text-2xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Officer Portal Sign In</h1>
          <p className="text-xs text-secondary">Authorized Procurement & Nodal Auditors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Official Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="officer@gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? "Authenticating Session..." : "Sign In to Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-secondary space-y-2">
          <p>
            Don't have an officer account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <p>
            Need help?{" "}
            <Link href="/verify-email" className="text-primary font-semibold hover:underline">
              Verify credentials
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
