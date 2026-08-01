import { CalendarX2, CreditCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Subscription expired" };

export default function SubscriptionExpiredPage() {
  return (
    <SystemState
      icon={CalendarX2}
      eyebrow="Plan inactive"
      title="Your subscription has expired"
      description="Workspace data remains available, but paid tools are paused until the business renews or chooses another plan."
      tone="danger"
      details={<div className="flex gap-3"><CreditCard className="mt-0.5 size-5 shrink-0 text-destructive" /><div><p className="text-sm font-semibold">What happens next</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Renewal restores eligible features after payment is verified. Existing invoices, customers and inventory records are not deleted.</p></div></div>}
      actions={<><Link href="/subscription/plans" className={buttonStyles()}>View renewal options</Link><Link href="/support" className={buttonStyles({ variant: "outline" })}>Billing support</Link></>}
      reference="SUB-EXPIRED"
    />
  );
}
