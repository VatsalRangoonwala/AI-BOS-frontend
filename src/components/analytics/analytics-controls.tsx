"use client";

import { CalendarDays, Download } from "lucide-react";

import { analyticsRangeOptions, type AnalyticsRangeId, useAnalyticsRange } from "@/components/analytics/analytics-range-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button, Input, NativeSelect } from "@/components/ui";

export function AnalyticsControls() {
  const {
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    customRangeValid,
    label,
  } = useAnalyticsRange();
  const { toast } = useToast();

  const exportReport = () => {
    if (range === "custom" && !customRangeValid) {
      toast({ title: "Choose a valid date range", description: "The end date must be on or after the start date.", variant: "warning" });
      return;
    }
    toast({ title: "Report prepared", description: `${label} analytics were exported as a CSV mock file.`, variant: "success" });
  };

  return (
    <div className="grid w-full gap-2 sm:w-auto">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <label className="relative min-w-48">
          <span className="sr-only">Analytics date range</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <NativeSelect value={range} onChange={(event) => setRange(event.target.value as AnalyticsRangeId)} className="pl-9">
            {analyticsRangeOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
          </NativeSelect>
        </label>
        <Button variant="outline" onClick={exportReport}><Download className="size-4" />Export</Button>
      </div>

      {range === "custom" ? (
        <div className="grid gap-2 rounded-xl border border-border bg-card p-2 sm:grid-cols-2" aria-label="Custom analytics dates">
          <label className="grid gap-1 text-xs font-medium text-muted-foreground">
            From
            <Input type="date" value={customStart} max={customEnd || undefined} onChange={(event) => setCustomStart(event.target.value)} invalid={!customRangeValid} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-muted-foreground">
            To
            <Input type="date" value={customEnd} min={customStart || undefined} onChange={(event) => setCustomEnd(event.target.value)} invalid={!customRangeValid} />
          </label>
          {!customRangeValid ? <p className="text-xs font-medium text-danger sm:col-span-2" role="alert">End date must be on or after start date.</p> : null}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">Analytics range changed to {label}.</p>
    </div>
  );
}
