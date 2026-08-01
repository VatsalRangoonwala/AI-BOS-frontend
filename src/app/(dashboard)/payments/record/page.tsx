import type { Metadata } from "next";

import { PaymentForm } from "@/components/payments";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers, invoices } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Record payment" };

type RecordPaymentPageProps = {
  searchParams: Promise<{ invoiceId?: string; customerId?: string }>;
};

export default async function RecordPaymentPage({ searchParams }: RecordPaymentPageProps) {
  const { invoiceId, customerId } = await searchParams;
  return (
    <div className="app-page-enter space-y-6">
      <div><Breadcrumbs items={[{ label: "Payments", href: "/payments" }, { label: "Record payment" }]} /><PageHeader eyebrow="Collections" title="Record payment" description="Apply a full or partial payment to the correct customer invoice." /></div>
      <PaymentForm customers={customers} defaultCustomerId={customerId} defaultInvoiceId={invoiceId} invoices={invoices} />
    </div>
  );
}
