import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  change?: number;
  comparison?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
  sparkline?: number[];
};

const tones = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

export function StatCard({ label, value, change, comparison, icon: Icon, tone = "primary", sparkline }: StatCardProps) {
  const positive = typeof change === "number" && change > 0;
  const negative = typeof change === "number" && change < 0;
  const ChangeIcon = positive ? ArrowUpRight : negative ? ArrowDownRight : Minus;
  const points = sparkline?.map((point, index) => `${(index / Math.max(sparkline.length - 1, 1)) * 100},${30 - (point / Math.max(...sparkline)) * 24}`).join(" ");

  return (
    <Card className="min-w-0 overflow-hidden shadow-card">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 truncate text-2xl font-bold tracking-[-0.04em] tabular-nums">{value}</p>
          </div>
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-4 flex min-h-7 items-end justify-between gap-3">
          {typeof change === "number" ? (
            <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <span className={cn("inline-flex items-center font-semibold tabular-nums", positive && "text-success", negative && "text-danger")}>
                <ChangeIcon className="size-3.5" aria-hidden="true" />
                {Math.abs(change)}%
              </span>
              <span className="truncate">{comparison ?? "vs previous period"}</span>
            </p>
          ) : (
            <span />
          )}
          {points ? (
            <svg className="h-7 w-20 shrink-0" viewBox="0 0 100 32" preserveAspectRatio="none" aria-label="Recent trend">
              <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
            </svg>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
