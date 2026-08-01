import { Clock3, Construction } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemActionButton, SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Scheduled maintenance" };

export default function MaintenancePage() {
  return (
    <SystemState
      icon={Construction}
      eyebrow="Planned maintenance"
      title="We’re making AI-BOS more reliable"
      description="The workspace is temporarily unavailable while a scheduled update is applied. No action is required from you."
      tone="info"
      details={<div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-info-soft text-info"><Clock3 className="size-5" /></span><div><p className="text-sm font-semibold">Expected availability</p><p className="mt-1 text-xs text-muted-foreground">Service is expected to return within 15 minutes. Existing data remains protected.</p></div></div>}
      actions={<><SystemActionButton action="reload" label="Check again" /><Link href="/support" className={buttonStyles({ variant: "outline" })}>Contact support</Link></>}
      reference="MAINT-2026-08-01"
    />
  );
}
