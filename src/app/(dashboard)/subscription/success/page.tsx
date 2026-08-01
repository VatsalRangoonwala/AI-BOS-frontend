import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonStyles, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Upgrade successful" };

export default function SubscriptionSuccessPage() {
  return <div className="mx-auto flex min-h-[65dvh] max-w-2xl items-center justify-center"><Card className="w-full p-6 text-center sm:p-10"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success-soft text-success"><CheckCircle2 className="size-8" /></span><p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-success">Mock payment successful</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Welcome to Premium</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Your simulated upgrade is complete. Team management, advanced analytics and WhatsApp tools are now shown as available.</p><div className="mt-6 rounded-xl bg-primary-soft p-4 text-left"><p className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-primary" />What to explore next</p><p className="mt-2 text-sm text-muted-foreground">Invite your team, review advanced analytics, or ask AI for a monthly business plan.</p></div><div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link href="/dashboard" className={buttonStyles()}>Go to dashboard <ArrowRight className="size-4" /></Link><Link href="/settings/team" className={buttonStyles({ variant: "outline" })}>Invite team</Link></div></Card></div>;
}
