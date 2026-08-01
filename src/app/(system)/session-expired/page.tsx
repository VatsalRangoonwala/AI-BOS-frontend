import { LogIn, TimerOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Session expired" };

export default function SessionExpiredPage() {
  return (
    <SystemState
      icon={TimerOff}
      eyebrow="Sign-in required"
      title="Your session has expired"
      description="For your security, AI-BOS signed this browser out after a period of inactivity. Sign in again to continue."
      tone="warning"
      details={<div className="flex gap-3"><LogIn className="mt-0.5 size-5 shrink-0 text-warning" /><p className="text-sm leading-6 text-muted-foreground">Unsaved changes may need to be entered again. After signing in, verify the relevant activity before repeating a transaction.</p></div>}
      actions={<><Link href="/login" className={buttonStyles()}>Sign in again</Link><Link href="/" className={buttonStyles({ variant: "outline" })}>Go to home page</Link></>}
    />
  );
}
