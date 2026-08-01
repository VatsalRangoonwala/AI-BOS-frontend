"use client";

import { Activity, Bell, Building2, CreditCard, LayoutDashboard, Menu, ServerCog, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const adminNavigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Platform users", href: "/admin/users", icon: Users },
  { label: "Businesses", href: "/admin/businesses", icon: Building2 },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "System health", href: "/admin/system", icon: ServerCog },
];

function AdminNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <nav className="space-y-1 p-3" aria-label="Admin navigation">{adminNavigation.map((item) => { const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><item.icon className="size-4.5" />{item.label}</Link>; })}</nav>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card lg:flex lg:flex-col"><div className="flex h-18 items-center border-b border-border px-5"><Logo href="/admin" /></div><div className="px-5 pb-2 pt-5"><div className="flex items-center gap-2 rounded-xl bg-danger-soft px-3 py-2 text-xs font-semibold text-danger"><ShieldCheck className="size-4" />Platform administration</div></div><AdminNavigation pathname={pathname} /><div className="mt-auto border-t border-border p-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-bold text-background">AK</span><div><p className="text-sm font-semibold">Ananya Kapoor</p><p className="text-[0.68rem] text-muted-foreground">Platform admin</p></div></div></div></aside>
      <div className="min-w-0"><header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-3 backdrop-blur sm:px-5"><button type="button" onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-xl hover:bg-muted lg:hidden" aria-label="Open admin navigation"><Menu className="size-5" /></button><div className="min-w-0 flex-1"><p className="text-sm font-semibold">AI-BOS Admin</p><p className="text-[0.68rem] text-muted-foreground">Platform operations</p></div><Link href="/admin/system" className="hidden min-h-10 items-center gap-2 rounded-xl bg-success-soft px-3 text-xs font-semibold text-success sm:flex"><Activity className="size-4" />All systems operational</Link><button type="button" className="relative grid size-11 place-items-center rounded-xl text-muted-foreground hover:bg-muted" aria-label="Admin alerts"><Bell className="size-5" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" /></button><span className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-bold text-background">AK</span></header><main id="main-content" className="mx-auto max-w-[100rem] p-4 pb-10 sm:p-6 lg:p-8">{children}</main></div>
      <Sheet open={open} onOpenChange={setOpen}><SheetContent side="left" className="p-0"><SheetHeader className="border-b border-border p-4"><SheetTitle><Logo href="/admin" /></SheetTitle><SheetDescription className="sr-only">Admin navigation</SheetDescription></SheetHeader><AdminNavigation pathname={pathname} onNavigate={() => setOpen(false)} /></SheetContent></Sheet>
    </div>
  );
}
