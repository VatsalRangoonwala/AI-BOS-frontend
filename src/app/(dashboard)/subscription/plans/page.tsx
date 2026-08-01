import type { Metadata } from "next";

import { Breadcrumbs, PageHeader } from "@/components/shared";
import { PlanSelector } from "@/components/subscription";

export const metadata: Metadata = { title: "Subscription plans" };

export default function SubscriptionPlansPage() {
  return <div className="app-page-enter space-y-7"><div><Breadcrumbs items={[{ label: "Subscription", href: "/subscription" }, { label: "Plans" }]} /><PageHeader eyebrow="Simple pricing" title="Choose the right plan" description="Upgrade or change plans as your business grows. Your mock data remains available on every plan." /></div><PlanSelector currentPlan="Pro" /></div>;
}
