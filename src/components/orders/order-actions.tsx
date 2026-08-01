"use client";

import { Ban, FilePlus2, RefreshCw } from "lucide-react";
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
  Field,
  FieldLabel,
  NativeSelect,
  buttonStyles,
} from "@/components/ui";
import type { Order, OrderStatus } from "@/types";

export function OrderActions({ order, status, onStatusChange }: { order: Order; status: OrderStatus; onStatusChange: (status: OrderStatus) => void }) {
  const { toast } = useToast();
  const [draftStatus, setDraftStatus] = useState<OrderStatus>(status);
  const [statusOpen, setStatusOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const openStatusDialog = () => {
    setDraftStatus(status);
    setStatusOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status !== "cancelled" ? (
          <Button leadingIcon={RefreshCw} onClick={openStatusDialog} size="sm">
            Update status
          </Button>
        ) : null}
        {status !== "cancelled" ? <Link className={buttonStyles({ variant: "outline", size: "sm" })} href={`/invoices/new?orderId=${order.id}`}>
          <FilePlus2 className="size-4" /> Create invoice
        </Link> : null}
        {status !== "cancelled" && status !== "completed" ? (
          <Button leadingIcon={Ban} onClick={() => setCancelOpen(true)} size="sm" variant="ghost">Cancel order</Button>
        ) : null}
      </div>

      <Dialog onOpenChange={setStatusOpen} open={statusOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update order status</DialogTitle><DialogDescription>Changing status adds an entry to the mock order timeline.</DialogDescription></DialogHeader>
          <Field>
            <FieldLabel htmlFor="next-order-status">New status</FieldLabel>
            <NativeSelect id="next-order-status" onChange={(event) => setDraftStatus(event.target.value as OrderStatus)} value={draftStatus}>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </NativeSelect>
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Go back</Button></DialogClose>
            <Button onClick={() => {
              onStatusChange(draftStatus);
              toast({ title: "Order status updated", description: `${order.orderNumber} is now ${draftStatus.replaceAll("_", " ")}.`, variant: "success" });
              setStatusOpen(false);
            }}>Confirm update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setCancelOpen} open={cancelOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel {order.orderNumber}?</DialogTitle><DialogDescription>Reserved stock will be released and the order can no longer be processed.</DialogDescription></DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Keep order</Button></DialogClose>
            <Button variant="destructive" onClick={() => {
              onStatusChange("cancelled");
              toast({ title: "Order cancelled", description: `${order.orderNumber} was cancelled in this mock flow.`, variant: "success" });
              setCancelOpen(false);
            }}>Confirm cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
