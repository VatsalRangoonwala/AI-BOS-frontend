import type { LucideIcon } from "lucide-react";

import { ComparisonChart, RevenueChart } from "@/components/charts";
import { Breadcrumbs, ChartCard, DataExplorer, PageHeader, StatCard, type DataColumn, type DataRow } from "@/components/shared";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";

type DetailStat = { label: string; value: string; change?: number; comparison?: string; icon: LucideIcon; tone?: "primary" | "success" | "warning" | "danger" | "info" };

type AnalyticsDetailProps = {
  title: string;
  description: string;
  sectionLabel: string;
  stats: DetailStat[];
  chartTitle: string;
  chartDescription: string;
  chartType?: "line" | "bar";
  chartData: Array<{ label: string; revenue?: number; previous?: number; primary?: number; secondary?: number }>;
  tableTitle: string;
  tableDescription: string;
  rows: DataRow[];
  columns: DataColumn[];
  searchKeys: string[];
};

export function AnalyticsDetail({ title, description, sectionLabel, stats, chartTitle, chartDescription, chartType = "bar", chartData, tableTitle, tableDescription, rows, columns, searchKeys }: AnalyticsDetailProps) {
  return (
    <div className="app-page-enter space-y-6">
      <div><Breadcrumbs items={[{ label: "Analytics", href: "/analytics" }, { label: sectionLabel }]} /><PageHeader eyebrow="Detailed report" title={title} description={description}><AnalyticsControls /></PageHeader></div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={`${sectionLabel} metrics`}>{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
      <ChartCard title={chartTitle} description={chartDescription} className="overflow-hidden"><div className="overflow-x-auto pb-2">{chartType === "line" ? <RevenueChart data={chartData.map((item) => ({ label: item.label, revenue: item.revenue ?? item.primary ?? 0, previous: item.previous ?? item.secondary }))} /> : <ComparisonChart data={chartData.map((item) => ({ label: item.label, primary: item.primary ?? item.revenue ?? 0, secondary: item.secondary ?? item.previous }))} />}</div></ChartCard>
      <section><div className="mb-4"><h2 className="text-lg font-semibold tracking-tight">{tableTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{tableDescription}</p></div><DataExplorer rows={rows} columns={columns} searchKeys={searchKeys} pageSize={6} /></section>
    </div>
  );
}
