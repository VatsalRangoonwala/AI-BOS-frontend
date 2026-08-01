import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvoiceBuilder } from "@/components/invoices";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers, invoices, products } from "@/lib/mock-data";

type EditInvoicePageProps = {
  params: Promise<{ invoiceId: string }>;
};

export async function generateMetadata({ params }: EditInvoicePageProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const invoice = invoices.find((candidate) => candidate.id === invoiceId);
  return { title: invoice ? `Edit ${invoice.invoiceNumber}` : "Invoice not found" };
}

export function generateStaticParams() {
  return invoices.map((invoice) => ({ invoiceId: invoice.id }));
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { invoiceId } = await params;
  const invoice = invoices.find((candidate) => candidate.id === invoiceId);
  if (!invoice) notFound();

  return (
    <div className="app-page-enter space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Invoices", href: "/invoices" }, { label: invoice.invoiceNumber, href: `/invoices/${invoice.id}` }, { label: "Edit" }]} />
        <PageHeader
          eyebrow="Invoice builder"
          title={`Edit ${invoice.invoiceNumber}`}
          description="Review customer, product and payment details before updating this invoice."
        />
      </div>
      <InvoiceBuilder customers={customers} initialInvoice={invoice} products={products} />
    </div>
  );
}
