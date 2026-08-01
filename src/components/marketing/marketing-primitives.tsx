import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MarketingPageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 size-72 rounded-full bg-primary-soft opacity-80 blur-3xl"
      />
      <MarketingContainer className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="primary" className="mb-5">
            {eyebrow}
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            {description}
          </p>
          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className={buttonStyles({ size: "lg", className: "rounded-xl" })}
                >
                  {primaryAction.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link
                  href={secondaryAction.href}
                  className={buttonStyles({
                    variant: "outline",
                    size: "lg",
                    className: "rounded-xl",
                  })}
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        {children}
      </MarketingContainer>
    </section>
  );
}

export function MarketingCTA({
  title = "Run your business with fewer loose ends.",
  description = "Start with the essentials today. Your data, team and workflows can grow with you.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <MarketingContainer>
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-10 text-background sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
          <div aria-hidden="true" className="absolute -right-10 -top-16 size-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold text-background/70">Start free. Set up in minutes.</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-7 text-background/70">
              {description}
            </p>
          </div>
          <div className="relative mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <Link
              href="/register"
              className={buttonStyles({
                size: "lg",
                className: "rounded-xl bg-card text-foreground hover:bg-card/90",
              })}
            >
              Create free account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <span className="flex items-center justify-center gap-2 text-xs text-background/65">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              No card required
            </span>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}

