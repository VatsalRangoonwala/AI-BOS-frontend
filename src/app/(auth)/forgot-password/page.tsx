import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your account email and we will prepare a secure reset link."
      footer={<Link className="font-semibold text-primary hover:underline" href="/login">Back to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

