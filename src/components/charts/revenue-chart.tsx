"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useOptionalAnalyticsRange } from "@/components/analytics/analytics-range-provider";

type RevenuePoint = {
  label: string;
  revenue: number;
  previous?: number;
};

type RevenueChartProps = {
  data: RevenuePoint[];
  height?: number;
  showComparison?: boolean;
};

const ranges = ["Daily", "Weekly", "Monthly"] as const;

function CompactCurrency({ value }: { value: number }) {
  return <>{value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : value >= 1000 ? `₹${Math.round(value / 1000)}k` : `₹${value}`}</>;
}

function aggregatePoints(data: RevenuePoint[], range: (typeof ranges)[number]) {
  if (range === "Daily" || data.length <= 1) return data;
  const chunkSize = range === "Weekly" ? Math.max(1, Math.ceil(data.length / 3)) : data.length;
  const groups: RevenuePoint[] = [];
  for (let index = 0; index < data.length; index += chunkSize) {
    const points = data.slice(index, index + chunkSize);
    groups.push({
      label: range === "Monthly" ? "Period total" : `Week ${groups.length + 1}`,
      revenue: points.reduce((sum, point) => sum + point.revenue, 0),
      previous: points.some((point) => point.previous !== undefined) ? points.reduce((sum, point) => sum + (point.previous ?? 0), 0) : undefined,
    });
  }
  return groups;
}

export function RevenueChart({ data, height = 290, showComparison = true }: RevenueChartProps) {
  const [range, setRange] = useState<(typeof ranges)[number]>("Daily");
  const analyticsRange = useOptionalAnalyticsRange();
  const periodData = useMemo(() => {
    if (!analyticsRange) return data;
    const source = analyticsRange.pointLimit ? data.slice(-analyticsRange.pointLimit) : data;
    return source.map((point) => ({
      ...point,
      label: source.length === 1 ? analyticsRange.label : point.label,
      revenue: Math.round(point.revenue * analyticsRange.multiplier),
      previous: point.previous === undefined ? undefined : Math.round(point.previous * analyticsRange.multiplier),
    }));
  }, [analyticsRange, data]);
  const displayData = useMemo(() => aggregatePoints(periodData, range), [periodData, range]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Current period</span>
          {showComparison ? <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-border-strong" />Previous period</span> : null}
        </div>
        <div className="flex rounded-xl bg-muted p-1" aria-label="Chart aggregation" role="group">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              aria-pressed={range === item}
              className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition-colors ${range === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">Showing {range.toLowerCase()} chart data{analyticsRange ? ` for ${analyticsRange.label}` : ""}.</p>
      <div style={{ height }} className="min-w-[560px] md:min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} tickFormatter={(value: number) => value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)} width={54} />
            <Tooltip
              cursor={{ stroke: "var(--border-strong)", strokeDasharray: "4 4" }}
              content={({ active, payload, label }) => active && payload?.length ? (
                <div className="rounded-xl border border-border bg-card p-3 text-xs shadow-lg">
                  <p className="mb-2 font-semibold">{label}</p>
                  {payload.map((entry) => <p key={String(entry.dataKey)} className="mt-1 flex min-w-36 justify-between gap-4 text-muted-foreground"><span>{entry.name}</span><strong className="text-foreground"><CompactCurrency value={Number(entry.value)} /></strong></p>)}
                </div>
              ) : null}
            />
            {showComparison ? <Area type="monotone" dataKey="previous" name="Previous" stroke="var(--border-strong)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" dot={false} activeDot={false} /> : null}
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--primary)" strokeWidth={2.5} fill="url(#revenueFill)" dot={false} activeDot={{ r: 4, fill: "var(--surface)", stroke: "var(--primary)", strokeWidth: 2.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
