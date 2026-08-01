"use client";

import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  PackageCheck,
  ShoppingBag,
  UserRound,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { OrderActions } from "@/components/orders/order-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CurrencyDisplay,
  OrderStatusBadge,
  PaymentStatusBadge,
  buttonStyles,
} from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Customer, Invoice, Order, OrderStatus } from "@/types";

const statusDetails: Record<OrderStatus, { title: string; detail: string; icon: LucideIcon; tone: string }> = {
  draft: { title: "Awaiting confirmation", detail: "Stock is not reserved", icon: Clock3, tone: "bg-muted text-muted-foreground" },
  pending: { title: "Order pending", detail: "Waiting for the next fulfilment step", icon: Clock3, tone: "bg-warning-soft text-warning" },
  confirmed: { title: "Order confirmed", detail: "Stock checked for fulfilment", icon: PackageCheck, tone: "bg-info-soft text-info" },
  processing: { title: "Order processing", detail: "Products are being prepared", icon: PackageCheck, tone: "bg-primary-soft text-primary" },
  completed: { title: "Order completed", detail: "Fulfilment is complete", icon: CheckCircle2, tone: "bg-success-soft text-success" },
  cancelled: { title: "Order cancelled", detail: "Reserved stock has been released", icon: XCircle, tone: "bg-danger-soft text-danger" },
};

export function OrderDetail({ order, customer, invoice }: { order: Order; customer: Customer; invoice?: Invoice }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [statusChanged, setStatusChanged] = useState(false);
  const currentStatus = statusDetails[status];

  const updateStatus = (nextStatus: OrderStatus) => {
    setStatus(nextStatus);
    setStatusChanged(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2"><OrderStatusBadge status={status} /><PaymentStatusBadge status={order.paymentStatus} /></div>
        <OrderActions order={order} status={status} onStatusChange={updateStatus} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]">
        <Card>
          <CardHeader><CardTitle>Order products</CardTitle><p className="mt-1 text-sm text-muted-foreground">{order.items.length} product line{order.items.length === 1 ? "" : "s"}</p></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="pb-3">Product</th><th className="pb-3 text-right">Quantity</th><th className="pb-3 text-right">Price</th><th className="pb-3 text-right">Discount</th><th className="pb-3 text-right">Total</th></tr></thead>
                <tbody>{order.items.map((item) => <tr className="border-b border-border last:border-0" key={item.id}><td className="py-4"><p className="font-semibold">{item.productName}</p><p className="mt-1 text-xs text-muted-foreground">{item.sku}</p></td><td className="py-4 text-right">{item.quantity}</td><td className="py-4 text-right"><CurrencyDisplay amount={item.unitPrice} /></td><td className="py-4 text-right"><CurrencyDisplay amount={item.discount} /></td><td className="py-4 text-right font-bold"><CurrencyDisplay amount={item.lineTotal} /></td></tr>)}</tbody>
              </table>
            </div>
            <dl className="mt-5 ml-auto max-w-xs space-y-2 border-t border-border pt-4 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd><CurrencyDisplay amount={order.subtotal} /></dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− <CurrencyDisplay amount={order.discount} /></dd></div><div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><dt>Total</dt><dd><CurrencyDisplay amount={order.total} /></dd></div></dl>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><UserRound className="size-5" /></span><div><p className="font-semibold">{customer.fullName}</p><p className="mt-1 text-sm text-muted-foreground">{customer.mobile}</p><p className="text-sm text-muted-foreground">{customer.email}</p></div></div>
              <Link className={buttonStyles({ variant: "outline", size: "sm", block: true, className: "mt-4" })} href={`/customers/${customer.id}`}>View customer profile</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Order summary</CardTitle></CardHeader>
            <CardContent><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Order date</dt><dd className="font-medium">{formatDate(order.orderDate)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Payment</dt><dd><PaymentStatusBadge status={order.paymentStatus} /></dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Order status</dt><dd><OrderStatusBadge status={status} /></dd></div>{invoice ? <div className="flex justify-between"><dt className="text-muted-foreground">Invoice</dt><dd><Link className="font-semibold text-primary" href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link></dd></div> : null}</dl>{order.notes ? <div className="mt-4 rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground">{order.notes}</div> : null}</CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle>Status timeline</CardTitle><p className="mt-1 text-sm text-muted-foreground">Progress and connected billing activity</p></CardHeader>
        <CardContent>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
            {[
              { icon: ShoppingBag, title: "Order created", detail: formatDateTime(order.createdAt), tone: "bg-primary-soft text-primary" },
              { icon: currentStatus.icon, title: currentStatus.title, detail: statusChanged ? `${currentStatus.detail} · Updated just now` : currentStatus.detail, tone: currentStatus.tone },
              { icon: invoice ? FileText : Clock3, title: invoice ? `Invoice ${invoice.invoiceNumber}` : "Invoice not created", detail: invoice ? formatDateTime(invoice.createdAt) : "Create one when ready to bill", tone: invoice ? "bg-success-soft text-success" : "bg-muted text-muted-foreground" },
              { icon: order.paymentStatus === "paid" ? CheckCircle2 : CircleDollarSign, title: order.paymentStatus === "paid" ? "Payment complete" : "Payment outstanding", detail: order.paymentStatus.replaceAll("_", " "), tone: order.paymentStatus === "paid" ? "bg-success-soft text-success" : "bg-warning-soft text-warning" },
            ].map((item) => <li className="flex gap-3" key={item.title}><span className={`grid size-10 shrink-0 place-items-center rounded-full ${item.tone}`}><item.icon className="size-5" /></span><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p></div></li>)}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
