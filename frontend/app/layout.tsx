import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "BidRakshak | AI-Powered GeM Bid Compliance Verification",
  description: "Enterprise SaaS platform for Government e-Marketplace (GeM) bid compliance verification, OCR cross-validation, and statutory auditing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface font-sans text-body-md text-on-surface antialiased">
        <Providers>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
