import type { Metadata } from "next";
import Link from "next/link";

import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: {
    default: "Account access",
    template: "%s | AI-BOS",
  },
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(25rem,0.9fr)_minmax(32rem,1.1fr)]">
      <AuthSidePanel />
      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="flex h-18 items-center justify-between border-b border-border px-4 sm:px-6 lg:border-b-0 lg:px-10">
          <Logo />
          <Link className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" href="/">
            Back to website
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12" id="main-content">
          <div className="w-full max-w-xl">{children}</div>
        </main>
        <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AI-BOS</span>
          <Link className="hover:text-foreground hover:underline" href="/privacy">Privacy</Link>
          <Link className="hover:text-foreground hover:underline" href="/terms">Terms</Link>
          <Link className="hover:text-foreground hover:underline" href="/contact">Help</Link>
        </footer>
      </div>
    </div>
  );
}

