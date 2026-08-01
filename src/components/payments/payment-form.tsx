"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info, WalletCards } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { CustomerSelector } from "@/components/invoices";
import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CurrencyDisplay,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
  Textarea,
} from "@/components/ui";
import { saveMockRecord } from "@/lib/services/mock-service";
import type { Customer, Invoice } from "@/types";

const paymentSchema = z
  .object({
    customerId: z.string().min(1, "Select a customer"),
    invoiceId: z.string().min(1, "Select an invoice"),
    amount: z.number().positive("Enter an amount greater than zero"),
    paymentDate: z.string().min(1, "Choose a payment date"),
    method: z.enum(["cash", "upi", "card", "bank_transfer", "other"]),
    referenceNumber: z.string().trim().max(80, "Keep the reference under 80 characters"),
    notes: z.string().trim().max(400, "Keep notes under 400 characters"),
  })
  .superRefine((values, context) => {
    if (values.method !== "cash" && values.referenceNumber.length < 3) {
      context.addIssue({
        code: "custom",
        path: ["referenceNumber"],
        message: "Add a reference for non-cash payments",
      });
    }
  });

type PaymentFormValues = z.infer<typeof paymentSchema>;

export type PaymentFormProps = {
  customers: readonly Customer[];
  invoices: readonly Invoice[];
  defaultCustomerId?: string;
  defaultInvoiceId?: string;
};

export function PaymentForm({
  customers,
  invoices,
  defaultCustomerId,
  defaultInvoiceId,
}: PaymentFormProps) {
  const { toast } = useToast();
  const initialInvoice = invoices.find(
    (invoice) => invoice.id === defaultInvoiceId && invoice.balanceDue > 0,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PaymentFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerId: initialInvoice?.customerId ?? defaultCustomerId ?? "",
      invoiceId: initialInvoice?.id ?? "",
      amount: initialInvoice?.balanceDue ?? 0,
      paymentDate: "2026-08-01",
      method: "upi",
      referenceNumber: "",
      notes: "",
    },
  });

  const customerId = useWatch({ control, name: "customerId" });
  const invoiceId = useWatch({ control, name: "invoiceId" });
  const amount = useWatch({ control, name: "amount" }) ?? 0;
  const relatedInvoices = invoices.filter(
    (invoice) => invoice.customerId === customerId && invoice.balanceDue > 0,
  );
  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);
  const selectedCustomer = customers.find((customer) => customer.id === customerId);

  const reviewPayment = (values: PaymentFormValues) => {
    const invoice = invoices.find((candidate) => candidate.id === values.invoiceId);
    if (!invoice || invoice.customerId !== values.customerId) {
      setError("invoiceId", { message: "Choose an invoice belonging to this customer" });
      return;
    }
    if (values.amount > invoice.balanceDue) {
      setError("amount", { message: `Amount cannot exceed ₹${invoice.balanceDue.toLocaleString("en-IN")}` });
      return;
    }
    setPendingPayment(values);
    setConfirmOpen(true);
  };

  const confirmPayment = async () => {
    if (!pendingPayment) return;
    setSaving(true);
    const result = await saveMockRecord(pendingPayment, { delayMs: 700 });
    setSaving(false);
    if (!result.ok) {
      toast({ title: "Payment was not recorded", description: result.error.message, variant: "error" });
      return;
    }
    const invoice = invoices.find((candidate) => candidate.id === pendingPayment.invoiceId);
    toast({
      title: "Payment recorded",
      description: `₹${pendingPayment.amount.toLocaleString("en-IN")} was applied to ${invoice?.invoiceNumber ?? "the invoice"}.`,
      variant: "success",
    });
    setConfirmOpen(false);
    setPendingPayment(null);
    reset({
      ...pendingPayment,
      amount: 0,
      referenceNumber: "",
      notes: "",
    });
  };

  return (
    <>
      <form className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]" noValidate onSubmit={handleSubmit(reviewPayment)}>
        <Card>
          <CardHeader><CardTitle>Payment details</CardTitle><p className="text-sm text-muted-foreground">Apply a full or partial payment to an outstanding invoice.</p></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <CustomerSelector
                  customers={customers.filter((customer) => invoices.some((invoice) => invoice.customerId === customer.id && invoice.balanceDue > 0))}
                  error={errors.customerId?.message}
                  name={field.name}
                  onBlur={field.onBlur}
                  onValueChange={(customerId) => {
                    field.onChange(customerId);
                    setValue("invoiceId", "", { shouldValidate: true });
                    setValue("amount", 0);
                  }}
                  required
                  value={field.value}
                />
              )}
            />

            <Controller
              control={control}
              name="invoiceId"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="payment-invoice" required>Related invoice</FieldLabel>
                  <NativeSelect
                    id="payment-invoice"
                    invalid={Boolean(errors.invoiceId)}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      field.onChange(event);
                      const invoice = invoices.find((candidate) => candidate.id === event.target.value);
                      setValue("amount", invoice?.balanceDue ?? 0, { shouldValidate: true });
                    }}
                    value={field.value}
                  >
                    <option value="">Select an outstanding invoice</option>
                    {relatedInvoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} · ₹{invoice.balanceDue.toLocaleString("en-IN")} due
                      </option>
                    ))}
                  </NativeSelect>
                  {!customerId ? <FieldDescription>Select a customer first.</FieldDescription> : null}
                  {errors.invoiceId ? <FieldError>{errors.invoiceId.message}</FieldError> : null}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="payment-amount" required>Amount received</FieldLabel>
              <Input id="payment-amount" inputMode="decimal" invalid={Boolean(errors.amount)} min={0} step="0.01" type="number" {...register("amount", { valueAsNumber: true })} />
              {selectedInvoice ? (
                <FieldDescription>
                  Up to ₹{selectedInvoice.balanceDue.toLocaleString("en-IN")} can be applied. Partial payments are supported.
                </FieldDescription>
              ) : null}
              {errors.amount ? <FieldError>{errors.amount.message}</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="payment-date" required>Payment date</FieldLabel>
              <Input id="payment-date" type="date" {...register("paymentDate")} />
              {errors.paymentDate ? <FieldError>{errors.paymentDate.message}</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="payment-method" required>Payment method</FieldLabel>
              <NativeSelect id="payment-method" {...register("method")}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="other">Other</option>
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel htmlFor="payment-reference">Reference number</FieldLabel>
              <Input id="payment-reference" placeholder="UPI, receipt or bank reference" {...register("referenceNumber")} />
              <FieldDescription>Required for non-cash payments.</FieldDescription>
              {errors.referenceNumber ? <FieldError>{errors.referenceNumber.message}</FieldError> : null}
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="payment-notes">Notes</FieldLabel>
              <Textarea id="payment-notes" placeholder="Optional internal note" rows={3} {...register("notes")} />
              {errors.notes ? <FieldError>{errors.notes.message}</FieldError> : null}
            </Field>
          </CardContent>
        </Card>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader><CardTitle>Payment summary</CardTitle></CardHeader>
            <CardContent>
              {selectedInvoice ? (
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Customer</dt><dd className="mt-1 font-semibold">{selectedCustomer?.fullName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Invoice</dt><dd className="mt-1 font-semibold">{selectedInvoice.invoiceNumber}</dd></div>
                  <div className="flex justify-between border-t border-border pt-3"><dt className="text-muted-foreground">Outstanding</dt><dd><CurrencyDisplay amount={selectedInvoice.balanceDue} /></dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Receiving now</dt><dd className="font-semibold text-success"><CurrencyDisplay amount={amount} /></dd></div>
                  <div className="flex justify-between rounded-md bg-muted px-3 py-2 font-semibold"><dt>Remaining</dt><dd><CurrencyDisplay amount={Math.max(0, selectedInvoice.balanceDue - amount)} /></dd></div>
                </dl>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">Select an invoice to see its balance.</div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-2 rounded-lg border border-info/20 bg-info-soft p-4 text-sm text-info"><Info className="mt-0.5 size-4 shrink-0" /><p>No real money moves in this frontend-only payment flow.</p></div>
          <Button block leadingIcon={WalletCards} type="submit">Review payment</Button>
        </aside>
      </form>

      <Dialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm payment</DialogTitle>
            <DialogDescription>Review this financial action carefully before recording it.</DialogDescription>
          </DialogHeader>
          {pendingPayment ? (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 className="size-5" /></span>
                <div><p className="font-semibold">{selectedCustomer?.fullName}</p><p className="text-sm text-muted-foreground">{selectedInvoice?.invoiceNumber}</p></div>
                <CurrencyDisplay amount={pendingPayment.amount} className="ml-auto text-lg font-bold" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Method: {pendingPayment.method.replaceAll("_", " ")} · Date: {pendingPayment.paymentDate}</p>
            </div>
          ) : null}
          <DialogFooter>
            <DialogClose asChild><Button disabled={saving} variant="outline">Go back</Button></DialogClose>
            <Button isLoading={saving} leadingIcon={WalletCards} onClick={() => void confirmPayment()}>Record payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
