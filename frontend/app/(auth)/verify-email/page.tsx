"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Mail, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyOtp, isLoading } = useAuth();
  const [code, setCode] = useState("849-201");

  const handleVerify = async () => {
    const success = await verifyOtp(code);
    if (success) {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/40 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">Verify Government Email</h1>
          <p className="text-sm text-secondary leading-relaxed">
            We have dispatched a security verification code to your official NIC / Gov email address.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-outline-variant/50 flex items-center justify-center gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center font-mono font-bold text-xl tracking-widest text-primary bg-transparent focus:outline-none"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isLoading ? "Verifying Code..." : "Confirm & Complete Profile Setup"}</span>
        </button>

        <div className="text-xs text-secondary">
          Didn't receive email?{" "}
          <button onClick={() => alert("Security OTP resent to email.")} className="text-primary font-semibold hover:underline">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
