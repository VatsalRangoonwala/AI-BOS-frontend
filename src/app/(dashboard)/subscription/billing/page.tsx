import { Download, ReceiptIndianRupee } from "lucide-react";
import type { Metadata } from "next";

import { Breadcrumbs, DataExplorer, PageHeader } from "@/components/shared";
import { Badge, Card, CardContent } from "@/components/ui";

export const metadata: Metadata = { title: "Billing history" };

const bills = [
  { id: "AIB-2026-0215", invoice: "AIB-2026-0215", date: "2026-02-15", plan: "Pro yearly", amount: 11314, method: "Visa •••• 4242", status: "Paid" },
  { id: "AIB-2025-0215", invoice: "AIB-2025-0215", date: "2025-02-15", plan: "Pro yearly", amount: 11314, method: "UPI", status: "Paid" },
];

export default function BillingPage() {
  return <div className="app-page-enter space-y-6"><div><Breadcrumbs items={[{ label: "Subscription", href: "/subscription" }, { label: "Billing" }]} /><PageHeader eyebrow="Receipts and invoices" title="Billing history" description="Review subscription charges and download mock receipts." actions={[{ label: "Download latest", href: "#billing-history", icon: Download, variant: "outline" }]} /></div><div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total paid</p><p className="mt-2 text-2xl font-bold">₹22,628</p></CardContent></Card><Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Next renewal</p><p className="mt-2 text-2xl font-bold">15 Feb 2027</p></CardContent></Card><Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Payment status</p><Badge variant="success" className="mt-2">Up to date</Badge></CardContent></Card></div><section id="billing-history"><DataExplorer rows={bills} columns={[{ key: "invoice", label: "Invoice", priority: "primary" }, { key: "date", label: "Date", format: "date" }, { key: "plan", label: "Plan" }, { key: "amount", label: "Amount", format: "currency", align: "right" }, { key: "method", label: "Payment method" }, { key: "status", label: "Status", format: "status" }]} searchKeys={["invoice", "plan", "method"]} searchPlaceholder="Search billing records…" /></section><div className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground"><ReceiptIndianRupee className="size-5 shrink-0 text-primary" />Receipts in this frontend demo do not represent real tax documents or payment transactions.</div></div>;
}
