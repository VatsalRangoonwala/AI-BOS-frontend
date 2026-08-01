"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { NativeSelect } from "@/components/ui";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function SearchInput({ className, placeholder = "Search…", ...props }, ref) {
  return <label className="relative block min-w-0"><span className="sr-only">{placeholder}</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input ref={ref} type="search" placeholder={placeholder} className={cn("h-11 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary", className)} {...props} /></label>;
});

export function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center", className)}>{children}</div>;
}

export function MobileDataCard({ title, subtitle, status, details, action }: { title: string; subtitle?: string; status?: string; details: Array<{ label: string; value: React.ReactNode }>; action?: React.ReactNode }) {
  return <article className="rounded-xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{title}</h3>{subtitle ? <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p> : null}</div>{status ? <StatusBadge status={status} /> : null}</div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">{details.map((detail) => <div key={detail.label}><dt className="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">{detail.label}</dt><dd className="mt-1 text-sm font-semibold">{detail.value}</dd></div>)}</dl>{action ? <div className="mt-4">{action}</div> : null}</article>;
}

export function Pagination({ page, pageCount, onPageChange, className }: { page: number; pageCount: number; onPageChange: (page: number) => void; className?: string }) {
  return <nav className={cn("flex items-center justify-end gap-2", className)} aria-label="Pagination"><button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="grid size-10 place-items-center rounded-xl border border-border disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="size-4" /></button><span className="min-w-20 text-center text-xs font-medium text-muted-foreground">{page} of {pageCount}</span><button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} className="grid size-10 place-items-center rounded-xl border border-border disabled:opacity-40" aria-label="Next page"><ChevronRight className="size-4" /></button></nav>;
}

export function DateRangePicker({ defaultValue = "Last 30 days", onChange }: { defaultValue?: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(defaultValue);
  return <label className="relative block min-w-48"><span className="sr-only">Date range</span><CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><NativeSelect value={value} onChange={(event) => { setValue(event.target.value); onChange?.(event.target.value); }} className="pl-9"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This month</option><option>This year</option><option>Custom range</option></NativeSelect></label>;
}
