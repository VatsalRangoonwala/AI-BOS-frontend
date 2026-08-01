import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type BadgeVariant =
  | "neutral"
  | "secondary"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  secondary: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  outline: "border border-border-strong bg-card text-foreground",
};

const dotVariants: Record<BadgeVariant, string> = {
  neutral: "bg-muted-foreground",
  secondary: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  outline: "bg-muted-foreground",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dot?: boolean;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", dot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotVariants[variant])} />
      ) : null}
      {children}
    </span>
  );
});
