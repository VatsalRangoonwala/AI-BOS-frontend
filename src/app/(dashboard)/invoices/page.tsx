import {
  CircleDollarSign,
  Clock3,
  FilePlus2,
  Files,
  ReceiptIndianRupee,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";

import { DataExplorer, PageHeader, StatCard } from "@/components/shared";
import { invoices, customers } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Invoices" };

const customerById = new Map(customers.map((customer) => [customer.id, customer]));

export default function InvoicesPage() {
  const issuedInvoices = invoices.filter((invoice) => invoice.status !== "draft");
  const total = issuedInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paid = issuedInvoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
  const outstanding = issuedInvoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const partial = invoices.filter((invoice) => invoice.status === "partially_paid").reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const overdue = invoices.filter((invoice) => invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const rows = invoices.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customer: customerById.get(invoice.customerId)?.fullName ?? "Unknown customer",
    date: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    amount: invoice.total,
    status: invoice.status.replaceAll("_", " "),
    delivery: invoice.deliveryStatus.replaceAll("_", " "),
  }));

  return (
    <div className="app-page-enter space-y-6">
      <PageHeader
        eyebrow="Sales and billing"
        title="Invoices"
        description="Create professional invoices, follow delivery and keep every payment balance aligned."
        actions={[{ label: "Create invoice", href: "/invoices/new", icon: FilePlus2 }]}
      />

      <section aria-label="Invoice summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Files} label="Total invoiced" value={`₹${total.toLocaleString("en-IN")}`} tone="primary" />
        <StatCard icon={ShieldCheck} label="Paid" value={`₹${paid.toLocaleString("en-IN")}`} tone="success" />
        <StatCard icon={CircleDollarSign} label="Partially paid" value={`₹${partial.toLocaleString("en-IN")}`} tone="warning" />
        <StatCard icon={ReceiptIndianRupee} label="Outstanding" value={`₹${outstanding.toLocaleString("en-IN")}`} tone="info" />
        <StatCard icon={Clock3} label="Overdue" value={`₹${overdue.toLocaleString("en-IN")}`} tone="danger" />
      </section>

      <DataExplorer
        columns={[
          { key: "invoiceNumber", label: "Invoice", priority: "primary" },
          { key: "customer", label: "Customer", priority: "secondary" },
          { key: "date", label: "Date", format: "date" },
          { key: "dueDate", label: "Due date", format: "date" },
          { key: "amount", label: "Amount", format: "currency", align: "right" },
          { key: "status", label: "Payment", format: "status" },
          { key: "delivery", label: "Delivery", format: "status" },
        ]}
        emptyAction={{ label: "Create your first invoice", href: "/invoices/new" }}
        emptyDescription="Create an invoice to start tracking sales and payment balances."
        emptyTitle="No invoices yet"
        dateFilter={{ key: "date", label: "Invoice date" }}
        filters={[
          { label: "All statuses", value: "all", key: "status", groupLabel: "status" },
          { label: "Draft", value: "draft", key: "status" },
          { label: "Sent", value: "sent", key: "status" },
          { label: "Partially paid", value: "partially paid", key: "status" },
          { label: "Paid", value: "paid", key: "status" },
          { label: "Overdue", value: "overdue", key: "status" },
        ]}
        rows={rows}
        searchKeys={["invoiceNumber", "customer"]}
        searchPlaceholder="Search invoice or customer…"
        viewBasePath="/invoices"
      />
    </div>
  );
}
