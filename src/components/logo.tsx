import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  className?: string;
};

export function Logo({ compact = false, href = "/", className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-xl", className)}
      aria-label="AI-BOS home"
    >
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm">
        <span className="absolute -right-1 -top-1 size-4 rounded-full bg-secondary" aria-hidden="true" />
        <svg viewBox="0 0 24 24" className="relative size-5" fill="none" aria-hidden="true">
          <path d="M7 16.5 12 5l5 11.5M8.7 13h6.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-[1.05rem] font-bold tracking-[-0.035em]">AI-BOS</span>
          <span className="mt-1 block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Business OS
          </span>
        </span>
      ) : null}
    </Link>
  );
}
