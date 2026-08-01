import { ReceiptIndianRupee } from "lucide-react";
import Link from "next/link";

import { ReminderAction } from "@/components/payments/reminder-actions";
import {
  Card,
  CurrencyDisplay,
  InvoiceStatusBadge,
  buttonStyles,
} from "@/components/ui";
import { formatDate } from "@/lib/utils";

export type OutstandingPaymentRow = {
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  mobile: string;
  originalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  daysOverdue: number;
  status: string;
};

export function OutstandingPaymentsList({ rows }: { rows: OutstandingPaymentRow[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3.5">Customer</th>
              <th className="px-4 py-3.5">Invoice</th>
              <th className="px-4 py-3.5 text-right">Original</th>
              <th className="px-4 py-3.5 text-right">Paid</th>
              <th className="px-4 py-3.5 text-right">Balance</th>
              <th className="px-4 py-3.5">Due</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-border last:border-0" key={row.invoiceId}>
                <td className="px-4 py-4"><p className="font-semibold">{row.customerName}</p><p className="mt-1 text-xs text-muted-foreground">{row.mobile}</p></td>
                <td className="px-4 py-4"><Link className="font-semibold text-primary hover:underline" href={`/invoices/${row.invoiceId}`}>{row.invoiceNumber}</Link></td>
                <td className="px-4 py-4 text-right"><CurrencyDisplay amount={row.originalAmount} /></td>
                <td className="px-4 py-4 text-right text-success"><CurrencyDisplay amount={row.paidAmount} /></td>
                <td className="px-4 py-4 text-right font-bold"><CurrencyDisplay amount={row.balance} /></td>
                <td className="px-4 py-4"><p>{formatDate(row.dueDate)}</p><p className={`mt-1 text-xs ${row.daysOverdue > 0 ? "font-semibold text-destructive" : "text-muted-foreground"}`}>{row.daysOverdue > 0 ? `${row.daysOverdue} days overdue` : "Upcoming"}</p></td>
                <td className="px-4 py-4"><InvoiceStatusBadge status={row.status} /></td>
                <td className="px-4 py-4"><div className="flex justify-end gap-2"><ReminderAction amount={row.balance} customerName={row.customerName} invoiceNumber={row.invoiceNumber} /><Link className={buttonStyles({ size: "sm" })} href={`/payments/record?invoiceId=${row.invoiceId}&customerId=${row.customerId}`}>Record payment</Link></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {rows.map((row) => (
          <article className="rounded-lg border border-border bg-background p-4" key={row.invoiceId}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-warning-soft text-warning"><ReceiptIndianRupee className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="font-semibold">{row.customerName}</p><Link className="mt-1 block text-xs font-medium text-primary" href={`/invoices/${row.invoiceId}`}>{row.invoiceNumber}</Link></div>
              <CurrencyDisplay amount={row.balance} className="font-bold" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">Original</dt><dd className="mt-1 font-medium"><CurrencyDisplay amount={row.originalAmount} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">Paid</dt><dd className="mt-1 font-medium text-success"><CurrencyDisplay amount={row.paidAmount} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">Due date</dt><dd className="mt-1 font-medium">{formatDate(row.dueDate)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Status</dt><dd className="mt-1"><InvoiceStatusBadge status={row.status} /></dd></div>
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ReminderAction amount={row.balance} customerName={row.customerName} invoiceNumber={row.invoiceNumber} />
              <Link className={buttonStyles({ size: "sm", block: true })} href={`/payments/record?invoiceId=${row.invoiceId}&customerId=${row.customerId}`}>Record payment</Link>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
