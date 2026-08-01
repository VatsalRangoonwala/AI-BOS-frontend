"use client";

import { Home, Menu, Plus, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileBottomNavProps = {
  createOpen: boolean;
  moreOpen: boolean;
  onOpenCreate: () => void;
  onOpenMore: () => void;
};

function activeClass(active: boolean) {
  return active ? "text-primary" : "text-muted-foreground hover:text-foreground";
}

export function MobileBottomNav({
  createOpen,
  moreOpen,
  onOpenCreate,
  onOpenMore,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const homeActive = pathname === "/dashboard";
  const customersActive = pathname === "/customers" || pathname.startsWith("/customers/");
  const assistantActive = pathname === "/ai-assistant" || pathname.startsWith("/ai-assistant/");
  const moreActive = !homeActive && !customersActive && !assistantActive;

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/98 px-1 pt-1.5 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
    >
      <Link
        href="/dashboard"
        aria-current={homeActive ? "page" : undefined}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-medium ${activeClass(homeActive)}`}
      >
        <Home className="size-5" strokeWidth={homeActive ? 2.3 : 1.9} aria-hidden="true" />
        Home
      </Link>
      <Link
        href="/customers"
        aria-current={customersActive ? "page" : undefined}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-medium ${activeClass(customersActive)}`}
      >
        <Users className="size-5" strokeWidth={customersActive ? 2.3 : 1.9} aria-hidden="true" />
        Customers
      </Link>
      <button
        type="button"
        onClick={onOpenCreate}
        aria-haspopup="dialog"
        aria-expanded={createOpen}
        className="-mt-5 flex min-h-[4.75rem] flex-col items-center justify-start gap-1 text-[0.68rem] font-semibold text-foreground"
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95">
          <Plus className="size-6" aria-hidden="true" />
        </span>
        Create
      </button>
      <Link
        href="/ai-assistant"
        aria-current={assistantActive ? "page" : undefined}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-medium ${activeClass(assistantActive)}`}
      >
        <Sparkles className="size-5" strokeWidth={assistantActive ? 2.3 : 1.9} aria-hidden="true" />
        AI Assistant
      </Link>
      <button
        type="button"
        onClick={onOpenMore}
        aria-haspopup="dialog"
        aria-expanded={moreOpen}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-medium ${activeClass(moreActive)}`}
      >
        <Menu className="size-5" strokeWidth={moreActive ? 2.3 : 1.9} aria-hidden="true" />
        More
      </button>
    </nav>
  );
}
