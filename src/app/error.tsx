"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { StandaloneFrame, SystemState } from "@/components/system";
import { Button, buttonStyles } from "@/components/ui";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <StandaloneFrame>
      <SystemState
        icon={AlertTriangle}
        eyebrow="Unexpected application error"
        title="That page couldn’t finish loading"
        description="The problem may be temporary. Retry the page first; if it happens again, share the reference code with support."
        tone="danger"
        actions={<><Button type="button" onClick={() => unstable_retry()}>Try again</Button><Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>Return to dashboard</Link></>}
        reference={error.digest ?? "CLIENT-UNAVAILABLE"}
      />
    </StandaloneFrame>
  );
}
