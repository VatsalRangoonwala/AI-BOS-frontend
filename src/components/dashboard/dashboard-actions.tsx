"use client";

import { BellRing, CalendarDays, Check, Download, FilePlus2, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/components/providers/toast-provider";
import { PageHeader } from "@/components/shared";
import { Button, buttonStyles } from "@/components/ui";

export function DashboardHeader() {
  const user = useAuthStore((s) => s.user);
  const activeBusiness = useAuthStore((s) => s.activeBusiness);
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const businessName = activeBusiness?.businessName || "your workspace";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <PageHeader
      eyebrow={dateStr}
      title={`${greeting}, ${firstName}`}
      description={`Here’s what is happening at ${businessName} today.`}
      actions={[
        { label: "Export report", href: "/analytics", icon: Download, variant: "outline" },
        { label: "Create invoice", href: "/invoices/new", icon: FilePlus2 },
      ]}
    >
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border-strong bg-card px-3 text-sm font-semibold text-foreground hover:bg-muted"
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        Last 30 days
      </button>
    </PageHeader>
  );
}

export function AIInsightActions() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="flex min-h-16 items-center gap-3 rounded-xl border border-dashed border-border px-4 text-sm text-muted-foreground">
        <Check className="size-4 text-success" /> Insight dismissed for today.
        <button type="button" onClick={() => setDismissed(false)} className="ml-auto font-semibold text-primary hover:underline">Undo</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/analytics/inventory" className={buttonStyles({ variant: "primary", size: "sm" })}>View analysis</Link>
      <Link href="/ai-assistant" className={buttonStyles({ variant: "outline", size: "sm" })}><Sparkles className="size-4" />Ask AI</Link>
      <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}><X className="size-4" />Dismiss</Button>
    </div>
  );
}

export function ReminderButton({ customer, amount }: { customer: string; amount: string }) {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toast({ title: "Reminder queued", description: `A WhatsApp reminder for ${amount} will be sent to ${customer}.`, variant: "success" })}
    >
      <BellRing className="size-4" />
      Remind
    </Button>
  );
}
