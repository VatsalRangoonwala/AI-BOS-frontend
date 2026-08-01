import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonStyles, type ButtonVariant } from "@/components/ui";

type PageAction = {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: PageAction[];
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}
        <h1 className="text-balance text-2xl font-bold tracking-[-0.035em] sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {children}
        {actions?.map((action) => {
          const ActionIcon = action.icon;
          return <Link key={action.href + action.label} href={action.href} className={buttonStyles({ variant: action.variant ?? "primary" })}>{ActionIcon ? <ActionIcon className="size-4" aria-hidden="true" /> : null}{action.label}</Link>;
        })}
      </div>
    </header>
  );
}
