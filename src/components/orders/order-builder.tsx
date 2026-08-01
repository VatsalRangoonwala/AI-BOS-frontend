"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Info, Save, X } from "lucide-react";
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
import type { Customer, Product } from "@/types";

const orderSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  orderNumber: z.string().trim().min(3, "Enter an order number"),
  orderDate: z.string().min(1, "Choose an order date"),
  status: z.enum(["draft", "pending", "confirmed", "processing"]),
  paymentStatus: z.enum(["unpaid", "partially_paid", "paid"]),
  notes: z.string().trim().max(500, "Keep notes under 500 characters"),
  discount: z.number().min(0, "Discount cannot be negative"),
  items: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string().min(1, "Choose a product"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Price cannot be negative"),
        discount: z.number().min(0, "Discount cannot be negative"),
      }),
    )
    .min(1, "Add at least one product"),
});

type OrderBuilderValues = z.infer<typeof orderSchema>;
type OrderIntent = "draft" | "create";

function getInitialItems(products: readonly Product[]): EditableLineItem[] {
  const product = products.find((candidate) => candidate.currentStock > 0) ?? products[0];
  return product
    ? [{ id: "order-line-1", productId: product.id, quantity: 1, unitPrice: product.sellingPrice, discount: 0 }]
    : [];
}

export function OrderBuilder({
  customers,
  products,
}: {
  customers: readonly Customer[];
  products: readonly Product[];
}) {
  const { toast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<OrderBuilderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: "",
      orderNumber: "ORD-2045",
      orderDate: "2026-08-01",
      status: "pending",
      paymentStatus: "unpaid",
      notes: "",
      discount: 0,
      items: getInitialItems(products),
    },
  });

  const items = useWatch({ control, name: "items" }) ?? [];
  const discount = useWatch({ control, name: "discount" }) ?? 0;
  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const total = Math.max(0, subtotal - discount);

  const submit = async (
    values: OrderBuilderValues,
    event?: BaseSyntheticEvent,
  ) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | null | undefined;
    const intent = (submitter?.value as OrderIntent | undefined) ?? "create";
    if (values.discount > values.items.reduce((sum, item) => sum + getLineTotal(item), 0)) {
      setError("discount", { message: "Order discount cannot exceed the subtotal" });
      return;
    }
    if (intent !== "draft") {
      const unavailable = values.items.find((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return !product || item.quantity > product.currentStock;
      });
      if (unavailable) {
        setError("items", { message: "One or more lines exceed available stock" });
        toast({ title: "Check stock quantities", description: "Reduce the highlighted quantity before creating the order.", variant: "error" });
        return;
      }
    }

    setSaving(true);
    const result = await saveMockRecord(values, { delayMs: 650 });
    setSaving(false);
    if (!result.ok) {
      toast({ title: "Order was not saved", description: result.error.message, variant: "error" });
      return;
    }
    toast({
      title: intent === "draft" ? "Order draft saved" : "Order created",
      description: `${values.orderNumber} is ready for ${customers.find((customer) => customer.id === values.customerId)?.fullName ?? "the customer"}.`,
      variant: "success",
    });
  };

  return (
    <>
      <form className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]" noValidate onSubmit={handleSubmit(submit)}>
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Customer and order</CardTitle><p className="text-sm text-muted-foreground">Start with the customer, date and current workflow status.</p></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="customerId"
                render={({ field }) => (
                  <CustomerSelector
                    customers={customers}
                    error={errors.customerId?.message}
                    name={field.name}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    required
                    value={field.value}
                  />
                )}
              />
              <Field>
                <FieldLabel htmlFor="order-number" required>Order number</FieldLabel>
                <Input id="order-number" invalid={Boolean(errors.orderNumber)} {...register("orderNumber")} />
                {errors.orderNumber ? <FieldError>{errors.orderNumber.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="order-date" required>Order date</FieldLabel>
                <Input id="order-date" type="date" {...register("orderDate")} />
                {errors.orderDate ? <FieldError>{errors.orderDate.message}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="order-status">Order status</FieldLabel>
                <NativeSelect id="order-status" {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="order-payment-status">Payment status</FieldLabel>
                <NativeSelect id="order-payment-status" {...register("paymentStatus")}>
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially paid</option>
                  <option value="paid">Paid</option>
                </NativeSelect>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="order-notes">Order notes</FieldLabel>
                <Textarea id="order-notes" placeholder="Pickup, delivery or customer instructions" rows={3} {...register("notes")} />
                <FieldDescription>These notes stay with the order timeline.</FieldDescription>
                {errors.notes ? <FieldError>{errors.notes.message}</FieldError> : null}
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 sm:pt-6">
              <LineItemsEditor
                error={errors.items?.message}
                heading="Order products"
                items={items}
                onChange={(nextItems) => setValue("items", nextItems, { shouldDirty: true, shouldValidate: true })}
                products={products}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader><CardTitle>Order total</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="order-discount">Order discount</FieldLabel>
                <Input id="order-discount" min={0} step="0.01" type="number" {...register("discount", { valueAsNumber: true })} />
                {errors.discount ? <FieldError>{errors.discount.message}</FieldError> : null}
              </Field>
              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd><CurrencyDisplay amount={subtotal} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd>− <CurrencyDisplay amount={discount} /></dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><dt>Total</dt><dd><CurrencyDisplay amount={total} /></dd></div>
              </dl>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-info/20 bg-info-soft p-4 text-sm text-info">
            <div className="flex gap-2"><Info className="mt-0.5 size-4 shrink-0" /><p>Creating an order does not collect payment. Record payment separately when money is received.</p></div>
          </div>

          <div className="grid gap-2">
            <Button isLoading={saving} leadingIcon={ClipboardCheck} name="intent" type="submit" value="create">Create order</Button>
            <Button disabled={saving} leadingIcon={Save} name="intent" type="submit" value="draft" variant="outline">Save draft</Button>
            <Button disabled={saving} leadingIcon={X} onClick={() => setCancelOpen(true)} type="button" variant="ghost">Cancel</Button>
          </div>
        </aside>
      </form>

      <Dialog onOpenChange={setCancelOpen} open={cancelOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Discard this order?</DialogTitle><DialogDescription>All unsaved customer, product and pricing changes will be lost.</DialogDescription></DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Continue editing</Button></DialogClose>
            <Button asChild variant="destructive"><Link href="/orders">Discard changes</Link></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
