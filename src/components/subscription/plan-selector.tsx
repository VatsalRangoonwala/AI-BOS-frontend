"use client";

import { Check, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge, buttonStyles, Card } from "@/components/ui";
import { cn, formatINR } from "@/lib/utils";

const plans = [
  { name: "Free", monthly: 0, yearly: 0, description: "Get the basics in place", features: ["25 invoices / month", "20 AI actions", "Basic dashboard", "Single user"], tone: "neutral", popular: false },
  { name: "Pro", monthly: 999, yearly: 799, description: "Run a growing business", features: ["Unlimited invoices", "200 AI actions", "Advanced inventory", "Payment reminders", "Standard analytics"], tone: "primary", popular: true },
  { name: "Premium", monthly: 1999, yearly: 1599, description: "Coordinate your whole team", features: ["Everything in Pro", "WhatsApp integration", "Advanced analytics", "Team management", "Priority support", "Higher AI usage"], tone: "secondary", popular: false },
] as const;

export function PlanSelector({ currentPlan = "Pro", compact = false }: { currentPlan?: string; compact?: boolean }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  return (
    <div>
      <div className="mb-6 flex justify-center"><div className="inline-flex rounded-xl border border-border bg-muted p-1"><button type="button" onClick={() => setBilling("monthly")} className={cn("min-h-10 rounded-lg px-4 text-sm font-semibold", billing === "monthly" ? "bg-card shadow-sm" : "text-muted-foreground")}>Monthly</button><button type="button" onClick={() => setBilling("yearly")} className={cn("min-h-10 rounded-lg px-4 text-sm font-semibold", billing === "yearly" ? "bg-card shadow-sm" : "text-muted-foreground")}>Yearly <span className="ml-1 text-success">Save 20%</span></button></div></div>
      <div className={cn("grid gap-4", compact ? "lg:grid-cols-3" : "md:grid-cols-3")}>
        {plans.map((plan) => {
          const price = billing === "yearly" ? plan.yearly : plan.monthly;
          const isCurrent = plan.name === currentPlan;
          return (
            <Card key={plan.name} className={cn("relative flex flex-col p-5 sm:p-6", plan.popular && "border-primary shadow-lg shadow-primary/8")}>
              {plan.popular ? <Badge variant="primary" className="absolute -top-3 left-5"><Sparkles className="size-3" />Most popular</Badge> : null}
              <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{plan.name}</h3>{plan.name === "Premium" ? <Crown className="size-5 text-warning" /> : null}</div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5"><span className="text-3xl font-bold tracking-[-0.04em]">{formatINR(price)}</span>{price ? <span className="text-sm text-muted-foreground"> / month</span> : null}<p className="mt-1 min-h-5 text-xs text-muted-foreground">{billing === "yearly" && price ? `${formatINR(price * 12)} billed yearly` : " "}</p></div>
              <ul className="my-6 flex-1 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3" /></span>{feature}</li>)}</ul>
              {isCurrent ? <span className="flex min-h-11 items-center justify-center rounded-md border border-border bg-muted text-sm font-semibold text-muted-foreground">Current plan</span> : <Link href={`/subscription/checkout?plan=${plan.name.toLowerCase()}&billing=${billing}`} className={buttonStyles({ variant: plan.name === "Premium" ? "secondary" : "primary", block: true })}>{plan.name === "Free" ? "Downgrade" : `Choose ${plan.name}`}</Link>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
