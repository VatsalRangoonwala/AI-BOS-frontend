import type { LucideIcon } from "lucide-react";

import { Badge, Card, CardContent } from "@/components/ui";

type SystemTone = "primary" | "warning" | "danger" | "info";

const toneStyles: Record<SystemTone, { icon: string; glow: string; badge: "primary" | "warning" | "danger" | "info" }> = {
  primary: { icon: "bg-primary-soft text-primary", glow: "bg-primary/10", badge: "primary" },
  warning: { icon: "bg-warning-soft text-warning", glow: "bg-warning/10", badge: "warning" },
  danger: { icon: "bg-danger-soft text-destructive", glow: "bg-destructive/10", badge: "danger" },
  info: { icon: "bg-info-soft text-info", glow: "bg-info/10", badge: "info" },
};

export function SystemState({
  icon: Icon,
  eyebrow,
  title,
  description,
  tone = "primary",
  details,
  actions,
  reference,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  tone?: SystemTone;
  details?: React.ReactNode;
  actions: React.ReactNode;
  reference?: string;
}) {
  const styles = toneStyles[tone];
  return (
    <Card className="relative w-full max-w-2xl overflow-hidden shadow-xl">
      <div className={`pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${styles.glow}`} aria-hidden="true" />
      <CardContent className="relative p-6 text-center sm:p-9 lg:p-10">
        <span className={`mx-auto grid size-14 place-items-center rounded-2xl ${styles.icon}`}><Icon className="size-7" aria-hidden="true" /></span>
        <Badge variant={styles.badge} className="mt-5">{eyebrow}</Badge>
        <h1 className="mx-auto mt-4 max-w-xl text-balance text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        {details ? <div className="mx-auto mt-6 max-w-xl rounded-xl border border-border bg-muted/45 p-4 text-left">{details}</div> : null}
        <div className="mt-7 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">{actions}</div>
        {reference ? <p className="mt-5 text-xs text-muted-foreground">Reference: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{reference}</code></p> : null}
      </CardContent>
    </Card>
  );
}
