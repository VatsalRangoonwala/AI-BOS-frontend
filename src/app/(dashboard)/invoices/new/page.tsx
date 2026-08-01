import { FilePlus2 } from "lucide-react";
import type { Metadata } from "next";

import { InvoiceBuilder } from "@/components/invoices";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers, orders, products } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Create invoice" };

type NewInvoicePageProps = {
  searchParams: Promise<{ orderId?: string; customerId?: string }>;
};

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  const { orderId, customerId } = await searchParams;
  const sourceOrder = orders.find((order) => order.id === orderId);
  const initialCustomerId = customers.some((customer) => customer.id === customerId)
    ? customerId
    : undefined;
  return (
    <div className="app-page-enter space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Invoices", href: "/invoices" }, { label: "Create invoice" }]} />
        <PageHeader
          eyebrow="Invoice builder"
          title="Create invoice"
          description={sourceOrder ? `Billing order ${sourceOrder.orderNumber}. Review products and totals before creating the invoice.` : "Choose a customer, add products and review stock and totals before creating the invoice."}
        >
          <span className="hidden size-11 place-items-center rounded-lg bg-primary-soft text-primary sm:grid"><FilePlus2 className="size-5" /></span>
        </PageHeader>
      </div>
      <InvoiceBuilder
        customers={customers}
        initialCustomerId={initialCustomerId}
        products={products}
        sourceOrder={sourceOrder}
      />
    </div>
  );
}
