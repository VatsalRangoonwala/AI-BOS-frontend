"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type AnalyticsRangeId = "today" | "last-7-days" | "last-30-days" | "this-month" | "this-year" | "custom";

export const analyticsRangeOptions: Array<{ value: AnalyticsRangeId; label: string }> = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-30-days", label: "Last 30 days" },
  { value: "this-month", label: "This month" },
  { value: "this-year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

type AnalyticsRangeContextValue = {
  range: AnalyticsRangeId;
  setRange: (range: AnalyticsRangeId) => void;
  customStart: string;
  setCustomStart: (date: string) => void;
  customEnd: string;
  setCustomEnd: (date: string) => void;
  label: string;
  multiplier: number;
  pointLimit: number | null;
  customRangeValid: boolean;
};

const AnalyticsRangeContext = createContext<AnalyticsRangeContextValue | null>(null);

function inclusiveDays(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T00:00:00.000Z`);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) return 0;
  return Math.floor((endDate.valueOf() - startDate.valueOf()) / 86_400_000) + 1;
}

export function AnalyticsRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<AnalyticsRangeId>("last-30-days");
  const [customStart, setCustomStart] = useState("2026-07-03");
  const [customEnd, setCustomEnd] = useState("2026-08-01");

  const value = useMemo<AnalyticsRangeContextValue>(() => {
    const customDays = inclusiveDays(customStart, customEnd);
    const customRangeValid = customDays > 0;
    const optionLabel = analyticsRangeOptions.find((option) => option.value === range)?.label ?? "Last 30 days";
    const label = range === "custom" && customRangeValid ? `${customStart} to ${customEnd}` : optionLabel;
    const multiplierByRange: Record<Exclude<AnalyticsRangeId, "custom">, number> = {
      today: 0.12,
      "last-7-days": 0.44,
      "last-30-days": 1,
      "this-month": 0.12,
      "this-year": 5.8,
    };
    const pointLimitByRange: Record<Exclude<AnalyticsRangeId, "custom">, number | null> = {
      today: 1,
      "last-7-days": 3,
      "last-30-days": null,
      "this-month": 1,
      "this-year": null,
    };

    return {
      range,
      setRange,
      customStart,
      setCustomStart,
      customEnd,
      setCustomEnd,
      label,
      multiplier: range === "custom" ? (customRangeValid ? Math.min(12, Math.max(0.05, customDays / 30)) : 1) : multiplierByRange[range],
      pointLimit: range === "custom" ? (customRangeValid ? Math.max(1, Math.ceil(customDays / 7)) : null) : pointLimitByRange[range],
      customRangeValid,
    };
  }, [customEnd, customStart, range]);

  return <AnalyticsRangeContext.Provider value={value}>{children}</AnalyticsRangeContext.Provider>;
}

export function useAnalyticsRange() {
  const value = useContext(AnalyticsRangeContext);
  if (!value) throw new Error("useAnalyticsRange must be used within AnalyticsRangeProvider");
  return value;
}

export function useOptionalAnalyticsRange() {
  return useContext(AnalyticsRangeContext);
}
