import { AlertTriangle, ArrowRight, Banknote, CircleDollarSign, Clock3, CreditCard, History, Landmark, Plus, ReceiptIndianRupee, Smartphone, WalletCards } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, StatCard } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, CurrencyDisplay, InvoiceStatusBadge, buttonStyles } from "@/components/ui";
import { customers, invoices, payments } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Payments" };

const customerById = new Map(customers.map((customer) => [customer.id, customer]));
const invoiceById = new Map(invoices.map((invoice) => [invoice.id, invoice]));

const methodIcon = {
  cash: Banknote,
  upi: Smartphone,
  card: CreditCard,
  bank_transfer: Landmark,
  other: WalletCards,
};

export default function PaymentsPage() {
  const collected = payments.filter((payment) => payment.status === "completed").reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = invoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const overdue = invoices.filter((invoice) => invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const monthPayments = payments.filter((payment) => payment.paymentDate.startsWith("2026-08")).reduce((sum, payment) => sum + payment.amount, 0);
  const partialCount = invoices.filter((invoice) => invoice.status === "partially_paid").length;
  const recentPayments = [...payments].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
  const outstandingInvoices = invoices.filter((invoice) => invoice.balanceDue > 0).sort((a, b) => b.balanceDue - a.balanceDue).slice(0, 4);
  const methodTotals = payments.reduce<Record<string, number>>((totals, payment) => {
    totals[payment.method] = (totals[payment.method] ?? 0) + payment.amount;
    return totals;
  }, {});

  return (
    <div className="app-page-enter space-y-6">
      <PageHeader
        eyebrow="Collections"
        title="Payments"
        description="See money collected, invoices still due and the payment methods customers use."
        actions={[
          { label: "Payment history", href: "/payments/history", icon: History, variant: "outline" },
          { label: "Record payment", href: "/payments/record", icon: Plus },
        ]}
      />

      <section aria-label="Payment summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={WalletCards} label="Total collected" value={`₹${collected.toLocaleString("en-IN")}`} tone="success" />
        <StatCard icon={ReceiptIndianRupee} label="Outstanding dues" value={`₹${outstanding.toLocaleString("en-IN")}`} tone="warning" />
        <StatCard icon={AlertTriangle} label="Overdue amount" value={`₹${overdue.toLocaleString("en-IN")}`} tone="danger" />
        <StatCard icon={CircleDollarSign} label="Payments this month" value={`₹${monthPayments.toLocaleString("en-IN")}`} tone="info" />
        <StatCard icon={Clock3} label="Partial payments" value={String(partialCount)} tone="primary" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><div><CardTitle>Recent payments</CardTitle><p className="mt-1 text-sm text-muted-foreground">Latest receipts recorded by your team</p></div><Link className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary" href="/payments/history">View all <ArrowRight className="size-4" /></Link></CardHeader>
          <CardContent className="divide-y divide-border">
            {recentPayments.map((payment) => {
              const customer = customerById.get(payment.customerId);
              const invoice = invoiceById.get(payment.invoiceId);
              const MethodIcon = methodIcon[payment.method];
              return (
                <div className="flex items-center gap-3 py-4 first:pt-0 last:pb-0" key={payment.id}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success-soft text-success"><MethodIcon className="size-5" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold">{customer?.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{invoice?.invoiceNumber} · {formatDateTime(payment.paymentDate)}</p></div>
                  <div className="text-right"><CurrencyDisplay amount={payment.amount} className="font-bold" /><p className="mt-1 text-xs capitalize text-muted-foreground">{payment.method.replaceAll("_", " ")}</p></div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment methods</CardTitle><p className="mt-1 text-sm text-muted-foreground">Collected amount by method</p></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(methodTotals).map(([method, amount]) => {
              const MethodIcon = methodIcon[method as keyof typeof methodIcon] ?? WalletCards;
              const percent = collected ? Math.round((amount / collected) * 100) : 0;
              return <div className="rounded-lg border border-border p-3" key={method}><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><MethodIcon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold capitalize">{method.replaceAll("_", " ")}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></div><div className="text-right"><CurrencyDisplay amount={amount} className="text-sm font-bold" /><p className="text-xs text-muted-foreground">{percent}%</p></div></div></div>;
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><div><CardTitle>Outstanding invoices</CardTitle><p className="mt-1 text-sm text-muted-foreground">Prioritise overdue and larger balances</p></div><Link className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary" href="/payments/outstanding">View all <ArrowRight className="size-4" /></Link></CardHeader>
          <CardContent className="space-y-3">
            {outstandingInvoices.map((invoice) => {
              const customer = customerById.get(invoice.customerId);
              return <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center" key={invoice.id}><div className="min-w-0 flex-1"><p className="font-semibold">{customer?.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{invoice.invoiceNumber} · {customer?.mobile}</p></div><InvoiceStatusBadge status={invoice.status} /><CurrencyDisplay amount={invoice.balanceDue} className="font-bold" /><Link className={buttonStyles({ size: "sm" })} href={`/payments/record?invoiceId=${invoice.id}&customerId=${invoice.customerId}`}>Record</Link></div>;
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Collection health</CardTitle><p className="mt-1 text-sm text-muted-foreground">Connected invoice balances</p></CardHeader>
          <CardContent><div className="rounded-lg bg-success-soft p-4 text-success"><p className="text-xs font-semibold uppercase tracking-wide">Collection rate</p><p className="mt-1 text-3xl font-bold">{Math.round((collected / (collected + outstanding)) * 100)}%</p><p className="mt-2 text-xs leading-5">Based on currently connected invoice and payment records.</p></div><div className="mt-4 grid grid-cols-2 gap-3"><Link className={buttonStyles({ variant: "outline", size: "sm", block: true })} href="/payment-reminders">Reminders</Link><Link className={buttonStyles({ variant: "outline", size: "sm", block: true })} href="/payments/outstanding">Outstanding</Link></div></CardContent>
        </Card>
      </section>
    </div>
  );
}
