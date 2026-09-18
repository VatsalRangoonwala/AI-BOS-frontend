import type { Metadata } from "next";
import { CloudCheck } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { Logo } from "@/components/logo";
import { AuthGuard } from "@/components/providers/auth-guard";

export const metadata: Metadata = {
  title: "Business setup",
  robots: { index: false, follow: false },
};

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  await connection();

  return (
    <AuthGuard><div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-semibold text-muted-foreground sm:block">Business setup</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <CloudCheck className="size-4 text-success" aria-hidden="true" />
              Progress saved in this demo
            </span>
            <Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" href="/login">
              Exit setup
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8" id="main-content">
        {children}
      </main>
    </div></AuthGuard>
  );
}
