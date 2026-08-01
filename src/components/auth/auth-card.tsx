import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-card">
      <div className="p-5 sm:p-7">
        {eyebrow ? <Badge variant="primary">{eyebrow}</Badge> : null}
        <h1 className="mt-4 text-balance text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
      {footer ? (
        <div className="border-t border-border bg-muted/35 px-5 py-4 text-center text-sm text-muted-foreground sm:px-7">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

