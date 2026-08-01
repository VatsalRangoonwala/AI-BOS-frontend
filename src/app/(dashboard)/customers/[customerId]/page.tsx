import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomerProfile } from "@/components/customers";
import { Breadcrumbs } from "@/components/shared";
import { customerLedgerEntries, customers, invoices, orders, payments } from "@/lib/mock-data";

type CustomerPageProps = { params: Promise<{ customerId: string }> };

export function generateStaticParams() { return customers.map((customer) => ({ customerId: customer.id })); }

export async function generateMetadata({ params }: CustomerPageProps): Promise<Metadata> {
  const { customerId } = await params;
  const customer = customers.find((candidate) => candidate.id === customerId);
  return { title: customer?.fullName ?? "Customer" };
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { customerId } = await params;
  const customer = customers.find((candidate) => candidate.id === customerId);
  if (!customer) notFound();

  return <div className="app-page-enter"><Breadcrumbs items={[{ label: "Customers", href: "/customers" }, { label: customer.fullName }]} /><CustomerProfile customer={customer} ledger={customerLedgerEntries.filter((entry) => entry.customerId === customer.id).sort((a, b) => b.date.localeCompare(a.date))} invoices={invoices.filter((invoice) => invoice.customerId === customer.id)} orders={orders.filter((order) => order.customerId === customer.id)} payments={payments.filter((payment) => payment.customerId === customer.id)} /></div>;
}
