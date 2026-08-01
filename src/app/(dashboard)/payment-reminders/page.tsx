import { CalendarClock, CheckCircle2, MessageCircle, Plus } from "lucide-react";
import type { Metadata } from "next";

import { ReminderManager, type ReminderView } from "@/components/payments";
import { PageHeader, StatCard } from "@/components/shared";
import { customers, invoices, paymentReminders } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Payment reminders" };

export default function PaymentRemindersPage() {
  const reminders: ReminderView[] = paymentReminders.map((reminder) => {
    const customer = customers.find((candidate) => candidate.id === reminder.customerId)!;
    const invoice = invoices.find((candidate) => candidate.id === reminder.invoiceId)!;
    return {
      id: reminder.id,
      customerName: customer.fullName,
      mobile: customer.mobile,
      invoiceNumber: invoice.invoiceNumber,
      outstandingAmount: reminder.outstandingAmount,
      dueDate: reminder.dueDate,
      channel: reminder.channel,
      status: reminder.status,
      lastSentAt: reminder.lastSentAt,
      scheduledFor: reminder.scheduledFor,
      message: reminder.message,
    };
  });

  return (
    <div className="app-page-enter space-y-6">
      <PageHeader eyebrow="Collections" title="Payment reminders" description="Review, send and schedule friendly follow-ups across email, SMS and WhatsApp." actions={[{ label: "Outstanding balances", href: "/payments/outstanding", icon: Plus, variant: "outline" }]} />
      <section className="grid gap-3 sm:grid-cols-3"><StatCard icon={MessageCircle} label="All reminders" value={String(reminders.length)} tone="primary" /><StatCard icon={CalendarClock} label="Scheduled" value={String(reminders.filter((reminder) => reminder.status === "scheduled").length)} tone="info" /><StatCard icon={CheckCircle2} label="Sent" value={String(reminders.filter((reminder) => reminder.status === "sent" || reminder.status === "delivered").length)} tone="success" /></section>
      <ReminderManager reminders={reminders} />
    </div>
  );
}
