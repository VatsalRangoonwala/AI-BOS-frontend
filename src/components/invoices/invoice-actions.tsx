"use client";

import {
  Ban,
  Download,
  Mail,
  MessageCircle,
  Pencil,
  Printer,
  Share2,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  buttonStyles,
} from "@/components/ui";
import type { Invoice } from "@/types";

type SendChannel = "email" | "whatsapp";

export function InvoiceActions({
  invoice,
  customerName,
}: {
  invoice: Invoice;
  customerName: string;
}) {
  const { toast } = useToast();
  const [sendChannel, setSendChannel] = useState<SendChannel | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const mockAction = (title: string, description: string) => {
    toast({ title, description, variant: "success" });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          className={buttonStyles({ variant: "outline", size: "sm" })}
          onClick={() => window.print()}
          type="button"
        >
          <Printer className="size-4" /> Print
        </button>
        <Button
          leadingIcon={Download}
          onClick={() => mockAction("PDF prepared", `${invoice.invoiceNumber}.pdf is ready in this mock flow.`)}
          size="sm"
          variant="outline"
        >
          Download PDF
        </Button>
        <Button
          leadingIcon={Share2}
          onClick={() => mockAction("Share link copied", "A secure mock invoice link was copied to the clipboard.")}
          size="sm"
          variant="outline"
        >
          Share
        </Button>
        <Button leadingIcon={Mail} onClick={() => setSendChannel("email")} size="sm" variant="outline">
          Email
        </Button>
        <Button leadingIcon={MessageCircle} onClick={() => setSendChannel("whatsapp")} size="sm" variant="outline">
          WhatsApp
        </Button>
        {invoice.balanceDue > 0 ? (
          <Link
            className={buttonStyles({ size: "sm" })}
            href={`/payments/record?invoiceId=${invoice.id}&customerId=${invoice.customerId}`}
          >
            <WalletCards className="size-4" /> Record payment
          </Link>
        ) : null}
        {invoice.status !== "cancelled" ? (
          <>
            <Link className={buttonStyles({ variant: "outline", size: "sm" })} href={`/invoices/${invoice.id}/edit`}>
              <Pencil className="size-4" /> Edit
            </Link>
            <Button leadingIcon={Ban} onClick={() => setCancelOpen(true)} size="sm" variant="ghost">
              Cancel invoice
            </Button>
          </>
        ) : null}
      </div>

      <Dialog onOpenChange={(open) => !open && setSendChannel(null)} open={Boolean(sendChannel)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send invoice via {sendChannel === "whatsapp" ? "WhatsApp" : "email"}?</DialogTitle>
            <DialogDescription>
              {invoice.invoiceNumber} will be queued for {customerName}. This demo does not contact the customer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Go back</Button></DialogClose>
            <Button
              leadingIcon={sendChannel === "whatsapp" ? MessageCircle : Mail}
              onClick={() => {
                mockAction("Invoice queued", `${invoice.invoiceNumber} was queued via ${sendChannel}.`);
                setSendChannel(null);
              }}
            >
              Confirm send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setCancelOpen} open={cancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel {invoice.invoiceNumber}?</DialogTitle>
            <DialogDescription>
              Cancelling preserves the audit trail but prevents further payments. This destructive action requires confirmation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Keep invoice</Button></DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                mockAction("Invoice cancelled", `${invoice.invoiceNumber} is marked cancelled in this mock flow.`);
                setCancelOpen(false);
              }}
            >
              Confirm cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
