"use client";

import { AlertTriangle, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";

export function SubscriptionActions() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast({ title: "Payment method is secure", description: "A Razorpay card-update flow would open here in production.", variant: "info" })}><CreditCard className="size-4" />Update payment method</Button>
      <Dialog>
        <DialogTrigger asChild><Button variant="ghost" className="text-danger">Cancel subscription</Button></DialogTrigger>
        <DialogContent><DialogHeader><span className="grid size-11 place-items-center rounded-xl bg-warning-soft text-warning"><AlertTriangle className="size-5" /></span><DialogTitle>Cancel your Pro subscription?</DialogTitle><DialogDescription>You will keep Pro features until 14 February 2027. After that, invoice and AI limits will return to the Free plan.</DialogDescription></DialogHeader><div className="rounded-xl bg-muted p-4 text-sm"><p className="font-semibold">What changes after cancellation</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground"><li>AI allowance reduces to 20 actions</li><li>Advanced inventory is disabled</li><li>Your existing business records stay safe</li></ul></div><DialogFooter><DialogClose asChild><Button variant="outline">Keep Pro</Button></DialogClose><DialogClose asChild><Button variant="destructive" onClick={() => toast({ title: "Cancellation scheduled", description: "Your plan remains active until the end of the billing period.", variant: "warning" })}>Confirm cancellation</Button></DialogClose></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}

export function CheckoutAction({ total, plan }: { total: string; plan: string }) {
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pay = () => { setProcessing(true); window.setTimeout(() => { setProcessing(false); setOpen(false); router.push("/subscription/success"); }, 1200); };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button block size="lg"><ShieldCheck className="size-4.5" />Continue to secure payment</Button></DialogTrigger>
      <DialogContent><DialogHeader><span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><ShieldCheck className="size-5" /></span><DialogTitle>Confirm {plan} upgrade</DialogTitle><DialogDescription>This is a frontend-only Razorpay simulation. No real payment will be charged.</DialogDescription></DialogHeader><div className="flex items-center justify-between rounded-xl border border-border p-4"><span className="text-sm text-muted-foreground">Amount to authorise</span><strong className="text-lg">{total}</strong></div><DialogFooter><DialogClose asChild><Button variant="outline" disabled={processing}>Go back</Button></DialogClose><Button onClick={pay} disabled={processing}>{processing ? <><LoaderCircle className="size-4 animate-spin" />Processing mock payment…</> : "Confirm and pay"}</Button></DialogFooter></DialogContent>
    </Dialog>
  );
}
