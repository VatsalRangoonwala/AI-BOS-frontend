"use client";

import { Bell, Building2, ChevronRight, Plug, Settings2, ShieldCheck, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { label: "Profile", href: "/settings/profile", icon: UserRound },
  { label: "Business", href: "/settings/business", icon: Building2 },
  { label: "Team", href: "/settings/team", icon: Users },
  { label: "Security", href: "/settings/security", icon: ShieldCheck },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
  { label: "Preferences", href: "/settings/preferences", icon: Settings2 },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border p-2 lg:block lg:border-b-0 lg:p-2" aria-label="Settings sections">
      {items.map((item) => {
        const active = pathname === item.href;
        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors lg:w-full", active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><item.icon className="size-4.5" /><span>{item.label}</span><ChevronRight className="ml-auto hidden size-4 lg:block" /></Link>;
      })}
    </nav>
  );
}
