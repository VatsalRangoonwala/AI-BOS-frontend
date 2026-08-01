import type { Business, Customer, Invoice } from "@/types";
import {
  CurrencyDisplay,
  InvoiceDeliveryStatusBadge,
  InvoiceStatusBadge,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

export type InvoicePreviewProps = {
  invoice: Invoice;
  customer: Customer;
  business: Business;
};

export function InvoicePreview({
  invoice,
  customer,
  business,
}: InvoicePreviewProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-card print:border-0 print:shadow-none">
      <div className="border-b border-border bg-muted/40 p-5 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                AI
              </span>
              <div>
                <p className="text-lg font-bold">{business.name}</p>
                <p className="text-xs text-muted-foreground">AI-BOS business invoice</p>
              </div>
            </div>
            <address className="mt-4 max-w-sm text-sm not-italic leading-6 text-muted-foreground">
              {business.address.line1}
              {business.address.line2 ? `, ${business.address.line2}` : ""}<br />
              {business.address.city}, {business.address.state} {business.address.pinCode}<br />
              {business.mobile} · {business.email}
            </address>
            {business.taxIdentification ? (
              <p className="mt-2 text-xs text-muted-foreground">Tax ID: {business.taxIdentification}</p>
            ) : null}
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Invoice</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
            <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
              <InvoiceStatusBadge status={invoice.status} />
              <InvoiceDeliveryStatusBadge status={invoice.deliveryStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="grid gap-6 border-b border-border pb-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bill to</p>
            <p className="mt-2 font-semibold">{customer.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{customer.mobile}</p>
            {customer.email ? <p className="text-sm text-muted-foreground">{customer.email}</p> : null}
            {invoice.billingAddress ? (
              <address className="mt-2 text-sm not-italic leading-6 text-muted-foreground">
                {invoice.billingAddress.line1}<br />
                {invoice.billingAddress.city}, {invoice.billingAddress.state} {invoice.billingAddress.pinCode}
              </address>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:justify-self-end sm:min-w-72">
            <dt className="text-muted-foreground">Invoice date</dt>
            <dd className="text-right font-medium">{formatDate(invoice.invoiceDate)}</dd>
            <dt className="text-muted-foreground">Due date</dt>
            <dd className="text-right font-medium">{formatDate(invoice.dueDate)}</dd>
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="text-right font-medium">{invoice.reference ?? "—"}</dd>
          </dl>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="pb-3">Product</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Discount</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr className="border-b border-border last:border-0" key={item.id}>
                  <td className="py-4"><p className="font-medium">{item.productName}</p><p className="mt-1 text-xs text-muted-foreground">{item.sku}</p></td>
                  <td className="py-4 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-4 text-right"><CurrencyDisplay amount={item.unitPrice} /></td>
                  <td className="py-4 text-right"><CurrencyDisplay amount={item.discount} /></td>
                  <td className="py-4 text-right font-semibold"><CurrencyDisplay amount={item.lineTotal} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-6 border-t border-border pt-6 md:grid-cols-[1fr_20rem]">
          <div>
            {invoice.notes ? <><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{invoice.notes}</p></> : null}
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd><CurrencyDisplay amount={invoice.subtotal} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− <CurrencyDisplay amount={invoice.discount} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd><CurrencyDisplay amount={invoice.taxAmount} /></dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Grand total</dt><dd><CurrencyDisplay amount={invoice.total} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Amount paid</dt><dd className="text-success">− <CurrencyDisplay amount={invoice.amountPaid} /></dd></div>
            <div className="flex justify-between rounded-md bg-warning-soft px-3 py-2 font-bold text-warning"><dt>Balance due</dt><dd><CurrencyDisplay amount={invoice.balanceDue} /></dd></div>
          </dl>
        </div>
      </div>
    </article>
  );
}
