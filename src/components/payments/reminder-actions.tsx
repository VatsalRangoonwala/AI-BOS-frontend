"use client";

import { CalendarClock, Send } from "lucide-react";
import { useId, useState } from "react";

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
  Field,
  FieldLabel,
  Input,
  NativeSelect,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui";

export type ReminderActionProps = {
  customerName: string;
  invoiceNumber: string;
  amount: number;
  mode?: "send" | "schedule";
  defaultChannel?: "email" | "sms" | "whatsapp";
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function ReminderAction({
  customerName,
  invoiceNumber,
  amount,
  mode = "send",
  defaultChannel = "whatsapp",
  size = "sm",
  variant = "outline",
}: ReminderActionProps) {
  const { toast } = useToast();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState(defaultChannel);
  const [scheduledFor, setScheduledFor] = useState("2026-08-03T10:00");
  const Icon = mode === "send" ? Send : CalendarClock;

  return (
    <>
      <Button leadingIcon={Icon} onClick={() => setOpen(true)} size={size} variant={variant}>
        {mode === "send" ? "Send reminder" : "Schedule"}
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "send" ? "Send payment reminder now?" : "Schedule payment reminder"}</DialogTitle>
            <DialogDescription>
              {customerName} has ₹{amount.toLocaleString("en-IN")} outstanding on {invoiceNumber}. Confirm before contacting them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${id}-channel`}>Channel</FieldLabel>
              <NativeSelect id={`${id}-channel`} onChange={(event) => setChannel(event.target.value as typeof channel)} value={channel}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </NativeSelect>
            </Field>
            {mode === "schedule" ? (
              <Field>
                <FieldLabel htmlFor={`${id}-date`}>Send at</FieldLabel>
                <Input id={`${id}-date`} min="2026-08-01T00:00" onChange={(event) => setScheduledFor(event.target.value)} type="datetime-local" value={scheduledFor} />
              </Field>
            ) : null}
          </div>
          <div className="rounded-md bg-muted p-4 text-sm leading-6 text-muted-foreground">
            Hi {customerName}, a friendly reminder that ₹{amount.toLocaleString("en-IN")} is due for {invoiceNumber}. Please ignore this if already paid.
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Go back</Button></DialogClose>
            <Button leadingIcon={Icon} onClick={() => {
              toast({
                title: mode === "send" ? "Reminder queued" : "Reminder scheduled",
                description: mode === "send" ? `${invoiceNumber} will be sent via ${channel}.` : `${invoiceNumber} is scheduled for ${scheduledFor.replace("T", " ")} via ${channel}.`,
                variant: "success",
              });
              setOpen(false);
            }}>
              {mode === "send" ? "Confirm send" : "Confirm schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
