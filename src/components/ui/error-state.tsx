import type { HTMLAttributes, ReactNode } from "react";
import { AlertTriangle, type LucideIcon } from "lucide-react";

import { Icon } from "@/components/icon";
import { cn } from "@/components/ui/utils";

export type ErrorStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
};

export function ErrorState({
  icon = AlertTriangle,
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  action,
  compact = false,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-danger-soft text-center",
        compact ? "p-5" : "min-h-64 p-8 sm:p-10",
        className,
      )}
      role="alert"
      {...props}
    >
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-card text-destructive shadow-sm">
        <Icon icon={icon} size="lg" />
      </span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description ? (
        <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
