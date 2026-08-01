import { AlertCircle, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonStyles, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Payment failed" };

export default function SubscriptionFailedPage() {
  return <div className="mx-auto flex min-h-[65dvh] max-w-2xl items-center justify-center"><Card className="w-full p-6 text-center sm:p-10"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger-soft text-danger"><AlertCircle className="size-8" /></span><p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-danger">Payment not completed</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Your upgrade did not go through</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">No payment was charged in this simulation. Your current Pro plan and business data are unchanged.</p><div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link href="/subscription/checkout?plan=premium&billing=yearly" className={buttonStyles()}> <RefreshCw className="size-4" />Try again</Link><Link href="/support" className={buttonStyles({ variant: "outline" })}>Contact support</Link></div></Card></div>;
}
