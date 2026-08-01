import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type CurrencyFormatOptions = Intl.NumberFormatOptions & {
  locale?: string;
};

export function formatCurrency(
  amount: number,
  {
    locale = "en-IN",
    currency = "INR",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    ...options
  }: CurrencyFormatOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...options,
  }).format(amount);
}

export type CurrencyDisplayProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  amount: number;
  currency?: string;
  locale?: string;
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function CurrencyDisplay({
  amount,
  currency = "INR",
  locale = "en-IN",
  compact = false,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className,
  ...props
}: CurrencyDisplayProps) {
  const value = formatCurrency(amount, {
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? "compact" : "standard",
    compactDisplay: "short",
  });

  return (
    <span className={cn("tabular-nums", className)} {...props}>
      {value}
    </span>
  );
}
