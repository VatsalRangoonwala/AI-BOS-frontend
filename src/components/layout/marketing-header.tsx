"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { useTheme } from "@/components/providers/theme-provider";
import { marketingNavigation } from "@/lib/navigation";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {marketingNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
          </button>
          <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold hover:bg-muted">
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            Start free
          </Link>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-border bg-card lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-marketing-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div id="mobile-marketing-menu" className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobile navigation">
            {marketingNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold">
                Log in
              </Link>
              <Link href="/register" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                Start free
              </Link>
            </div>
            <button type="button" onClick={toggleTheme} className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted">
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
