import { Sparkles } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export function AIInsightCard({ title = "AI business insight", children, actions, className }: { title?: string; children: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return <Card className={cn("border-primary/20 bg-primary-soft/35 p-5 sm:p-6", className)}><div className="flex flex-col gap-4 sm:flex-row"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold">{title}</h2><Badge variant="primary">AI</Badge></div><div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>{actions ? <div className="mt-4">{actions}</div> : null}</div></div></Card>;
}
