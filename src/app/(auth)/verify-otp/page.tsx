import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { OtpVerificationForm } from "@/components/auth/otp-verification-form";

export const metadata: Metadata = { title: "Verify OTP" };

export default function VerifyOtpPage() {
  return (
    <AuthCard
      eyebrow="Mobile verification"
      title="Enter the code we sent"
      description="This extra check helps protect account setup and future sensitive actions."
      footer={<>Wrong mobile number? <Link className="font-semibold text-primary hover:underline" href="/register">Update registration details</Link></>}
    >
      <OtpVerificationForm />
    </AuthCard>
  );
}

