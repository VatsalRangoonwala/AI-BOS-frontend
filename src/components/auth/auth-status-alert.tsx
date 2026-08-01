import { AlertCircle, CheckCircle2, Info, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const styles = {
  error: "border-danger/25 bg-danger-soft text-danger",
  warning: "border-warning/25 bg-warning-soft text-warning",
  success: "border-success/25 bg-success-soft text-success",
  info: "border-info/25 bg-info-soft text-info",
} as const;

const icons = {
  error: AlertCircle,
  warning: LockKeyhole,
  success: CheckCircle2,
  info: Info,
} as const;

export function AuthStatusAlert({
  variant,
  title,
  children,
  className,
}: {
  variant: keyof typeof styles;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const StatusIcon = icons[variant];

  return (
    <div className={cn("rounded-xl border p-3.5", styles[variant], className)} role={variant === "error" ? "alert" : "status"} aria-live="polite">
      <div className="flex items-start gap-3">
        <StatusIcon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {children ? <div className="mt-1 text-xs leading-5 text-muted-foreground">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

