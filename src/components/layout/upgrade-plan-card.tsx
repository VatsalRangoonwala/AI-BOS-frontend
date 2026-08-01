import { Sparkles } from "lucide-react";
import Link from "next/link";

export function UpgradePlanCard({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <Link href="/subscription/plans" className="mb-2 grid min-h-11 place-items-center rounded-xl bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-primary-foreground" aria-label="Upgrade plan" title="Upgrade plan">
        <Sparkles className="size-5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link href="/subscription/plans" className="mb-3 block rounded-2xl border border-primary/15 bg-primary-soft p-3.5 transition-colors hover:border-primary/30">
      <span className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" aria-hidden="true" />Upgrade to Premium</span>
      <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">Unlock team access and more AI actions.</span>
    </Link>
  );
}
