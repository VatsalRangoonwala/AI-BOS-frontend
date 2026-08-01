"use client";

import { Bell, Boxes, CheckCheck, CircleDollarSign, Clock3, ExternalLink, Lightbulb, PackageCheck, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Badge, Button, EmptyState } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import type { Notification } from "@/types";

const filters = ["All", "Unread", "Inventory", "Payments", "Orders", "System"];

const iconByType = {
  low_stock_alert: Boxes,
  payment_received: CircleDollarSign,
  payment_overdue: Clock3,
  invoice_viewed: ExternalLink,
  order_updated: ShoppingBag,
  subscription_alert: Bell,
  team_activity: PackageCheck,
  ai_recommendation: Lightbulb,
} as const;

const toneByCategory = {
  inventory: "bg-warning-soft text-warning",
  payments: "bg-success-soft text-success",
  orders: "bg-info-soft text-info",
  system: "bg-primary-soft text-primary",
} as const;

export function NotificationCenter({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [items, setItems] = useState(initialNotifications.map((item) => ({ ...item })));
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();
  const visible = useMemo(() => items.filter((item) => filter === "All" || (filter === "Unread" ? !item.isRead : item.category === filter.toLowerCase())), [filter, items]);
  const unreadCount = items.filter((item) => !item.isRead).length;

  const markAll = () => { setItems((current) => current.map((item) => ({ ...item, isRead: true }))); toast({ title: "All caught up", description: "Every notification is now marked as read.", variant: "success" }); };
  const toggleRead = (id: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: !item.isRead } : item));
  const remove = (id: string) => { setItems((current) => current.filter((item) => item.id !== id)); toast({ title: "Notification deleted" }); };

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Notification filters">
          {filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={cn("min-h-10 shrink-0 rounded-xl px-3 text-sm font-semibold", filter === item ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{item}{item === "Unread" && unreadCount ? <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[0.62rem] text-primary-foreground">{unreadCount}</span> : null}</button>)}
        </div>
        <Button variant="outline" size="sm" onClick={markAll} disabled={!unreadCount}><CheckCheck className="size-4" />Mark all as read</Button>
      </div>
      {visible.length ? (
        <ul className="divide-y divide-border">
          {visible.map((item) => {
            const Icon = iconByType[item.type];
            return (
              <li key={item.id} className={cn("relative flex gap-3 px-4 py-4 sm:px-5", !item.isRead && "bg-primary-soft/25")}>
                {!item.isRead ? <span className="absolute left-1.5 top-6 size-1.5 rounded-full bg-primary" aria-label="Unread" /> : null}
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneByCategory[item.category])}><Icon className="size-4.5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold">{item.title}</p><time className="shrink-0 text-[0.68rem] text-muted-foreground">{formatDate(item.createdAt, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</time></div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.href ? <Link href={item.href} className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-primary-soft px-3 text-xs font-semibold text-primary">Open record <ExternalLink className="size-3.5" /></Link> : null}
                    <button type="button" onClick={() => toggleRead(item.id)} className="min-h-9 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">Mark as {item.isRead ? "unread" : "read"}</button>
                    <button type="button" onClick={() => remove(item.id)} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-danger-soft hover:text-danger" aria-label={`Delete ${item.title}`}><Trash2 className="size-3.5" /></button>
                    <Badge variant="neutral" className="ml-auto capitalize">{item.category}</Badge>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : <div className="p-4"><EmptyState icon={Bell} title="No notifications here" description={filter === "Unread" ? "You’re all caught up. New alerts will appear here." : "There are no notifications in this category yet."} action={<Button variant="outline" onClick={() => setFilter("All")}>View all notifications</Button>} /></div>}
    </div>
  );
}
