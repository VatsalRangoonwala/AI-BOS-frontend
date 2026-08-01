import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export type EmptyStateLinkAction = {
  label: string;
  href: string;
};

function isLinkAction(
  value: ReactNode | EmptyStateLinkAction,
): value is EmptyStateLinkAction {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    "href" in value &&
    typeof value.label === "string" &&
    typeof value.href === "string"
  );
}

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode | EmptyStateLinkAction;
  secondaryAction?: ReactNode | EmptyStateLinkAction;
  compact?: boolean;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
  ...props
}: EmptyStateProps) {
  const renderAction = (
    value: ReactNode | EmptyStateLinkAction,
    variant: "primary" | "outline",
  ): ReactNode => {
    if (isLinkAction(value)) {
      return (
        <Button asChild variant={variant}>
          <Link href={value.href}>{value.label}</Link>
        </Button>
      );
    }

    return value as ReactNode;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-card text-center",
        compact ? "p-6" : "min-h-72 p-8 sm:p-10",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon icon={icon} size="lg" />
        </span>
      ) : null}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description ? (
        <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      ) : null}
      {action || secondaryAction ? (
        <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center">
          {action ? renderAction(action, "primary") : null}
          {secondaryAction ? renderAction(secondaryAction, "outline") : null}
        </div>
      ) : null}
    </div>
  );
}
