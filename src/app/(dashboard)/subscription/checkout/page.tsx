import { Check, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { Breadcrumbs, PageHeader } from "@/components/shared";
import { CheckoutAction } from "@/components/subscription";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Secure checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string }> }) {
  const params = await searchParams;
  const premium = params.plan !== "pro";
  const monthly = params.billing === "monthly";
  const plan = premium ? "Premium" : "Pro";
  const base = premium ? (monthly ? 1999 : 1599 * 12) : (monthly ? 999 : 799 * 12);
  const tax = Math.round(base * 0.18);
  const total = base + tax;
  return (
    <div className="app-page-enter mx-auto max-w-5xl space-y-6"><div><Breadcrumbs items={[{ label: "Subscription", href: "/subscription" }, { label: "Plans", href: "/subscription/plans" }, { label: "Checkout" }]} /><PageHeader eyebrow="Razorpay checkout demo" title="Complete your upgrade" description="Review your plan and confirm the frontend-only payment simulation." /></div><div className="grid gap-5 lg:grid-cols-[1fr_22rem]"><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Payment method</CardTitle><Badge variant="info">Razorpay placeholder</Badge></div></CardHeader><CardContent className="space-y-4"><div className="rounded-xl border-2 border-primary bg-primary-soft/30 p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><CreditCard className="size-5" /></span><div><p className="font-semibold">HDFC Visa ending in 4242</p><p className="mt-1 text-xs text-muted-foreground">Saved mock payment method · Expires 08/29</p></div><Check className="ml-auto size-5 text-primary" /></div></div><div className="rounded-xl border border-dashed border-border-strong p-5 text-center"><LockKeyhole className="mx-auto size-6 text-muted-foreground" /><p className="mt-2 text-sm font-semibold">No real payment details collected</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A secure Razorpay checkout would replace this area when a backend is connected.</p></div><div className="flex gap-3 rounded-xl bg-success-soft p-4 text-sm text-success"><ShieldCheck className="size-5 shrink-0" /><p><strong>Secure payment simulation.</strong><br />No card, UPI or bank request will be created.</p></div></CardContent></Card><Card className="h-fit"><CardHeader><CardTitle>Order summary</CardTitle></CardHeader><CardContent><div className="rounded-xl bg-primary-soft p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Selected plan</p><p className="mt-1 text-xl font-bold">{plan}</p><p className="mt-1 text-xs text-muted-foreground">{monthly ? "Monthly" : "Yearly"} billing</p></div><dl className="my-5 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Plan subtotal</dt><dd className="font-semibold">{formatINR(base)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Tax (18%)</dt><dd className="font-semibold">{formatINR(tax)}</dd></div><div className="flex justify-between border-t border-border pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatINR(total)}</dd></div></dl><CheckoutAction total={formatINR(total)} plan={plan} /><p className="mt-3 text-center text-[0.68rem] leading-5 text-muted-foreground">By continuing, you agree to the subscription terms.</p></CardContent></Card></div></div>
  );
}
