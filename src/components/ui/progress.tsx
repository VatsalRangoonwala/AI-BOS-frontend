import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  valueLabel?: string;
  indicatorClassName?: string;
};

export function Progress({
  value,
  max = 100,
  label = "Progress",
  showValue = false,
  valueLabel,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = value === undefined ? undefined : Math.min(Math.max(value, 0), safeMax);
  const percentage = safeValue === undefined ? 45 : (safeValue / safeMax) * 100;
  const displayValue = valueLabel ?? `${Math.round(percentage)}%`;

  return (
    <div className="grid gap-2">
      {showValue ? (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-foreground">{label}</span>
          <span className="tabular-nums text-muted-foreground">{displayValue}</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        aria-valuetext={valueLabel}
        className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
        role="progressbar"
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none",
            safeValue === undefined && "animate-pulse motion-reduce:animate-none",
            indicatorClassName,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
