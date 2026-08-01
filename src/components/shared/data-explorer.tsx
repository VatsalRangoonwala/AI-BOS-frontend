"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, Card, EmptyState, NativeSelect, buttonStyles } from "@/components/ui";
import { StatusBadge } from "@/components/shared/status-badge";

export type DataValue = string | number;

export type DataRow = {
  id: string;
  [key: string]: DataValue;
};

export type DataColumn = {
  key: string;
  label: string;
  format?: "text" | "currency" | "date" | "number" | "status";
  priority?: "primary" | "secondary" | "detail";
  align?: "left" | "right";
};

export type FilterOption = {
  label: string;
  value: string;
  key: string;
  groupLabel?: string;
};

type DataExplorerProps = {
  rows: DataRow[];
  columns: DataColumn[];
  searchKeys: string[];
  searchPlaceholder?: string;
  filters?: FilterOption[];
  viewBasePath?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; href: string };
  pageSize?: number;
  dateFilter?: { key: string; label?: string };
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCell(value: DataValue, format: DataColumn["format"]) {
  if (format === "currency") return currencyFormatter.format(Number(value));
  if (format === "number") return new Intl.NumberFormat("en-IN").format(Number(value));
  if (format === "date") {
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.valueOf()) ? String(value) : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
  }
  return String(value);
}

export function DataExplorer({
  rows,
  columns,
  searchKeys,
  searchPlaceholder = "Search records…",
  filters = [],
  viewBasePath,
  emptyTitle = "No records yet",
  emptyDescription = "Your records will appear here once they are added.",
  emptyAction,
  pageSize = 8,
  dateFilter,
}: DataExplorerProps) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const filterGroups = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; options: FilterOption[] }>();
    filters.forEach((option) => {
      const existing = groups.get(option.key);
      if (existing) {
        existing.options.push(option);
        return;
      }
      const inferredLabel = option.label.replace(/^All\s+/i, "");
      groups.set(option.key, {
        key: option.key,
        label: option.groupLabel ?? inferredLabel,
        options: [option],
      });
    });
    return [...groups.values()];
  }, [filters]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !normalizedQuery || searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(normalizedQuery));
      const matchesFilters = filterGroups.every((group) => {
        const selectedValue = filterValues[group.key] ?? "all";
        return selectedValue === "all" || String(row[group.key] ?? "").toLowerCase() === selectedValue.toLowerCase();
      });
      const rowDate = dateFilter ? String(row[dateFilter.key] ?? "").slice(0, 10) : "";
      const matchesStart = !dateFilter || !startDate || rowDate >= startDate;
      const matchesEnd = !dateFilter || !endDate || rowDate <= endDate;
      return matchesQuery && matchesFilters && matchesStart && matchesEnd;
    });
  }, [dateFilter, endDate, filterGroups, filterValues, query, rows, searchKeys, startDate]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const reset = () => {
    setQuery("");
    setFilterValues({});
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (!rows.length) {
    return (
      <Card className="p-4">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction ? <Link href={emptyAction.href} className={buttonStyles()}>{emptyAction.label}</Link> : undefined}
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="relative min-w-0 flex-1 sm:max-w-md">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary"
          />
          {query ? (
            <button type="button" onClick={() => { setQuery(""); setPage(1); }} className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Clear search">
              <X className="size-4" />
            </button>
          ) : null}
        </label>
        {filterGroups.map((group) => (
          <label className="relative sm:min-w-44" key={group.key}>
            <span className="sr-only">Filter by {group.label}</span>
            <SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <NativeSelect
              className="pl-9"
              onChange={(event) => {
                setFilterValues((current) => ({ ...current, [group.key]: event.target.value }));
                setPage(1);
              }}
              value={filterValues[group.key] ?? "all"}
            >
              {group.options.map((option) => <option key={`${option.key}-${option.value}`} value={option.value}>{option.label}</option>)}
            </NativeSelect>
          </label>
        ))}
        {dateFilter ? (
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center" aria-label={`${dateFilter.label ?? "Date"} range`}>
            <label className="relative min-w-0 sm:w-40">
              <span className="sr-only">{dateFilter.label ?? "Date"} from</span>
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-2 text-sm focus:border-primary"
                max={endDate || undefined}
                onChange={(event) => { setStartDate(event.target.value); setPage(1); }}
                type="date"
                value={startDate}
              />
            </label>
            <span aria-hidden="true" className="hidden text-xs text-muted-foreground sm:inline">to</span>
            <label className="relative min-w-0 sm:w-40">
              <span className="sr-only">{dateFilter.label ?? "Date"} to</span>
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-2 text-sm focus:border-primary"
                min={startDate || undefined}
                onChange={(event) => { setEndDate(event.target.value); setPage(1); }}
                type="date"
                value={endDate}
              />
            </label>
          </div>
        ) : null}
      </div>

      {visibleRows.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {columns.map((column) => <th key={column.key} className={`px-4 py-3.5 ${column.align === "right" ? "text-right" : ""}`}>{column.label}</th>)}
                  {viewBasePath ? <th className="px-4 py-3.5 text-right">Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    {columns.map((column) => (
                      <td key={column.key} className={`px-4 py-4 ${column.align === "right" ? "text-right" : ""} ${column.priority === "primary" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {column.format === "status" ? <StatusBadge status={String(row[column.key])} /> : formatCell(row[column.key], column.format)}
                      </td>
                    ))}
                    {viewBasePath ? (
                      <td className="px-4 py-4 text-right">
                        <Link href={`${viewBasePath}/${row.id}`} className="inline-flex min-h-9 items-center rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary-soft">View</Link>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {visibleRows.map((row) => (
              <article key={row.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{formatCell(row[columns[0].key], columns[0].format)}</p>
                    {columns[1] ? <p className="mt-1 text-xs text-muted-foreground">{formatCell(row[columns[1].key], columns[1].format)}</p> : null}
                  </div>
                  {columns.find((column) => column.format === "status") ? <StatusBadge status={String(row[columns.find((column) => column.format === "status")!.key])} /> : null}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
                  {columns.slice(2).filter((column) => column.format !== "status").slice(0, 4).map((column) => (
                    <div key={column.key}>
                      <dt className="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">{column.label}</dt>
                      <dd className="mt-1 text-sm font-medium">{formatCell(row[column.key], column.format)}</dd>
                    </div>
                  ))}
                </dl>
                {viewBasePath ? <Link href={`${viewBasePath}/${row.id}`} className={buttonStyles({ variant: "outline", block: true, className: "mt-4" })}>View details</Link> : null}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="px-4 py-16 text-center">
          <p className="font-semibold">No matching records</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term or clear the current filter.</p>
          <Button type="button" variant="outline" className="mt-5" onClick={reset}>Clear filters</Button>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {visibleRows.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filteredRows.length)} of {filteredRows.length}</p>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} className="grid size-10 place-items-center rounded-xl border border-border disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
          <span className="min-w-20 text-center text-xs font-medium">Page {safePage} of {pageCount}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={safePage === pageCount} className="grid size-10 place-items-center rounded-xl border border-border disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </Card>
  );
}
