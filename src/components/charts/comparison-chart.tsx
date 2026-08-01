"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useOptionalAnalyticsRange } from "@/components/analytics/analytics-range-provider";

type ComparisonPoint = { label: string; primary: number; secondary?: number };

export function ComparisonChart({ data, primaryLabel = "Sales", secondaryLabel = "Orders", height = 280 }: { data: ComparisonPoint[]; primaryLabel?: string; secondaryLabel?: string; height?: number }) {
  const analyticsRange = useOptionalAnalyticsRange();
  const displayData = useMemo(() => {
    if (!analyticsRange) return data;
    const source = analyticsRange.pointLimit ? data.slice(-analyticsRange.pointLimit) : data;
    return source.map((point) => ({
      ...point,
      label: source.length === 1 ? analyticsRange.label : point.label,
      primary: Math.round(point.primary * analyticsRange.multiplier),
      secondary: point.secondary === undefined ? undefined : Math.round(point.secondary * analyticsRange.multiplier),
    }));
  }, [analyticsRange, data]);

  return (
    <div style={{ height }} className="min-w-[520px] md:min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayData} margin={{ top: 6, right: 8, bottom: 0, left: -14 }} barGap={4}>
          <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} dy={8} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: "var(--border)", background: "var(--surface)", fontSize: 12 }} />
          <Bar dataKey="primary" name={primaryLabel} fill="var(--primary)" radius={[6, 6, 2, 2]} maxBarSize={30} />
          {displayData.some((item) => item.secondary !== undefined) ? <Bar dataKey="secondary" name={secondaryLabel} fill="var(--secondary)" radius={[6, 6, 2, 2]} maxBarSize={30} /> : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
