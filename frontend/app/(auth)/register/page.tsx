"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    designation: "",
    department: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-bold text-2xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Register Officer Profile</h1>
          <p className="text-xs text-secondary">GeM Procurement Nodal Officer Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-secondary absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="Dr. Anita Roy, IAS"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Official Government Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="anita.roy@gov.in"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                className="w-full px-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="Chief Nodal Officer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Department / Ministry</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="MeitY, Gov of India"
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface text-sm rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? "Creating Profile..." : "Proceed to Email Verification"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-secondary">
          Already registered?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
