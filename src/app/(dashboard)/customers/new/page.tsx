import type { Metadata } from "next";

import { CustomerForm } from "@/components/customers";
import { Breadcrumbs, PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Add customer" };

export default function NewCustomerPage() {
  return <div className="app-page-enter mx-auto max-w-5xl space-y-6"><Breadcrumbs items={[{ label: "Customers", href: "/customers" }, { label: "Add customer" }]} /><PageHeader eyebrow="New customer" title="Add customer" description="Create one customer profile for invoices, orders, payments and reminders." /><CustomerForm /></div>;
}
