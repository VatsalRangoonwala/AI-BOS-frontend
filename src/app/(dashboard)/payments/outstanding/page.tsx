import { AlertTriangle, Clock3, ReceiptIndianRupee } from "lucide-react";
import type { Metadata } from "next";

import { OutstandingPaymentsList, type OutstandingPaymentRow } from "@/components/payments";
import { Breadcrumbs, PageHeader, StatCard } from "@/components/shared";
import { customers, invoices } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Outstanding payments" };

const now = new Date("2026-08-01T12:00:00.000Z").getTime();

export default function OutstandingPaymentsPage() {
  const rows: OutstandingPaymentRow[] = invoices
    .filter((invoice) => invoice.balanceDue > 0)
    .map((invoice) => {
      const customer = customers.find((candidate) => candidate.id === invoice.customerId)!;
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: customer.id,
        customerName: customer.fullName,
        mobile: customer.mobile,
        originalAmount: invoice.total,
        paidAmount: invoice.amountPaid,
        balance: invoice.balanceDue,
        dueDate: invoice.dueDate,
        daysOverdue: Math.max(0, Math.floor((now - new Date(invoice.dueDate).getTime()) / 86_400_000)),
        status: invoice.status,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue || b.balance - a.balance);
  const total = rows.reduce((sum, row) => sum + row.balance, 0);
  const overdueRows = rows.filter((row) => row.daysOverdue > 0);

  return (
    <div className="app-page-enter space-y-6">
      <div><Breadcrumbs items={[{ label: "Payments", href: "/payments" }, { label: "Outstanding" }]} /><PageHeader eyebrow="Collections" title="Outstanding payments" description="Follow unpaid and partially paid balances, then record payment or send a confirmed reminder." /></div>
      <section className="grid gap-3 sm:grid-cols-3"><StatCard icon={ReceiptIndianRupee} label="Total outstanding" value={`₹${total.toLocaleString("en-IN")}`} tone="warning" /><StatCard icon={AlertTriangle} label="Overdue amount" value={`₹${overdueRows.reduce((sum, row) => sum + row.balance, 0).toLocaleString("en-IN")}`} tone="danger" /><StatCard icon={Clock3} label="Invoices to follow up" value={String(rows.length)} tone="info" /></section>
      <OutstandingPaymentsList rows={rows} />
    </div>
  );
}
