import { LockKeyhole } from "lucide-react";

import { Logo } from "@/components/logo";

export function StandaloneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/7 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-secondary/8 blur-3xl" aria-hidden="true" />
      <header className="relative z-10 flex min-h-16 items-center justify-between border-b border-border/80 bg-card/80 px-4 backdrop-blur sm:px-6 lg:px-8">
        <Logo href="/dashboard" />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><LockKeyhole className="size-3.5" />Secure business workspace</span>
      </header>
      <main id="main-content" className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="relative z-10 px-4 pb-6 text-center text-xs text-muted-foreground">AI-BOS · Business operations, clearly connected</footer>
    </div>
  );
}
