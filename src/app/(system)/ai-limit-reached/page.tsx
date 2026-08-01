import { Gauge, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemState } from "@/components/system";
import { Progress, buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "AI usage limit reached" };

export default function AILimitReachedPage() {
  return (
    <SystemState
      icon={Sparkles}
      eyebrow="Monthly AI allowance"
      title="You’ve used this month’s AI actions"
      description="Core business tools still work normally. AI summaries and suggested actions will resume when the allowance resets or the plan is upgraded."
      tone="primary"
      details={<div className="space-y-4"><div className="flex items-start gap-3"><Gauge className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="text-sm font-semibold">200 of 200 AI actions used</p><p className="mt-1 text-xs text-muted-foreground">Allowance resets on 1 September 2026.</p></div></div><Progress value={200} max={200} label="AI action usage" showValue valueLabel="200 / 200" /></div>}
      actions={<><Link href="/subscription/plans" className={buttonStyles()}>Compare plans</Link><Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>Continue without AI</Link></>}
    />
  );
}
