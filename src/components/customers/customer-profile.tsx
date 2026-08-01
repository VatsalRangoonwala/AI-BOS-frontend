import { CalendarClock, CircleCheck, FileText, IndianRupee, ShoppingBag, StickyNote, UserRound, WalletCards, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { CustomerActions } from "@/components/customers/customer-actions";
import {
  Badge,
  Card,
  CardContent,
  CurrencyDisplay,
  EmptyState,
  InvoiceStatusBadge,
  OrderStatusBadge,
  PaymentStatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  buttonStyles,
} from "@/components/ui";
import { formatDate, formatDateTime, formatINR, getInitials } from "@/lib/utils";
import type { Customer, CustomerLedgerEntry, Invoice, Order, Payment } from "@/types";

type CustomerProfileProps = {
  customer: Customer;
  ledger: CustomerLedgerEntry[];
  invoices: Invoice[];
  orders: Order[];
  payments: Payment[];
};

function SummaryCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return <Card><CardContent className="flex items-start gap-3 p-4 sm:p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div></CardContent></Card>;
}

export function CustomerProfile({ customer, ledger, invoices, orders, payments }: CustomerProfileProps) {
  const hasOverdue = invoices.some((invoice) => invoice.status === "overdue");
  const reliability = hasOverdue ? "Needs follow-up" : customer.outstandingBalance > 0 ? "Usually on time" : "Excellent";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-lg font-bold text-primary">{getInitials(customer.fullName)}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-2xl font-bold tracking-tight">{customer.fullName}</h1><Badge dot variant={customer.status === "active" ? "success" : "neutral"}>{customer.status === "active" ? "Active" : "Inactive"}</Badge></div>
              <p className="mt-1 text-sm text-muted-foreground">{customer.mobile}{customer.email ? ` · ${customer.email}` : ""}</p>
              <p className="mt-2 text-sm"><span className="text-muted-foreground">Outstanding:</span> <CurrencyDisplay amount={customer.outstandingBalance} className={customer.outstandingBalance > 0 ? "font-bold text-danger" : "font-bold text-success"} /></p>
            </div>
          </div>
          <CustomerActions customerId={customer.id} customerName={customer.fullName} outstandingBalance={customer.outstandingBalance} />
        </div>
      </section>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          {[["overview", "Overview"], ["ledger", "Ledger"], ["invoices", "Invoices"], ["orders", "Orders"], ["payments", "Payments"], ["notes", "Notes"]].map(([value, label]) => <TabsTrigger value={value} key={value}>{label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="overview" className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total purchases" value={formatINR(customer.totalPurchases)} note={`${invoices.length} invoices`} icon={ShoppingBag} />
            <SummaryCard label="Total paid" value={formatINR(customer.totalPaid)} note={`${payments.length} payments`} icon={WalletCards} />
            <SummaryCard label="Outstanding" value={formatINR(customer.outstandingBalance)} note={customer.outstandingBalance ? "Follow-up recommended" : "Nothing due"} icon={IndianRupee} />
            <SummaryCard label="Last purchase" value={formatDate(customer.lastTransactionAt, { day: "numeric", month: "short" })} note="Latest account activity" icon={CalendarClock} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card><CardContent className="p-5 sm:p-6"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-xl ${hasOverdue ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}><CircleCheck className="size-5" /></span><div><p className="text-xs font-medium text-muted-foreground">Payment reliability</p><p className="mt-1 font-semibold">{reliability}</p></div></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Based on connected invoice due dates and recorded payments in this workspace.</p></CardContent></Card>
            <Card><CardContent className="p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-info-soft text-info"><UserRound className="size-5" /></span><div><p className="text-xs font-medium text-muted-foreground">Contact details</p><p className="mt-1 font-semibold">{customer.city}</p></div></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{customer.address?.line1 ?? "No street address saved"}{customer.address ? `, ${customer.address.city}, ${customer.address.state} ${customer.address.pinCode}` : ""}</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="ledger">
          {ledger.length ? <Card className="overflow-hidden"><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Transaction</th><th className="px-4 py-3 text-right">Debit</th><th className="px-4 py-3 text-right">Credit</th><th className="px-4 py-3 text-right">Balance</th></tr></thead><tbody>{ledger.map((entry) => <tr key={entry.id} className="border-b border-border last:border-0"><td className="px-4 py-4 text-muted-foreground">{formatDateTime(entry.date)}</td><td className="px-4 py-4"><p className="font-medium">{entry.description}</p><p className="mt-1 text-xs text-muted-foreground">{entry.referenceNumber}</p></td><td className="px-4 py-4 text-right">{entry.debit ? formatINR(entry.debit) : "—"}</td><td className="px-4 py-4 text-right text-success">{entry.credit ? formatINR(entry.credit) : "—"}</td><td className="px-4 py-4 text-right font-semibold">{formatINR(entry.runningBalance)}</td></tr>)}</tbody></table></div><div className="divide-y divide-border md:hidden">{ledger.map((entry) => <article key={entry.id} className="p-4"><div className="flex justify-between gap-3"><div><p className="font-medium">{entry.description}</p><p className="mt-1 text-xs text-muted-foreground">{formatDateTime(entry.date)}</p></div><p className="font-semibold">{formatINR(entry.runningBalance)}</p></div><div className="mt-3 flex gap-4 text-xs"><span>Debit {entry.debit ? formatINR(entry.debit) : "—"}</span><span className="text-success">Credit {entry.credit ? formatINR(entry.credit) : "—"}</span></div></article>)}</div></Card> : <EmptyState icon={FileText} title="No ledger entries" description="Invoices and payments will create a connected ledger automatically." />}
        </TabsContent>

        <TabsContent value="invoices"><RecordList empty="No invoices for this customer" items={invoices.map((invoice) => ({ id: invoice.id, href: `/invoices/${invoice.id}`, title: invoice.invoiceNumber, detail: `Issued ${formatDate(invoice.invoiceDate)} · Due ${formatDate(invoice.dueDate)}`, amount: invoice.total, badge: <InvoiceStatusBadge status={invoice.status} /> }))} /></TabsContent>
        <TabsContent value="orders"><RecordList empty="No orders for this customer" items={orders.map((order) => ({ id: order.id, href: `/orders/${order.id}`, title: order.orderNumber, detail: `${order.items.length} item${order.items.length === 1 ? "" : "s"} · ${formatDate(order.orderDate)}`, amount: order.total, badge: <OrderStatusBadge status={order.status} /> }))} /></TabsContent>
        <TabsContent value="payments"><RecordList empty="No payments recorded" items={payments.map((payment) => ({ id: payment.id, href: `/invoices/${payment.invoiceId}`, title: payment.referenceNumber ?? "Payment", detail: `${payment.method.replace("_", " ")} · ${formatDateTime(payment.paymentDate)}`, amount: payment.amount, badge: <PaymentStatusBadge status={payment.status === "completed" ? "paid" : payment.status} /> }))} /></TabsContent>
        <TabsContent value="notes"><Card><CardContent className="p-6"><div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning"><StickyNote className="size-5" /></span><div><h2 className="font-semibold">Customer notes</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{customer.notes ?? "No notes have been added for this customer."}</p></div></div></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

function RecordList({ items, empty }: { items: Array<{ id: string; href: string; title: string; detail: string; amount: number; badge: React.ReactNode }>; empty: string }) {
  if (!items.length) return <EmptyState title={empty} description="New activity will appear here automatically." />;
  return <Card className="divide-y divide-border">{items.map((item) => <article key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3>{item.badge}</div><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><CurrencyDisplay amount={item.amount} className="font-bold" /><Link href={item.href} className={buttonStyles({ variant: "outline", size: "sm" })}>View</Link></div></article>)}</Card>;
}
