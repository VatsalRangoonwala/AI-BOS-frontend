import { MapPinOff } from "lucide-react";
import Link from "next/link";

import { StandaloneFrame, SystemState } from "@/components/system";
import { buttonStyles } from "@/components/ui";

export default function NotFound() {
  return (
    <StandaloneFrame>
      <SystemState
        icon={MapPinOff}
        eyebrow="404 · Page not found"
        title="This page isn’t part of the workspace"
        description="The address may be outdated, the record may have moved, or the link may be incomplete."
        tone="info"
        actions={<><Link href="/dashboard" className={buttonStyles()}>Go to dashboard</Link><Link href="/help" className={buttonStyles({ variant: "outline" })}>Search help</Link></>}
      />
    </StandaloneFrame>
  );
}
