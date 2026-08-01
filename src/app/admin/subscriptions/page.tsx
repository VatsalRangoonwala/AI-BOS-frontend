import { AlertTriangle, ArrowDownRight, ArrowUpRight, CircleDollarSign } from "lucide-react";
import type { Metadata } from "next";

import { ComparisonChart } from "@/components/charts";
import { ChartCard, DataExplorer, PageHeader, StatCard } from "@/components/shared";

export const metadata: Metadata = { title: "Admin subscriptions" };
const records = [
  { id: "s1", business: "Sharma Mobile & Electronics", plan: "Pro", cycle: "Yearly", amount: 9588, status: "Active", changed: "15 Feb 2026" },
  { id: "s2", business: "Metro Wholesale", plan: "Premium", cycle: "Monthly", amount: 1999, status: "Active", changed: "29 Jul 2026" },
  { id: "s3", business: "City Mobile Point", plan: "Pro", cycle: "Monthly", amount: 999, status: "Active", changed: "31 Jul 2026" },
  { id: "s4", business: "Fresh Basket", plan: "Free", cycle: "—", amount: 0, status: "Active", changed: "1 Aug 2026" },
  { id: "s5", business: "Kohli Garments", plan: "Pro", cycle: "Yearly", amount: 9588, status: "Failed", changed: "1 Aug 2026" },
];
export default function AdminSubscriptionsPage() { return <div className="app-page-enter space-y-6"><PageHeader eyebrow="Revenue operations" title="Subscriptions" description="Track recurring revenue, plan movement and failed renewals." /><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Monthly recurring revenue" value="₹8.6L" change={16.8} icon={CircleDollarSign} tone="success" /><StatCard label="Upgrades this month" value="48" change={22.5} icon={ArrowUpRight} /><StatCard label="Downgrades" value="11" change={-8.3} icon={ArrowDownRight} tone="warning" /><StatCard label="Failed renewals" value="17" change={-10.5} icon={AlertTriangle} tone="danger" /></section><ChartCard title="Plan movement" description="Upgrades and downgrades over the last six months" className="overflow-hidden"><div className="overflow-x-auto"><ComparisonChart data={[{ label: "Mar", primary: 22, secondary: 9 }, { label: "Apr", primary: 28, secondary: 8 }, { label: "May", primary: 31, secondary: 12 }, { label: "Jun", primary: 39, secondary: 10 }, { label: "Jul", primary: 44, secondary: 13 }, { label: "Aug", primary: 48, secondary: 11 }]} primaryLabel="Upgrades" secondaryLabel="Downgrades" /></div></ChartCard><DataExplorer rows={records} columns={[{ key: "business", label: "Business", priority: "primary" }, { key: "plan", label: "Plan" }, { key: "cycle", label: "Billing cycle" }, { key: "amount", label: "Value", format: "currency", align: "right" }, { key: "status", label: "Status", format: "status" }, { key: "changed", label: "Last change" }]} searchKeys={["business", "plan", "status"]} searchPlaceholder="Search subscriptions…" /></div>; }
