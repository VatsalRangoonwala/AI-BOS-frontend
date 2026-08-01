"use client";

import { ArrowRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function InsightList({ insights }: { insights: string[] }) {
  const [visible, setVisible] = useState(insights.map((_, index) => index));
  return (
    <Card className="border-primary/20 bg-primary-soft/35">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div><CardTitle>AI-generated insights</CardTitle><p className="mt-1 text-sm text-muted-foreground">Practical next steps from your connected business data</p></div></div>
        <Badge variant="primary">Updated today</Badge>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {visible.map((index) => (
          <article key={index} className="relative rounded-xl border border-border bg-card p-4 pr-11">
            <p className="text-sm leading-6">{insights[index]}</p>
            <button type="button" onClick={() => setVisible((items) => items.filter((item) => item !== index))} className="absolute right-2 top-2 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Dismiss insight"><X className="size-3.5" /></button>
          </article>
        ))}
        {!visible.length ? <div className="col-span-full py-6 text-center text-sm text-muted-foreground">You’re all caught up. New insights will appear as your data changes.</div> : null}
        <Link href="/ai-assistant" className="col-span-full inline-flex min-h-10 items-center justify-center gap-1 text-sm font-semibold text-primary">Ask AI about these insights <ArrowRight className="size-4" /></Link>
      </CardContent>
    </Card>
  );
}
