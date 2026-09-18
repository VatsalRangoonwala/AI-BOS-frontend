"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Logo } from "@/components/logo";
import { GlobalSearch as ConnectedGlobalSearch } from "@/components/layout/global-search";
import { navigationCounts } from "@/lib/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

type AppHeaderProps = {
  onOpenMobileMenu: () => void;
};

const dropdownContentClass =
  "z-[70] min-w-64 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-slate-950/10";
const dropdownItemClass =
  "flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-xl px-3 text-sm outline-none transition-colors data-[highlighted]:bg-surface-muted data-[highlighted]:text-foreground";

export function BusinessSwitcher() {
  const memberships = useAuthStore((s) => s.memberships);
  const activeBusiness = useAuthStore((s) => s.activeBusiness);
  const switchBusiness = useAuthStore((s) => s.switchBusiness);
  const currentName =
    activeBusiness?.businessName ||
    (memberships.length > 0 ? memberships[0].businessName : "Workspace");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="hidden min-h-11 min-w-0 max-w-52 items-center gap-2 rounded-xl border border-border bg-card px-2.5 text-left transition-colors hover:bg-surface-muted lg:flex"
          aria-label={`Switch business, currently ${currentName}`}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary-soft text-secondary">
            <Building2 className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-foreground">{currentName}</span>
            <span className="block truncate text-[0.68rem] text-muted-foreground">Business workspace</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className={dropdownContentClass}>
          <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Your businesses
          </DropdownMenu.Label>
          {memberships.length > 0 ? (
            memberships.map((m) => (
              <DropdownMenu.Item
                className={dropdownItemClass}
                onSelect={() => switchBusiness(m.businessId)}
                key={m.businessId}
              >
                <span className="grid size-8 place-items-center rounded-lg bg-secondary-soft text-xs font-bold text-secondary">
                  {m.businessName
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="flex-1 font-medium">{m.businessName}</span>
                {activeBusiness?.businessId === m.businessId ? <Check className="size-4 text-primary" aria-label="Selected" /> : null}
              </DropdownMenu.Item>
            ))
          ) : (
            <DropdownMenu.Item className={dropdownItemClass} disabled>
              <span className="flex-1 font-medium text-muted-foreground">{currentName}</span>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild className={dropdownItemClass}>
            <Link href="/settings/business">
              <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
              Manage business settings
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function NotificationMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="relative grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
          aria-label={`Open notifications, ${navigationCounts.unreadNotifications} unread`}
        >
          <Bell className="size-5" aria-hidden="true" />
          {navigationCounts.unreadNotifications > 0 ? (
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger ring-2 ring-card" aria-hidden="true" />
          ) : null}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className={`${dropdownContentClass} w-[min(23rem,calc(100vw-1rem))]`}>
          <div className="flex items-center justify-between px-3 py-2">
            <DropdownMenu.Label className="text-sm font-semibold">Notifications</DropdownMenu.Label>
            <span className="rounded-full bg-primary-soft px-2 py-1 text-[0.68rem] font-semibold text-primary">
              {navigationCounts.unreadNotifications} unread
            </span>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild className={`${dropdownItemClass} items-start py-2.5`}>
            <Link href="/inventory/low-stock">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
              <span>
                <span className="block font-medium">Low-stock items need attention</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {navigationCounts.lowStockAlerts} products are at or below their reorder level.
                </span>
              </span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={`${dropdownItemClass} items-start py-2.5`}>
            <Link href="/payments/outstanding">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-danger" aria-hidden="true" />
              <span>
                <span className="block font-medium">Payment follow-up is due</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">Invoice SME-1038 is overdue for Amit Patel.</span>
              </span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild className={dropdownItemClass}>
            <Link href="/notifications" className="justify-center font-semibold text-primary">
              View all notifications
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const activeBusiness = useAuthStore((s) => s.activeBusiness);
  const logout = useAuthStore((s) => s.logout);
  const displayName = user?.fullName || "Account";
  const displayEmail = user?.email || "";
  const displayRole =
    activeBusiness?.role === "owner"
      ? "Owner"
      : activeBusiness?.role === "admin"
        ? "Admin"
        : activeBusiness?.role === "staff"
          ? "Staff"
          : "Member";
  const initials =
    displayName
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-xl px-1.5 text-left transition-colors hover:bg-surface-muted"
          aria-label={`Open profile menu for ${displayName}`}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </span>
          <span className="hidden min-w-0 2xl:block">
            <span className="block truncate text-xs font-semibold">{displayName}</span>
            <span className="block text-[0.68rem] text-muted-foreground">{displayRole}</span>
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground 2xl:block" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className={dropdownContentClass}>
          <DropdownMenu.Label className="px-3 py-2">
            <span className="block text-sm font-semibold">{displayName}</span>
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{displayEmail}</span>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild className={dropdownItemClass}>
            <Link href="/settings/profile">
              <UserRound className="size-4" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={dropdownItemClass}>
            <Link href="/subscription">
              <CreditCard className="size-4" aria-hidden="true" />
              Plan and billing
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={dropdownItemClass}>
            <Link href="/help">
              <CircleHelp className="size-4" aria-hidden="true" />
              Help centre
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={() => logout()}
            className={`${dropdownItemClass} text-danger data-[highlighted]:bg-danger-soft data-[highlighted]:text-danger`}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur-md sm:px-4 lg:px-5">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <Logo href="/dashboard" compact className="lg:hidden" />

      <ConnectedGlobalSearch inputRef={searchRef} />

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
        <BusinessSwitcher />
        <Link
          href="/subscription"
          className="hidden min-h-11 items-center gap-1.5 rounded-xl bg-secondary-soft px-2.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground lg:inline-flex"
          aria-label="Current plan: Pro"
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Pro
        </Link>
        <Link
          href="/ai-assistant"
          className="hidden min-h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft sm:inline-flex"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          <span className="hidden 2xl:inline">Ask AI</span>
          <span className="sr-only 2xl:hidden">Open AI Assistant</span>
        </Link>
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  );
}
