import { CalendarClock, MessageCircle } from "lucide-react";

import { ReminderAction } from "@/components/payments/reminder-actions";
import { Card, CurrencyDisplay, StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/utils";

export type ReminderView = {
  id: string;
  customerName: string;
  mobile: string;
  invoiceNumber: string;
  outstandingAmount: number;
  dueDate: string;
  channel: "email" | "sms" | "whatsapp";
  status: string;
  lastSentAt: string | null;
  scheduledFor: string | null;
  message: string;
};

const reminderTone: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  sent: "success",
  delivered: "success",
  scheduled: "info",
  failed: "danger",
  draft: "neutral",
  cancelled: "neutral",
};

export function ReminderManager({ reminders }: { reminders: ReminderView[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
          <thead><tr className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-4 py-3.5">Customer</th><th className="px-4 py-3.5">Invoice</th><th className="px-4 py-3.5 text-right">Outstanding</th><th className="px-4 py-3.5">Due</th><th className="px-4 py-3.5">Channel</th><th className="px-4 py-3.5">Last / scheduled</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Actions</th></tr></thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr className="border-b border-border last:border-0" key={reminder.id}>
                <td className="px-4 py-4"><p className="font-semibold">{reminder.customerName}</p><p className="mt-1 text-xs text-muted-foreground">{reminder.mobile}</p></td>
                <td className="px-4 py-4 font-medium">{reminder.invoiceNumber}</td>
                <td className="px-4 py-4 text-right font-bold"><CurrencyDisplay amount={reminder.outstandingAmount} /></td>
                <td className="px-4 py-4">{formatDate(reminder.dueDate)}</td>
                <td className="px-4 py-4 capitalize">{reminder.channel}</td>
                <td className="px-4 py-4 text-xs text-muted-foreground">{reminder.lastSentAt ? `Sent ${formatDateTime(reminder.lastSentAt)}` : reminder.scheduledFor ? `Scheduled ${formatDateTime(reminder.scheduledFor)}` : "Not sent"}</td>
                <td className="px-4 py-4"><StatusBadge label={reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)} tone={reminderTone[reminder.status] ?? "neutral"} /></td>
                <td className="px-4 py-4"><div className="flex justify-end gap-2"><ReminderAction amount={reminder.outstandingAmount} customerName={reminder.customerName} defaultChannel={reminder.channel} invoiceNumber={reminder.invoiceNumber} /><ReminderAction amount={reminder.outstandingAmount} customerName={reminder.customerName} defaultChannel={reminder.channel} invoiceNumber={reminder.invoiceNumber} mode="schedule" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {reminders.map((reminder) => (
          <article className="rounded-lg border border-border bg-background p-4" key={reminder.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-info-soft text-info">{reminder.channel === "whatsapp" ? <MessageCircle className="size-5" /> : <CalendarClock className="size-5" />}</span>
              <div className="min-w-0 flex-1"><p className="font-semibold">{reminder.customerName}</p><p className="mt-1 text-xs text-muted-foreground">{reminder.invoiceNumber} · {reminder.channel}</p></div>
              <StatusBadge label={reminder.status} tone={reminderTone[reminder.status] ?? "neutral"} />
            </div>
            <div className="mt-4 rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground">{reminder.message}</div>
            <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">Outstanding</p><CurrencyDisplay amount={reminder.outstandingAmount} className="mt-1 font-bold" /></div><p className="text-right text-xs text-muted-foreground">Due {formatDate(reminder.dueDate)}</p></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><ReminderAction amount={reminder.outstandingAmount} customerName={reminder.customerName} defaultChannel={reminder.channel} invoiceNumber={reminder.invoiceNumber} /><ReminderAction amount={reminder.outstandingAmount} customerName={reminder.customerName} defaultChannel={reminder.channel} invoiceNumber={reminder.invoiceNumber} mode="schedule" /></div>
          </article>
        ))}
      </div>
    </Card>
  );
}
