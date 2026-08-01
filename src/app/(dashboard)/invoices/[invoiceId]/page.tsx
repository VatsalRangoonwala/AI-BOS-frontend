import { CheckCircle2, Clock3, CreditCard, FileText, Send, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InvoiceActions, InvoicePreview } from "@/components/invoices";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, CurrencyDisplay, PaymentStatusBadge, buttonStyles } from "@/components/ui";
import { currentBusiness, customers, invoices, orders, payments } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

type InvoiceDetailPageProps = { params: Promise<{ invoiceId: string }> };

export function generateStaticParams() {
  return invoices.map((invoice) => ({ invoiceId: invoice.id }));
}

export async function generateMetadata({ params }: InvoiceDetailPageProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const invoice = invoices.find((candidate) => candidate.id === invoiceId);
  return { title: invoice?.invoiceNumber ?? "Invoice not found" };
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { invoiceId } = await params;
  const invoice = invoices.find((candidate) => candidate.id === invoiceId);
  if (!invoice) notFound();
  const customer = customers.find((candidate) => candidate.id === invoice.customerId);
  if (!customer) notFound();
  const invoicePayments = payments.filter((payment) => payment.invoiceId === invoice.id);
  const order = orders.find((candidate) => candidate.id === invoice.orderId);

  return (
    <div className="app-page-enter space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Invoices", href: "/invoices" }, { label: invoice.invoiceNumber }]} />
        <PageHeader
          eyebrow="Invoice details"
          title={invoice.invoiceNumber}
          description={`${customer.fullName} · Created ${formatDateTime(invoice.createdAt)}`}
        />
      </div>

      <InvoiceActions customerName={customer.fullName} invoice={invoice} />
      <InvoicePreview business={currentBusiness} customer={customer} invoice={invoice} />

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Payment history</CardTitle><p className="mt-1 text-sm text-muted-foreground">Receipts connected to this invoice</p></div>
            {invoice.balanceDue > 0 ? <Link className={buttonStyles({ size: "sm" })} href={`/payments/record?invoiceId=${invoice.id}&customerId=${invoice.customerId}`}><CreditCard className="size-4" /> Record payment</Link> : null}
          </CardHeader>
          <CardContent>
            {invoicePayments.length ? (
              <div className="divide-y divide-border">
                {invoicePayments.map((payment) => (
                  <div className="flex items-center gap-3 py-4 first:pt-0 last:pb-0" key={payment.id}>
                    <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 className="size-5" /></span>
                    <div className="min-w-0 flex-1"><p className="font-semibold capitalize">{payment.method.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-muted-foreground">{formatDateTime(payment.paymentDate)} · {payment.referenceNumber ?? "No reference"}</p></div>
                    <div className="text-right"><CurrencyDisplay amount={payment.amount} className="font-bold" /><div className="mt-1"><PaymentStatusBadge status={payment.status} /></div></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">No payments have been recorded for this invoice.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Invoice timeline</CardTitle><p className="mt-1 text-sm text-muted-foreground">A clear audit trail of invoice activity</p></CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {[
                { icon: FileText, title: "Invoice created", detail: formatDateTime(invoice.createdAt), tone: "bg-primary-soft text-primary" },
                { icon: Send, title: `Delivery ${invoice.deliveryStatus.replaceAll("_", " ")}`, detail: formatDateTime(invoice.updatedAt), tone: "bg-info-soft text-info" },
                ...(invoicePayments.length ? [{ icon: CreditCard, title: `${invoicePayments.length} payment${invoicePayments.length > 1 ? "s" : ""} recorded`, detail: `${invoice.amountPaid.toLocaleString("en-IN")} collected`, tone: "bg-success-soft text-success" }] : []),
                { icon: Clock3, title: invoice.balanceDue > 0 ? "Balance remains due" : "Invoice fully paid", detail: invoice.balanceDue > 0 ? `₹${invoice.balanceDue.toLocaleString("en-IN")} due` : formatDateTime(invoice.updatedAt), tone: invoice.balanceDue > 0 ? "bg-warning-soft text-warning" : "bg-success-soft text-success" },
              ].map((item, index) => (
                <li className="flex gap-3" key={`${item.title}-${index}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full ${item.tone}`}><item.icon className="size-4" /></span><div><p className="text-sm font-semibold capitalize">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div></li>
              ))}
            </ol>
            {order ? <Link className="mt-5 flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted" href={`/orders/${order.id}`}><ShoppingBag className="size-5 text-primary" /><span><span className="block text-sm font-semibold">Linked order {order.orderNumber}</span><span className="mt-1 block text-xs text-muted-foreground">Open the originating order and its status timeline</span></span></Link> : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
