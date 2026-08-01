"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Building2, ChevronRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";

type MobileNavigationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const bottomNavRoutes = new Set(["/dashboard", "/customers", "/ai-assistant"]);

export function MobileNavigationDrawer({ open, onOpenChange }: MobileNavigationDrawerProps) {
  const pathname = usePathname();
  const drawerItems = primaryNavigation.filter((item) => !bottomNavRoutes.has(item.href));

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px] lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-[60] flex w-[min(22rem,88vw)] flex-col border-r border-border bg-card p-4 shadow-2xl focus:outline-none lg:hidden">
          <div className="flex min-h-12 items-center justify-between">
            <Logo href="/dashboard" />
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                aria-label="Close navigation menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Application menu</Dialog.Title>
          <Dialog.Description className="sr-only">Open business tools and account pages.</Dialog.Description>

          <Link
            href="/settings/business"
            onClick={() => onOpenChange(false)}
            className="mt-5 flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-surface-muted p-2.5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-soft text-secondary">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Sharma Mobile & Electronics</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Business workspace</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </Link>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <p className="mb-2 px-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Business tools</p>
            <nav className="space-y-1" aria-label="Business tools">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Dialog.Close asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                        active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs">{item.badge}</span> : null}
                    </Link>
                  </Dialog.Close>
                );
              })}
            </nav>

            <div className="my-4 h-px bg-border" />
            <nav className="space-y-1" aria-label="Help and settings">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Dialog.Close asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                        active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </Dialog.Close>
                );
              })}
            </nav>
          </div>

          <Dialog.Close asChild>
            <Link
              href="/subscription/plans"
              className="mt-4 flex min-h-12 items-center gap-3 rounded-2xl bg-primary-soft px-3.5 text-sm font-semibold text-primary"
            >
              <Sparkles className="size-5" aria-hidden="true" />
              Upgrade to Premium
              <ChevronRight className="ml-auto size-4" aria-hidden="true" />
            </Link>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
