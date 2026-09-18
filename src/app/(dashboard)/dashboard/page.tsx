import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  FilePlus2,
  IndianRupee,
  Package,
  ReceiptIndianRupee,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RevenueChart } from "@/components/charts";
import { AIInsightActions, DashboardHeader, ReminderButton } from "@/components/dashboard/dashboard-actions";
import { ChartCard, StatCard, StatusBadge } from "@/components/shared";
import { Badge, buttonStyles, Card, CardContent, CardHeader, CardTitle, CurrencyDisplay } from "@/components/ui";
import { analyticsSummary, customers, dashboardMetrics, invoices, orders, products } from "@/lib/mock-data";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const customerById = new Map(customers.map((customer) => [customer.id, customer]));

const quickActions = [
  { label: "Create invoice", description: "Bill a customer", href: "/invoices/new", icon: FilePlus2, tone: "bg-primary-soft text-primary" },
  { label: "Add customer", description: "Save contact details", href: "/customers/new", icon: UserPlus, tone: "bg-info-soft text-info" },
  { label: "Add product", description: "Update your catalogue", href: "/products/new", icon: Package, tone: "bg-secondary-soft text-secondary" },
  { label: "Record payment", description: "Log money received", href: "/payments/record", icon: WalletCards, tone: "bg-success-soft text-success" },
  { label: "View reports", description: "Understand performance", href: "/analytics", icon: TrendingUp, tone: "bg-warning-soft text-warning" },
];

export default function DashboardPage() {
  const lowStock = products.filter((product) => product.stockStatus !== "in_stock");
  const recentOrders = [...orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate)).slice(0, 4);
  const outstandingInvoices = invoices.filter((invoice) => invoice.balanceDue > 0).sort((a, b) => b.balanceDue - a.balanceDue).slice(0, 3);
  const revenueData = analyticsSummary.revenueTrend.map((item) => ({ label: item.label, revenue: item.value, previous: item.previousValue }));

  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <DashboardHeader />

      <section aria-label="Business overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Today’s sales" value={formatINR(dashboardMetrics.todaySales)} change={dashboardMetrics.comparisons.todaySales} comparison="vs yesterday" icon={IndianRupee} sparkline={[3, 5, 4, 8, 6, 10, 12]} />
        <StatCard label="Monthly revenue" value={formatINR(dashboardMetrics.monthlyRevenue)} change={dashboardMetrics.comparisons.monthlyRevenue} comparison="vs last month" icon={TrendingUp} tone="success" sparkline={[4, 6, 5, 7, 9, 8, 12]} />
        <StatCard label="Outstanding" value={formatINR(dashboardMetrics.outstandingPayments)} change={dashboardMetrics.comparisons.outstandingPayments} comparison="less than last month" icon={ReceiptIndianRupee} tone="warning" />
        <StatCard label="Customers" value={String(dashboardMetrics.totalCustomers)} change={dashboardMetrics.comparisons.totalCustomers} comparison="this month" icon={Users} tone="info" />
        <StatCard label="Stock alerts" value={String(dashboardMetrics.lowStockProducts)} change={dashboardMetrics.comparisons.lowStockProducts} comparison="needs attention" icon={Boxes} tone="danger" />
        <StatCard label="Pending orders" value={String(dashboardMetrics.pendingOrders)} change={dashboardMetrics.comparisons.pendingOrders} comparison="since yesterday" icon={ShoppingBag} tone="warning" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <ChartCard title="Revenue overview" description="Sales performance across the current period" className="overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <RevenueChart data={revenueData} />
          </div>
        </ChartCard>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Sales summary</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success"><TrendingUp className="size-5" /></span>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-primary-soft p-4">
              <p className="text-xs font-medium text-muted-foreground">Total sales</p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-primary tabular-nums">{formatINR(analyticsSummary.grossSales)}</p>
              <p className="mt-1 text-xs font-semibold text-success">↑ {analyticsSummary.salesGrowthPercentage}% from last period</p>
            </div>
            <dl className="mt-4 divide-y divide-border">
              {[
                ["Orders", String(analyticsSummary.totalOrders)],
                ["Average order", formatINR(analyticsSummary.averageOrderValue)],
                ["Collected", formatINR(analyticsSummary.collectedAmount)],
                ["Outstanding", formatINR(analyticsSummary.outstandingAmount)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="relative overflow-hidden rounded-lg border border-primary/20 bg-primary-soft p-5 sm:p-6">
        <div className="absolute -right-12 -top-16 size-40 rounded-full bg-primary/8" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">AI business insight</h2>
                <Badge variant="primary">New</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your boAt earphone stock may run out within five days at the current sales rate. Reordering 24 units now should cover the next three weeks.
              </p>
            </div>
          </div>
          <AIInsightActions />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Inventory alerts</CardTitle><p className="mt-1 text-sm text-muted-foreground">Products that may affect upcoming sales</p></div>
            <Link href="/inventory/low-stock" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="size-4" /></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((product) => (
              <div key={product.id} className="flex flex-col gap-3 rounded-xl border border-border p-3.5 sm:flex-row sm:items-center">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${product.currentStock === 0 ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning"}`}><Package className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{product.sku} · Threshold {product.lowStockThreshold}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right"><p className="text-sm font-bold tabular-nums">{product.currentStock}</p><p className="text-[0.68rem] text-muted-foreground">in stock</p></div>
                  <Link href={`/products/${product.id}`} className={buttonStyles({ variant: "outline", size: "sm" })}>Restock</Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Recent orders</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest activity from your customers</p></div>
            <Link href="/orders" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="size-4" /></Link>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recentOrders.map((order) => {
              const customer = customerById.get(order.customerId);
              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="flex min-h-16 items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-sm font-bold text-muted-foreground">{customer?.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{customer?.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{order.orderNumber} · {formatDate(order.orderDate, { day: "numeric", month: "short" })}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold tabular-nums">{formatINR(order.total)}</p><div className="mt-1"><StatusBadge status={order.status} /></div></div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Outstanding payments</CardTitle><p className="mt-1 text-sm text-muted-foreground">Follow up before these balances become overdue</p></div>
            <Link href="/payments/outstanding" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="size-4" /></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {outstandingInvoices.map((invoice) => {
              const customer = customerById.get(invoice.customerId)!;
              return (
                <div key={invoice.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1"><p className="font-semibold">{customer.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{customer.mobile} · Due {formatDate(invoice.dueDate, { day: "numeric", month: "short" })}</p></div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end"><div className="sm:text-right"><CurrencyDisplay amount={invoice.balanceDue} className="font-bold" /><p className="text-[0.68rem] text-muted-foreground">balance due</p></div><ReminderButton customer={customer.fullName} amount={formatINR(invoice.balanceDue)} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle><p className="mt-1 text-sm text-muted-foreground">Common tasks, one tap away</p></CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="group flex min-h-16 items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/30 hover:bg-primary-soft/50">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${action.tone}`}><action.icon className="size-4.5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{action.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{action.description}</span></span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning-soft px-4 py-3 text-sm text-warning">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p><strong>1 overdue invoice</strong> needs attention. Following up today can improve your collection rate.</p>
      </div>
    </div>
  );
}
