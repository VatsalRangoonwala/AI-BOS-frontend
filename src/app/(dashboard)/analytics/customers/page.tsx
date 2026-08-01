import { Repeat2, UserPlus, Users, WalletCards } from "lucide-react";
import type { Metadata } from "next";

import { AnalyticsDetail } from "@/components/analytics";
import { analyticsSummary, customers } from "@/lib/mock-data";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Customer analytics" };

export default function CustomerAnalyticsPage() {
  return <AnalyticsDetail title="Customer analytics" description="See who returns, who spends most, and whose balance needs attention." sectionLabel="Customers" stats={[{ label: "Total customers", value: String(customers.length), change: 20, icon: Users }, { label: "New customers", value: String(analyticsSummary.newCustomers), icon: UserPlus, tone: "info" }, { label: "Returning", value: String(analyticsSummary.returningCustomers), change: 16.7, icon: Repeat2, tone: "success" }, { label: "Customer dues", value: formatINR(analyticsSummary.outstandingAmount), icon: WalletCards, tone: "warning" }]} chartTitle="New vs returning customers" chartDescription="Customer mix across the last six months" chartData={[{ label: "Mar", primary: 1, secondary: 2 }, { label: "Apr", primary: 1, secondary: 2 }, { label: "May", primary: 0, secondary: 3 }, { label: "Jun", primary: 1, secondary: 3 }, { label: "Jul", primary: 1, secondary: 5 }, { label: "Aug", primary: 0, secondary: 5 }]} tableTitle="Customer value" tableDescription="Purchase totals, open balances and latest activity." rows={customers.map((customer) => ({ id: customer.id, customer: customer.fullName, mobile: customer.mobile, purchases: customer.totalPurchases, outstanding: customer.outstandingBalance, frequency: customer.totalPurchases ? `${Math.max(1, Math.round(customer.totalPurchases / 1800))} orders` : "No orders", lastActivity: customer.lastTransactionAt ? formatDate(customer.lastTransactionAt) : "No activity", status: customer.status }))} columns={[{ key: "customer", label: "Customer", priority: "primary" }, { key: "mobile", label: "Mobile" }, { key: "purchases", label: "Purchases", format: "currency", align: "right" }, { key: "outstanding", label: "Outstanding", format: "currency", align: "right" }, { key: "frequency", label: "Frequency" }, { key: "lastActivity", label: "Last activity" }, { key: "status", label: "Status", format: "status" }]} searchKeys={["customer", "mobile"]} />;
}
