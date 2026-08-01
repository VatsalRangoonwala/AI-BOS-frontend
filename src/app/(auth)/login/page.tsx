import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to your business workspace"
      description="Continue with your registered email and password."
      footer={<>New to AI-BOS? <Link className="font-semibold text-primary hover:underline" href="/register">Create a free account</Link></>}
    >
      <LoginForm />
    </AuthCard>
  );
}

