import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import {
  RegisterForm,
  type RegistrationBilling,
  type RegistrationPlan,
} from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

type RegisterPageProps = {
  searchParams: Promise<{ plan?: string; billing?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const plan: RegistrationPlan = ["free", "pro", "premium"].includes(params.plan ?? "")
    ? (params.plan as RegistrationPlan)
    : "free";
  const billing: RegistrationBilling = ["monthly", "yearly"].includes(params.billing ?? "")
    ? (params.billing as RegistrationBilling)
    : "monthly";

  return (
    <AuthCard
      eyebrow={plan === "free" ? "Start free" : `${plan} plan selected`}
      title="Create your AI-BOS account"
      description="Add the basics now. We will guide you through business setup after verification."
      footer={<>Already have an account? <Link className="font-semibold text-primary hover:underline" href="/login">Sign in</Link></>}
    >
      <RegisterForm plan={plan} billing={billing} />
    </AuthCard>
  );
}
