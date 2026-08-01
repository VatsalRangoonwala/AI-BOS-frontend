"use client";

import { FilePlus2, MessageCircle, Pencil, WalletCards } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

type CustomerActionsProps = {
  customerId: string;
  customerName: string;
  outstandingBalance: number;
};

export function CustomerActions({ customerId, customerName, outstandingBalance }: CustomerActionsProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const sendReminder = () => {
    setOpen(false);
    toast({ title: "Reminder queued", description: `A WhatsApp payment reminder will be sent to ${customerName}.`, variant: "success" });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" leadingIcon={Pencil}><Link href={`/customers/${customerId}/edit`}>Edit</Link></Button>
      <Button asChild leadingIcon={FilePlus2}><Link href={`/invoices/new?customerId=${customerId}`}>Create invoice</Link></Button>
      <Button asChild variant="secondary" leadingIcon={WalletCards}><Link href={`/payments/record?customerId=${customerId}`}>Record payment</Link></Button>
      <Button type="button" variant="outline" leadingIcon={MessageCircle} disabled={outstandingBalance <= 0} onClick={() => setOpen(true)}>Send reminder</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send payment reminder?</DialogTitle>
            <DialogDescription>A friendly WhatsApp reminder will mention the customer’s current outstanding balance. No message is actually sent in this frontend demo.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" onClick={sendReminder}>Confirm and send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
