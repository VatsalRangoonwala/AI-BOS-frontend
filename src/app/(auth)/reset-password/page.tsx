import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Choose new password" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Secure your account"
      title="Choose a new password"
      description="Use a password you do not use for another service."
      footer={<Link className="font-semibold text-primary hover:underline" href="/login">Cancel and return to sign in</Link>}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}

