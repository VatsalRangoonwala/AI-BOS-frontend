"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileNavigationDrawer } from "@/components/layout/mobile-navigation-drawer";
import { QuickCreateSheet } from "@/components/layout/quick-create-sheet";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const isAssistantPage = pathname === "/ai-assistant" || pathname.startsWith("/ai-assistant/");

  return (
    <div
      className={`min-h-screen bg-background transition-[grid-template-columns] duration-200 lg:grid ${
        sidebarCollapsed
          ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]"
          : "lg:grid-cols-[17.5rem_minmax(0,1fr)]"
      }`}
    >
      <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />

      <div className="min-w-0">
        <AppHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main id="main-content" tabIndex={-1} className="min-w-0 px-4 pb-32 pt-5 sm:px-5 lg:px-7 lg:pb-10 lg:pt-7 2xl:px-9">
          <div className="mx-auto w-full max-w-[100rem]">{children}</div>
        </main>
      </div>

      {!isAssistantPage ? (
        <Link
          href="/ai-assistant"
          className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-30 flex min-h-11 items-center gap-2 rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 lg:hidden"
          aria-label="Ask AI Assistant"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          <span>Ask AI</span>
        </Link>
      ) : null}

      <MobileBottomNav
        createOpen={quickCreateOpen}
        moreOpen={mobileMenuOpen}
        onOpenCreate={() => setQuickCreateOpen(true)}
        onOpenMore={() => setMobileMenuOpen(true)}
      />
      <MobileNavigationDrawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      <QuickCreateSheet open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />
    </div>
  );
}
