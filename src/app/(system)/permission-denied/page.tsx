import { KeyRound, ShieldX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemActionButton, SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Permission denied" };

export default function PermissionDeniedPage() {
  return (
    <SystemState
      icon={ShieldX}
      eyebrow="Access restricted"
      title="You don’t have permission to view this"
      description="Your account is signed in, but its current role does not include access to this part of the workspace."
      tone="danger"
      details={<div className="flex gap-3"><KeyRound className="mt-0.5 size-5 shrink-0 text-destructive" /><div><p className="text-sm font-semibold">Need access?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Ask a business owner or administrator to review your role and permissions. Support cannot grant workspace access on their behalf.</p></div></div>}
      actions={<><SystemActionButton action="back" label="Go back" /><Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>Return to dashboard</Link></>}
      reference="AUTHZ-403"
    />
  );
}
