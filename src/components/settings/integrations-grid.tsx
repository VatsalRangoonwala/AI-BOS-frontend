"use client";

import { Barcode, CheckCircle2, Cloud, CreditCard, Mail, MessageCircle, Printer, Unplug } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Badge, Button } from "@/components/ui";

const integrations = [
  { id: "whatsapp", name: "WhatsApp Business", description: "Send invoices and payment reminders", icon: MessageCircle, status: "Not connected", available: true },
  { id: "razorpay", name: "Razorpay", description: "Accept and reconcile online payments", icon: CreditCard, status: "Connected", available: true },
  { id: "resend", name: "Resend email", description: "Deliver invoices and account emails", icon: Mail, status: "Connected", available: true },
  { id: "barcode", name: "Barcode scanner", description: "Scan product codes with a supported device", icon: Barcode, status: "Not connected", available: true },
  { id: "printer", name: "Receipt printer", description: "Print compact receipts at the counter", icon: Printer, status: "Coming soon", available: false },
  { id: "cloud", name: "Cloud storage", description: "Back up reports and invoice files", icon: Cloud, status: "Coming soon", available: false },
];

export function IntegrationsGrid() {
  const [statuses, setStatuses] = useState(() => Object.fromEntries(integrations.map((item) => [item.id, item.status]))); const { toast } = useToast();
  const toggle = (id: string, name: string) => { const next = statuses[id] === "Connected" ? "Not connected" : "Connected"; setStatuses((current) => ({ ...current, [id]: next })); toast({ title: `${name} ${next.toLowerCase()}`, variant: next === "Connected" ? "success" : "default" }); };
  return <div className="grid gap-4 sm:grid-cols-2">{integrations.map((item) => { const status = statuses[item.id]; return <article key={item.id} className="rounded-xl border border-border p-5"><div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><item.icon className="size-5" /></span><div className="min-w-0 flex-1"><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p></div><Badge variant={status === "Connected" ? "success" : status === "Coming soon" ? "neutral" : "outline"}>{status}</Badge></div><div className="mt-5 border-t border-border pt-4">{item.available ? <Button variant={status === "Connected" ? "outline" : "primary"} size="sm" onClick={() => toggle(item.id, item.name)}>{status === "Connected" ? <><Unplug className="size-4" />Disconnect</> : <><CheckCircle2 className="size-4" />Connect</>}</Button> : <p className="text-xs text-muted-foreground">We’ll let you know when this integration is ready.</p>}</div></article>; })}</div>;
}
