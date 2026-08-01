import { ArrowRight, Boxes, IndianRupee, ReceiptIndianRupee, ShoppingBag, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AnalyticsControls, InsightList } from "@/components/analytics";
import { CategoryChart, ComparisonChart, RevenueChart } from "@/components/charts";
import { ChartCard, PageHeader, StatCard } from "@/components/shared";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { analyticsSummary, customers, products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

const categoryData = [
  { name: "Audio", value: 31 },
  { name: "Garments", value: 23 },
  { name: "Power", value: 21 },
  { name: "Accessories", value: 25 },
];

const analyticsAreas = [
  { label: "Sales analytics", description: "Revenue, orders and product performance", href: "/analytics/sales", icon: TrendingUp, value: "+12.4% growth", tone: "bg-primary-soft text-primary" },
  { label: "Inventory analytics", description: "Velocity, value and stock risk", href: "/analytics/inventory", icon: Boxes, value: `${analyticsSummary.lowStockCount + analyticsSummary.outOfStockCount} alerts`, tone: "bg-warning-soft text-warning" },
  { label: "Customer analytics", description: "Retention, frequency and top buyers", href: "/analytics/customers", icon: Users, value: `${customers.length} customers`, tone: "bg-info-soft text-info" },
  { label: "Payment analytics", description: "Collections, methods and overdue trends", href: "/analytics/payments", icon: ReceiptIndianRupee, value: formatINR(analyticsSummary.collectedAmount), tone: "bg-success-soft text-success" },
];

export default function AnalyticsPage() {
  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <PageHeader eyebrow="Business intelligence" title="Analytics" description="Understand what is selling, where cash is held up, and what needs your attention."><AnalyticsControls /></PageHeader>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross sales" value={formatINR(analyticsSummary.grossSales)} change={analyticsSummary.salesGrowthPercentage} comparison="vs previous period" icon={IndianRupee} sparkline={[4, 6, 5, 8, 7, 10]} />
        <StatCard label="Average order" value={formatINR(analyticsSummary.averageOrderValue)} change={5.8} icon={ShoppingBag} tone="success" />
        <StatCard label="Returning customers" value={String(analyticsSummary.returningCustomers)} change={16.7} icon={UserRoundCheck} tone="info" />
        <StatCard label="Inventory value" value={formatINR(analyticsSummary.inventoryValue)} change={-2.1} comparison="stock sold through" icon={Boxes} tone="warning" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <ChartCard title="Revenue trend" description="Daily gross sales compared with the previous period" className="overflow-hidden"><div className="overflow-x-auto pb-2"><RevenueChart data={analyticsSummary.revenueTrend.map((item) => ({ label: item.label, revenue: item.value, previous: item.previousValue }))} /></div></ChartCard>
        <ChartCard title="Sales by category" description="Share of revenue across your catalogue"><CategoryChart data={categoryData} /></ChartCard>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Collected vs outstanding" description="How invoice value is converting into cash"><div className="overflow-x-auto"><ComparisonChart data={[{ label: "Week 1", primary: 2100, secondary: 1498 }, { label: "Week 2", primary: 1800, secondary: 1798 }, { label: "Week 3", primary: 3297, secondary: 0 }, { label: "Week 4", primary: 1296, secondary: 5094 }]} primaryLabel="Collected" secondaryLabel="Outstanding" /></div></ChartCard>
        <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Top-selling products</CardTitle><p className="mt-1 text-sm text-muted-foreground">Ranked by sales value</p></div><Link href="/analytics/sales" className="text-sm font-semibold text-primary">Details</Link></CardHeader><CardContent className="space-y-4">{analyticsSummary.topProducts.map((item, index) => { const product = products.find((entry) => entry.id === item.id); const percent = Math.round((item.value / analyticsSummary.topProducts[0].value) * 100); return <div key={item.id} className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-muted text-xs font-bold">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-sm"><p className="truncate font-semibold">{product?.name}</p><p className="shrink-0 font-semibold tabular-nums">{formatINR(item.value)}</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></div><Badge variant="neutral">{item.secondaryValue} sold</Badge></div>; })}</CardContent></Card>
      </section>
      <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold">Explore analytics</h2><p className="mt-1 text-sm text-muted-foreground">Open a focused report for deeper trends and records.</p></div></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{analyticsAreas.map((area) => <Link key={area.href} href={area.href} className="group rounded-lg border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/35"><span className={`grid size-10 place-items-center rounded-xl ${area.tone}`}><area.icon className="size-5" /></span><h3 className="mt-4 font-semibold">{area.label}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">{area.description}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-xs font-semibold text-muted-foreground">{area.value}</span><ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" /></div></Link>)}</div></section>
      <InsightList insights={analyticsSummary.aiInsights} />
    </div>
  );
}
