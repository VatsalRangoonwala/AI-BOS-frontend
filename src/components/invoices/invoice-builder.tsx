"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  FileCheck2,
  Info,
  Save,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, type BaseSyntheticEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { CustomerSelector } from "@/components/invoices/customer-selector";
import {
  getLineTotal,
  LineItemsEditor,
  type EditableLineItem,
} from "@/components/invoices/line-items-editor";
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
import type { Customer, Invoice, Order, Product } from "@/types";

const lineItemSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "Choose a product"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative"),
});

const invoiceBuilderSchema = z
  .object({
    customerId: z.string().min(1, "Select a customer"),
    invoiceNumber: z.string().trim().min(3, "Enter an invoice number"),
    invoiceDate: z.string().min(1, "Choose an invoice date"),
    dueDate: z.string().min(1, "Choose a due date"),
    reference: z.string().trim().max(80, "Keep the reference under 80 characters"),
    notes: z.string().trim().max(500, "Keep notes under 500 characters"),
    items: z.array(lineItemSchema).min(1, "Add at least one product"),
    discount: z.number().min(0, "Discount cannot be negative"),
    taxRate: z.number().min(0).max(100, "Tax rate cannot exceed 100%"),
    amountPaid: z.number().min(0, "Amount paid cannot be negative"),
  })
  .superRefine((values, context) => {
    if (values.dueDate < values.invoiceDate) {
      context.addIssue({
        code: "custom",
        path: ["dueDate"],
        message: "Due date must be on or after the invoice date",
      });
    }
  });

export type InvoiceBuilderValues = z.infer<typeof invoiceBuilderSchema>;
type SaveIntent = "draft" | "create" | "send";

export type InvoiceBuilderProps = {
  customers: readonly Customer[];
  products: readonly Product[];
  initialInvoice?: Invoice;
  initialCustomerId?: string;
  sourceOrder?: Order;
};

function defaultItems(products: readonly Product[]): EditableLineItem[] {
  const product = products.find((candidate) => candidate.currentStock > 0) ?? products[0];
  return product
    ? [
        {
          id: "line-initial",
          productId: product.id,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discount: 0,
        },
      ]
    : [];
}

function getDefaults(
  products: readonly Product[],
  initialInvoice?: Invoice,
  sourceOrder?: Order,
  initialCustomerId?: string,
): InvoiceBuilderValues {
  if (initialInvoice) {
    return {
      customerId: initialInvoice.customerId,
      invoiceNumber: initialInvoice.invoiceNumber,
      invoiceDate: initialInvoice.invoiceDate.slice(0, 10),
      dueDate: initialInvoice.dueDate.slice(0, 10),
      reference: initialInvoice.reference ?? "",
      notes: initialInvoice.notes ?? "",
      items: initialInvoice.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
      discount: initialInvoice.discount,
      taxRate: initialInvoice.taxRate,
      amountPaid: initialInvoice.amountPaid,
    };
  }

  if (sourceOrder) {
    return {
      customerId: sourceOrder.customerId,
      invoiceNumber: "SME-1045",
      invoiceDate: "2026-08-01",
      dueDate: "2026-08-08",
      reference: sourceOrder.orderNumber,
      notes: `Created from ${sourceOrder.orderNumber}.`,
      items: sourceOrder.items.map((item) => ({
        id: `invoice-${item.id}`,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
      discount: sourceOrder.discount,
      taxRate: 0,
      amountPaid: sourceOrder.paymentStatus === "paid" ? sourceOrder.total : 0,
    };
  }

  return {
    customerId: initialCustomerId ?? "",
    invoiceNumber: "SME-1045",
    invoiceDate: "2026-08-01",
    dueDate: "2026-08-08",
    reference: "",
    notes: "Thank you for your business.",
    items: defaultItems(products),
    discount: 0,
    taxRate: 0,
    amountPaid: 0,
  };
}

function InvoiceDraftPreview({
  values,
  customers,
  products,
}: {
  values: InvoiceBuilderValues;
  customers: readonly Customer[];
  products: readonly Product[];
}) {
  const customer = customers.find((candidate) => candidate.id === values.customerId);
  const subtotal = values.items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxable = Math.max(0, subtotal - values.discount);
  const tax = (taxable * values.taxRate) / 100;
  const total = taxable + tax;

  return (
    <div className="rounded-lg border border-border bg-background p-4 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Invoice preview</p>
          <h3 className="mt-2 text-2xl font-bold">{values.invoiceNumber}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Issued {values.invoiceDate} · Due {values.dueDate}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-semibold">{customer?.fullName ?? "Customer not selected"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{customer?.mobile}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {values.items.map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          return (
            <div className="flex items-start justify-between gap-4 text-sm" key={item.id}>
              <div>
                <p className="font-medium">{product?.name ?? "Product"}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")}</p>
              </div>
              <CurrencyDisplay amount={getLineTotal(item)} className="font-semibold" />
            </div>
          );
        })}
      </div>
      <dl className="mt-5 ml-auto max-w-xs space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd><CurrencyDisplay amount={subtotal} /></dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− <CurrencyDisplay amount={values.discount} /></dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Tax ({values.taxRate}%)</dt><dd><CurrencyDisplay amount={tax} /></dd></div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd><CurrencyDisplay amount={total} /></dd></div>
      </dl>
    </div>
  );
}

export function InvoiceBuilder({
  customers,
  products,
  initialInvoice,
  initialCustomerId,
  sourceOrder,
}: InvoiceBuilderProps) {
  const { toast } = useToast();
  const [sendOpen, setSendOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<InvoiceBuilderValues | null>(null);
  const [previewValues, setPreviewValues] = useState<InvoiceBuilderValues | null>(null);
  const [saving, setSaving] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<InvoiceBuilderValues>({
    resolver: zodResolver(invoiceBuilderSchema),
    defaultValues: getDefaults(products, initialInvoice, sourceOrder, initialCustomerId),
  });

  const stockAllowances = (initialInvoice?.items ?? sourceOrder?.items ?? []).reduce<
    Record<string, number>
  >((allowances, item) => {
    allowances[item.productId] = (allowances[item.productId] ?? 0) + item.quantity;
    return allowances;
  }, {});

  const items = useWatch({ control, name: "items" }) ?? [];
  const documentDiscount = useWatch({ control, name: "discount" }) ?? 0;
  const taxRate = useWatch({ control, name: "taxRate" }) ?? 0;
  const amountPaid = useWatch({ control, name: "amountPaid" }) ?? 0;
  const customerId = useWatch({ control, name: "customerId" });
  const customer = customers.find((candidate) => candidate.id === customerId);
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxableAmount = Math.max(0, subtotal - documentDiscount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;
  const balanceDue = Math.max(0, total - amountPaid);

  const validateStockAndTotals = (
    values: InvoiceBuilderValues,
    action: SaveIntent,
  ) => {
    if (values.discount > values.items.reduce((sum, item) => sum + getLineTotal(item), 0)) {
      setError("discount", { message: "Invoice discount cannot exceed the subtotal" });
      return false;
    }
    if (values.amountPaid > total) {
      setError("amountPaid", { message: "Amount paid cannot exceed the invoice total" });
      return false;
    }
    if (action !== "draft") {
      const unavailable = values.items.find((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return (
          !product ||
          item.quantity > product.currentStock + (stockAllowances[item.productId] ?? 0)
        );
      });
      if (unavailable) {
        setError("items", { message: "One or more lines exceed available stock" });
        toast({
          title: "Check product quantities",
          description: "Reduce the highlighted quantity before creating this invoice.",
          variant: "error",
        });
        return false;
      }
    }
    return true;
  };

  const save = async (values: InvoiceBuilderValues, action: SaveIntent) => {
    setSaving(true);
    const result = await saveMockRecord(values, { delayMs: 650 });
    setSaving(false);
    if (!result.ok) {
      toast({ title: "Invoice was not saved", description: result.error.message, variant: "error" });
      return;
    }
    toast({
      title:
        action === "draft"
          ? "Draft invoice saved"
          : action === "send"
            ? "Invoice created and queued to send"
            : initialInvoice
              ? "Invoice updated"
              : "Invoice created",
      description: `${values.invoiceNumber} for ${customers.find((candidate) => candidate.id === values.customerId)?.fullName ?? "the customer"} is ready.`,
      variant: "success",
    });
    setSendOpen(false);
  };

  const onSubmit = (
    values: InvoiceBuilderValues,
    event?: BaseSyntheticEvent,
  ) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | null | undefined;
    const action = (submitter?.value as SaveIntent | undefined) ?? "create";
    if (!validateStockAndTotals(values, action)) return;
    if (action === "send") {
      setPendingValues(values);
      setSendOpen(true);
      return;
    }
    void save(values, action);
  };

  const showPreview = handleSubmit((values) => {
    setPreviewValues(values);
    setPreviewOpen(true);
  });

  return (
    <>
      <form className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <p className="text-sm text-muted-foreground">Choose who will receive this invoice.</p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="customerId"
                render={({ field }) => (
                  <div className="space-y-2">
                    <CustomerSelector
                      customers={customers}
                      error={errors.customerId?.message}
                      name={field.name}
                      onBlur={field.onBlur}
                      onValueChange={field.onChange}
                      required
                      value={field.value}
                    />
                    <Button asChild size="sm" variant="link">
                      <Link href="/customers/new">Add a new customer</Link>
                    </Button>
                  </div>
                )}
              />
              <div className="rounded-md border border-border bg-muted/50 p-4 text-sm">
                <p className="font-semibold">Billing address</p>
                {customer?.address ? (
                  <address className="mt-2 not-italic leading-6 text-muted-foreground">
                    {customer.address.line1}<br />
                    {customer.address.line2 ? <>{customer.address.line2}<br /></> : null}
                    {customer.address.city}, {customer.address.state} {customer.address.pinCode}
                  </address>
                ) : (
                  <p className="mt-2 leading-6 text-muted-foreground">Select a customer to review their billing details.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Invoice details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="invoice-number" required>Invoice number</FieldLabel>
                <Input id="invoice-number" invalid={Boolean(errors.invoiceNumber)} {...register("invoiceNumber")} />
                {errors.invoiceNumber ? <FieldError>{errors.invoiceNumber.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-reference">Reference</FieldLabel>
                <Input id="invoice-reference" placeholder="Purchase order or order number" {...register("reference")} />
                {errors.reference ? <FieldError>{errors.reference.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-date" required>Invoice date</FieldLabel>
                <Input id="invoice-date" type="date" invalid={Boolean(errors.invoiceDate)} {...register("invoiceDate")} />
                {errors.invoiceDate ? <FieldError>{errors.invoiceDate.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-due-date" required>Due date</FieldLabel>
                <Input id="invoice-due-date" type="date" invalid={Boolean(errors.dueDate)} {...register("dueDate")} />
                {errors.dueDate ? <FieldError>{errors.dueDate.message}</FieldError> : null}
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="invoice-notes">Notes</FieldLabel>
                <Textarea id="invoice-notes" rows={3} {...register("notes")} />
                <FieldDescription>Payment terms or a short message for the customer.</FieldDescription>
                {errors.notes ? <FieldError>{errors.notes.message}</FieldError> : null}
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 sm:pt-6">
              <LineItemsEditor
                error={errors.items?.message}
                items={items}
                onChange={(nextItems) =>
                  setValue("items", nextItems, { shouldDirty: true, shouldValidate: true })
                }
                products={products}
                stockAllowances={stockAllowances}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader><CardTitle>Invoice total</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="invoice-discount">Invoice discount</FieldLabel>
                <Input id="invoice-discount" min={0} step="0.01" type="number" {...register("discount", { valueAsNumber: true })} />
                {errors.discount ? <FieldError>{errors.discount.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-tax">Tax rate</FieldLabel>
                <NativeSelect id="invoice-tax" {...register("taxRate", { valueAsNumber: true })}>
                  <option value="0">No tax</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </NativeSelect>
                <FieldDescription>Simple configurable tax only.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="amount-paid">Amount already paid</FieldLabel>
                <Input id="amount-paid" min={0} step="0.01" type="number" {...register("amountPaid", { valueAsNumber: true })} />
                {errors.amountPaid ? <FieldError>{errors.amountPaid.message}</FieldError> : null}
              </Field>

              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd><CurrencyDisplay amount={subtotal} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− <CurrencyDisplay amount={documentDiscount} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd><CurrencyDisplay amount={taxAmount} /></dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><dt>Grand total</dt><dd><CurrencyDisplay amount={total} /></dd></div>
                <div className="flex justify-between rounded-md bg-warning-soft px-3 py-2 font-semibold text-warning"><dt>Balance due</dt><dd><CurrencyDisplay amount={balanceDue} /></dd></div>
              </dl>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-info/20 bg-info-soft p-4 text-sm text-info">
            <div className="flex gap-2"><Info className="mt-0.5 size-4 shrink-0" /><p>Stock is checked before the invoice is created. Drafts do not reserve stock.</p></div>
          </div>

          <div className="grid gap-2">
            <Button isLoading={saving} leadingIcon={FileCheck2} name="intent" type="submit" value="create">
              {initialInvoice ? "Update invoice" : "Create invoice"}
            </Button>
            <Button disabled={saving} leadingIcon={Send} name="intent" type="submit" value="send" variant="secondary">
              {initialInvoice ? "Update and send" : "Create and send"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={saving} leadingIcon={Save} name="intent" type="submit" value="draft" variant="outline">Save draft</Button>
              <Button disabled={saving} leadingIcon={Eye} onClick={() => void showPreview()} type="button" variant="outline">Preview</Button>
            </div>
            <Button disabled={saving} leadingIcon={X} onClick={() => setCancelOpen(true)} type="button" variant="ghost">Cancel</Button>
          </div>
        </aside>
      </form>

      <Dialog onOpenChange={setPreviewOpen} open={previewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Invoice preview</DialogTitle><DialogDescription>Review the customer, products and total before saving.</DialogDescription></DialogHeader>
          {previewValues ? <InvoiceDraftPreview customers={customers} products={products} values={previewValues} /> : null}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close preview</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setSendOpen} open={sendOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send this invoice?</DialogTitle><DialogDescription>This will create {pendingValues?.invoiceNumber} and queue it for the customer’s email. No real message is sent in this frontend demo.</DialogDescription></DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button disabled={saving} variant="outline">Keep editing</Button></DialogClose>
            <Button isLoading={saving} leadingIcon={Send} onClick={() => pendingValues && void save(pendingValues, "send")}>Confirm and send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setCancelOpen} open={cancelOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Discard your changes?</DialogTitle><DialogDescription>Unsaved invoice details will be lost. This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Continue editing</Button></DialogClose>
            <Button asChild variant="destructive"><Link href="/invoices">Discard changes</Link></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
