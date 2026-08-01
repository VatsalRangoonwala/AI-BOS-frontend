"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "The essentials for a new or solo business.",
    monthlyPrice: 0,
    yearlyMonthlyPrice: 0,
    yearlyTotal: 0,
    features: [
      "25 invoices each month",
      "20 AI actions each month",
      "Basic business dashboard",
      "One user",
      "Customer and product records",
    ],
    action: "Start free",
    recommended: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For active shops that need better control and follow-up.",
    monthlyPrice: 999,
    yearlyMonthlyPrice: 799,
    yearlyTotal: 9_588,
    features: [
      "Unlimited invoices",
      "200 AI actions each month",
      "AI-generated reports",
      "Advanced inventory",
      "Payment reminders",
      "Standard analytics",
    ],
    action: "Choose Pro",
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For growing teams that want automation and deeper insight.",
    monthlyPrice: 1_999,
    yearlyMonthlyPrice: 1_599,
    yearlyTotal: 19_188,
    features: [
      "Everything in Pro",
      "Higher AI usage",
      "WhatsApp integration",
      "Advanced analytics",
      "Team management",
      "Priority support",
    ],
    action: "Choose Premium",
    recommended: false,
  },
] as const;

export function PricingPlans() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <div>
      <div className="mx-auto flex w-fit items-center rounded-xl border border-border bg-muted p-1" role="group" aria-label="Billing frequency">
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          aria-pressed={billing === "monthly"}
          className={cn(
            "min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors motion-reduce:transition-none",
            billing === "monthly"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling("yearly")}
          aria-pressed={billing === "yearly"}
          className={cn(
            "min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors motion-reduce:transition-none",
            billing === "yearly"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Yearly
          <span className="ml-2 text-xs text-success">Save 20%</span>
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
        {billing === "yearly"
          ? "Yearly plans are billed once per year. Prices below show the effective monthly cost."
          : "Monthly plans can be changed or cancelled at the end of any billing month."}
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const monthlyPrice =
            billing === "yearly" ? plan.yearlyMonthlyPrice : plan.monthlyPrice;

          return (
            <article
              className={cn(
                "relative flex rounded-2xl border bg-card p-6 shadow-card sm:p-7",
                plan.recommended
                  ? "border-primary ring-1 ring-primary"
                  : "border-border",
              )}
              key={plan.id}
            >
              <div className="flex w-full flex-col">
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-tight">{plan.name}</h2>
                  {plan.recommended ? (
                    <Badge variant="primary">
                      <Sparkles className="size-3" aria-hidden="true" />
                      Most popular
                    </Badge>
                  ) : plan.id === "free" ? (
                    <Badge variant="outline">Demo current plan</Badge>
                  ) : null}
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-[-0.05em] tabular-nums">
                    {formatINR(monthlyPrice)}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">/ month</span>
                </div>
                <p className="mt-2 min-h-5 text-xs text-muted-foreground">
                  {billing === "yearly" && plan.yearlyTotal > 0
                    ? `${formatINR(plan.yearlyTotal)} billed yearly`
                    : plan.monthlyPrice > 0
                      ? "Billed monthly"
                      : "Free forever for basic use"}
                </p>
                <Link
                  href={`/register?plan=${plan.id}&billing=${billing}`}
                  className={buttonStyles({
                    variant: plan.recommended ? "primary" : "outline",
                    size: "lg",
                    block: true,
                    className: "mt-6 rounded-xl",
                  })}
                >
                  {plan.action}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <ul className="mt-7 space-y-3 border-t border-border pt-6">
                  {plan.features.map((feature) => (
                    <li className="flex items-start gap-3 text-sm leading-5" key={feature}>
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
