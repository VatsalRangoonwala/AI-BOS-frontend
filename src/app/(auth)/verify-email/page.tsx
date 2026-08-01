import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <AuthCard
      eyebrow="Account security"
      title="Verify your email"
      description="Confirm that we have the right address before setting up your business."
      footer={<>Already verified? <Link className="font-semibold text-primary hover:underline" href="/login">Return to sign in</Link></>}
    >
      <VerifyEmailCard />
    </AuthCard>
  );
}

