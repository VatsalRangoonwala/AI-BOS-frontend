"use client";

import { BellRing, Check, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Button, buttonStyles } from "@/components/ui";

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
