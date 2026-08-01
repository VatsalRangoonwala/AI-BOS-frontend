import { Router, WifiOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemActionButton, SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "You’re offline" };

export default function OfflinePage() {
  return (
    <SystemState
      icon={WifiOff}
      eyebrow="Connection unavailable"
      title="You’re offline"
      description="AI-BOS cannot reach the service right now. Your account is safe, but new records cannot be confirmed until the connection returns."
      tone="warning"
      details={<div className="flex gap-3"><Router className="mt-0.5 size-5 shrink-0 text-warning" /><div><p className="text-sm font-semibold">Before retrying</p><ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground"><li>Check Wi-Fi or mobile data.</li><li>Keep this tab open if it contains unsaved work.</li><li>Verify activity history before repeating a payment or stock update.</li></ul></div></div>}
      actions={<><SystemActionButton action="reload" label="Try again" /><Link href="/help/work-without-a-stable-connection" className={buttonStyles({ variant: "outline" })}>Offline help</Link></>}
    />
  );
}
