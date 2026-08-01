import { CircleAlert, UserCheck, UserPlus, Users, WalletCards } from "lucide-react";
import type { Metadata } from "next";

import { CustomerExplorer } from "@/components/customers";
import { PageHeader, StatCard } from "@/components/shared";
import { customers } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  const receivables = customers.reduce((total, customer) => total + customer.outstandingBalance, 0);
  const outstanding = customers.filter((customer) => customer.outstandingBalance > 0).length;
  const active = customers.filter((customer) => customer.status === "active").length;

  return <div className="app-page-enter space-y-6 lg:space-y-8">
    <PageHeader eyebrow="Customer management" title="Customers" description="Keep balances, purchases and conversations connected to each customer." actions={[{ label: "Add customer", href: "/customers/new", icon: UserPlus }]} />
    <section aria-label="Customer summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total customers" value={String(customers.length)} icon={Users} tone="primary" />
      <StatCard label="Total receivables" value={formatINR(receivables)} icon={WalletCards} tone="warning" />
      <StatCard label="Outstanding balances" value={String(outstanding)} comparison="customers to follow up" icon={CircleAlert} tone="danger" />
      <StatCard label="Active customers" value={String(active)} comparison="recently trading" icon={UserCheck} tone="success" />
    </section>
    <CustomerExplorer />
  </div>;
}
