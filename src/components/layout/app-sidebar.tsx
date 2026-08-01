"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { UpgradePlanCard } from "@/components/layout/upgrade-plan-card";
import {
  primaryNavigation,
  secondaryNavigation,
  type NavigationItem,
} from "@/lib/navigation";

type AppSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

function isItemActive(pathname: string, item: NavigationItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarLink({
  collapsed,
  item,
  pathname,
}: {
  collapsed: boolean;
  item: NavigationItem;
  pathname: string;
}) {
  const active = isItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={`group relative flex min-h-11 items-center rounded-xl text-sm font-medium transition-colors ${
        collapsed ? "justify-center px-2" : "gap-3 px-3"
      } ${
        active
          ? "bg-primary-soft text-primary"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      }`}
    >
      <Icon className="size-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      <span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
      {item.badge ? (
        <span
          className={`rounded-full bg-surface-muted px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-muted-foreground ${
            collapsed ? "absolute right-1 top-1 px-1.5" : "ml-auto"
          }`}
          aria-label={`${item.badge} items`}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppSidebar({ collapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-0 hidden h-screen min-h-0 flex-col border-r border-border bg-card px-3 py-4 lg:flex"
      aria-label="Application sidebar"
    >
      <div className={`flex min-h-12 items-center ${collapsed ? "justify-center" : "justify-between px-1"}`}>
        <Logo href="/dashboard" compact={collapsed} />
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className={`grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground ${
            collapsed ? "absolute left-[4.05rem] top-5 z-10 border border-border bg-card shadow-sm" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="size-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3">
        {!collapsed ? (
          <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
        ) : null}
        <nav className="space-y-1" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <SidebarLink collapsed={collapsed} item={item} pathname={pathname} key={item.href} />
          ))}
        </nav>
      </div>

      <div className="border-t border-border pt-3">
        <UpgradePlanCard collapsed={collapsed} />

        <nav className="space-y-1" aria-label="Support navigation">
          {secondaryNavigation.map((item) => (
            <SidebarLink collapsed={collapsed} item={item} pathname={pathname} key={item.href} />
          ))}
          <Link
            href="/support"
            aria-label={collapsed ? "Contact support" : undefined}
            title={collapsed ? "Contact support" : undefined}
            className={`flex min-h-11 items-center rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground ${
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            }`}
          >
            <CircleHelp className="size-5 shrink-0" aria-hidden="true" />
            <span className={collapsed ? "sr-only" : "truncate"}>Contact support</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
