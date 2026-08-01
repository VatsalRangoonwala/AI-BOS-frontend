import { Download, Plus } from "lucide-react";
import type { Metadata } from "next";

import { Breadcrumbs, DataExplorer, PageHeader } from "@/components/shared";
import { customers, invoices, payments } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Payment history" };

export default function PaymentHistoryPage() {
  const rows = [...payments].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)).map((payment) => ({
    id: payment.id,
    customer: customers.find((customer) => customer.id === payment.customerId)?.fullName ?? "Unknown customer",
    invoice: invoices.find((invoice) => invoice.id === payment.invoiceId)?.invoiceNumber ?? "Unknown invoice",
    amount: payment.amount,
    date: payment.paymentDate,
    method: payment.method.replaceAll("_", " "),
    reference: payment.referenceNumber ?? "—",
    status: payment.status,
    recordedBy: payment.recordedBy,
  }));

  return (
    <div className="app-page-enter space-y-6">
      <div><Breadcrumbs items={[{ label: "Payments", href: "/payments" }, { label: "History" }]} /><PageHeader eyebrow="Audit trail" title="Payment history" description="Search every connected payment by customer, invoice, reference or team member." actions={[{ label: "Export", href: "/analytics/payments", icon: Download, variant: "outline" }, { label: "Record payment", href: "/payments/record", icon: Plus }]} /></div>
      <DataExplorer
        columns={[
          { key: "customer", label: "Customer", priority: "primary" },
          { key: "invoice", label: "Invoice", priority: "secondary" },
          { key: "amount", label: "Amount", format: "currency", align: "right" },
          { key: "date", label: "Payment date", format: "date" },
          { key: "method", label: "Method" },
          { key: "reference", label: "Reference" },
          { key: "status", label: "Status", format: "status" },
          { key: "recordedBy", label: "Recorded by" },
        ]}
        emptyAction={{ label: "Record a payment", href: "/payments/record" }}
        emptyDescription="Payments recorded against invoices will appear here."
        emptyTitle="No payment history"
        filters={[
          { label: "All methods", value: "all", key: "method" },
          { label: "Cash", value: "cash", key: "method" },
          { label: "UPI", value: "upi", key: "method" },
          { label: "Bank transfer", value: "bank transfer", key: "method" },
        ]}
        rows={rows}
        searchKeys={["customer", "invoice", "reference", "recordedBy"]}
        searchPlaceholder="Search payments…"
      />
    </div>
  );
}
