"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, SlidersHorizontal } from "lucide-react";
import { useId, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
  Textarea,
} from "@/components/ui";
import { products } from "@/lib/mock-data";

const adjustmentSchema = z.object({
  productId: z.string().min(1, "Choose a product."),
  direction: z.enum(["add", "remove"]),
  quantity: z
    .number({ error: "Enter a quantity." })
    .int("Use a whole-number quantity.")
    .positive("Quantity must be greater than zero."),
  reason: z.string().trim().min(3, "Choose or enter a reason."),
  notes: z.string().trim().max(300, "Keep notes under 300 characters."),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export type StockAdjustmentDraft = {
  productId: string;
  previousQuantity: number;
  changedQuantity: number;
  newQuantity: number;
  reason: string;
  notes?: string;
};

type StockAdjustmentDialogProps = {
  productId?: string;
  trigger?: ReactNode;
  onAdjusted?: (adjustment: StockAdjustmentDraft) => void;
};

export function StockAdjustmentDialog({
  productId,
  trigger,
  onAdjusted,
}: StockAdjustmentDialogProps) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const { toast } = useToast();
  const defaultProductId = productId ?? products[0]?.id ?? "";
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      productId: defaultProductId,
      direction: "add",
      quantity: 1,
      reason: "Stock count correction",
      notes: "",
    },
  });

  const selectedProductId = useWatch({ control, name: "productId" });
  const direction = useWatch({ control, name: "direction" });
  const quantity = useWatch({ control, name: "quantity" });
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [selectedProductId],
  );
  const signedQuantity = Number.isFinite(quantity)
    ? direction === "remove"
      ? -quantity
      : quantity
    : 0;
  const projectedStock = (selectedProduct?.currentStock ?? 0) + signedQuantity;

  const closeAndReset = () => {
    setOpen(false);
    reset({
      productId: defaultProductId,
      direction: "add",
      quantity: 1,
      reason: "Stock count correction",
      notes: "",
    });
  };

  const submit = handleSubmit(async (values) => {
    const product = products.find((candidate) => candidate.id === values.productId);
    if (!product) {
      setError("productId", { message: "This product is no longer available." });
      return;
    }

    const changedQuantity = values.direction === "remove" ? -values.quantity : values.quantity;
    const newQuantity = product.currentStock + changedQuantity;
    if (newQuantity < 0) {
      setError("quantity", {
        message: `Only ${product.currentStock} ${product.unit}${product.currentStock === 1 ? "" : "s"} are available.`,
      });
      return;
    }

    await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
    onAdjusted?.({
      productId: product.id,
      previousQuantity: product.currentStock,
      changedQuantity,
      newQuantity,
      reason: values.reason,
      notes: values.notes || undefined,
    });
    toast({
      title: "Stock adjustment recorded",
      description: `${product.name} would move from ${product.currentStock} to ${newQuantity} ${product.unit}${newQuantity === 1 ? "" : "s"}.`,
      variant: "success",
    });
    closeAndReset();
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
        else closeAndReset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" leadingIcon={SlidersHorizontal}>
            Adjust stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Adjust inventory</DialogTitle>
          <DialogDescription>
            Record a manual stock movement. The current mock quantity is preserved in the audit preview.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={submit} noValidate className="grid gap-5">
          <Field>
            <FieldLabel htmlFor={`${formId}-product`} required>
              Product
            </FieldLabel>
            <NativeSelect
              id={`${formId}-product`}
              disabled={Boolean(productId)}
              invalid={Boolean(errors.productId)}
              aria-describedby={errors.productId ? `${formId}-product-error` : undefined}
              {...register("productId")}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </NativeSelect>
            {productId ? (
              <input type="hidden" value={productId} {...register("productId")} />
            ) : null}
            {errors.productId ? (
              <FieldError id={`${formId}-product-error`}>{errors.productId.message}</FieldError>
            ) : (
              <FieldDescription>
                Current stock: {selectedProduct?.currentStock ?? 0} {selectedProduct?.unit ?? "units"}
              </FieldDescription>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${formId}-direction`} required>
                Movement
              </FieldLabel>
              <NativeSelect id={`${formId}-direction`} {...register("direction")}>
                <option value="add">Add stock</option>
                <option value="remove">Remove stock</option>
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${formId}-quantity`} required>
                Quantity
              </FieldLabel>
              <Input
                id={`${formId}-quantity`}
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? `${formId}-quantity-error` : undefined}
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity ? (
                <FieldError id={`${formId}-quantity-error`}>{errors.quantity.message}</FieldError>
              ) : null}
            </Field>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border p-3 ${
              projectedStock < 0
                ? "border-destructive/25 bg-danger-soft text-destructive"
                : "border-border bg-muted/50"
            }`}
            aria-live="polite"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                direction === "remove" ? "bg-danger-soft text-destructive" : "bg-success-soft text-success"
              }`}
            >
              {direction === "remove" ? <Minus className="size-4" /> : <Plus className="size-4" />}
            </span>
            <p className="text-sm">
              Projected stock: <strong className="tabular-nums">{projectedStock}</strong>{" "}
              {selectedProduct?.unit ?? "units"}
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor={`${formId}-reason`} required>
              Reason
            </FieldLabel>
            <NativeSelect
              id={`${formId}-reason`}
              invalid={Boolean(errors.reason)}
              aria-describedby={errors.reason ? `${formId}-reason-error` : undefined}
              {...register("reason")}
            >
              <option value="Stock count correction">Stock count correction</option>
              <option value="Supplier delivery">Supplier delivery</option>
              <option value="Damaged stock">Damaged stock</option>
              <option value="Customer return">Customer return</option>
              <option value="Supplier return">Supplier return</option>
            </NativeSelect>
            {errors.reason ? (
              <FieldError id={`${formId}-reason-error`}>{errors.reason.message}</FieldError>
            ) : null}
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-notes`} optional>
              Notes
            </FieldLabel>
            <Textarea
              id={`${formId}-notes`}
              rows={3}
              placeholder="Add a supplier reference, count note or explanation"
              invalid={Boolean(errors.notes)}
              aria-describedby={errors.notes ? `${formId}-notes-error` : undefined}
              {...register("notes")}
            />
            {errors.notes ? (
              <FieldError id={`${formId}-notes-error`}>{errors.notes.message}</FieldError>
            ) : null}
          </Field>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeAndReset}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isSubmitting}
            loadingText="Recording…"
          >
            Record adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
