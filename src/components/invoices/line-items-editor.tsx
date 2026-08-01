"use client";

import { Plus, Trash2 } from "lucide-react";

import { ProductSelector } from "@/components/invoices/product-selector";
import {
  Button,
  CurrencyDisplay,
  FieldError,
  IconButton,
  Input,
} from "@/components/ui";
import type { Product } from "@/types";

export type EditableLineItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export function getLineTotal(item: EditableLineItem) {
  return Math.max(0, item.quantity * item.unitPrice - item.discount);
}

export type LineItemsEditorProps = {
  items: EditableLineItem[];
  products: readonly Product[];
  onChange: (items: EditableLineItem[]) => void;
  error?: string;
  heading?: string;
  stockAllowances?: Readonly<Record<string, number>>;
};

export function LineItemsEditor({
  items,
  products,
  onChange,
  error,
  heading = "Products",
  stockAllowances = {},
}: LineItemsEditorProps) {
  const selectedProductIds = items.map((item) => item.productId).filter(Boolean);
  const nextProduct = products.find(
    (product) => !selectedProductIds.includes(product.id) && product.currentStock > 0,
  );

  const updateItem = (id: string, patch: Partial<EditableLineItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    if (!nextProduct) return;
    const nextId = Array.from(
      { length: items.length + 1 },
      (_, index) => `line-${index + 1}`,
    ).find((id) => !items.some((item) => item.id === id));
    onChange([
      ...items,
      {
        id: nextId ?? `line-${items.length + 1}`,
        productId: nextProduct.id,
        quantity: 1,
        unitPrice: nextProduct.sellingPrice,
        discount: 0,
      },
    ]);
  };

  return (
    <section aria-labelledby="line-items-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold" id="line-items-heading">
            {heading}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Prices can be adjusted for this transaction. Stock shown is currently available.
          </p>
        </div>
        <Button
          disabled={!nextProduct}
          leadingIcon={Plus}
          onClick={addItem}
          size="sm"
          type="button"
          variant="outline"
        >
          Add line
        </Button>
      </div>

      <div className="hidden grid-cols-[minmax(220px,1.7fr)_90px_130px_120px_130px_44px] gap-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
        <span>Product</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Discount</span>
        <span className="text-right">Line total</span>
        <span className="sr-only">Actions</span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          const availableStock = product
            ? product.currentStock + (stockAllowances[product.id] ?? 0)
            : 0;
          const exceedsStock = Boolean(product && item.quantity > availableStock);

          return (
            <div
              className="grid gap-3 rounded-lg border border-border bg-background p-3 lg:grid-cols-[minmax(220px,1.7fr)_90px_130px_120px_130px_44px] lg:items-start"
              key={item.id}
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground lg:sr-only" htmlFor={`product-${item.id}`}>
                  Product {index + 1}
                </label>
                <ProductSelector
                  excludeIds={selectedProductIds.filter((id) => id !== item.productId)}
                  id={`product-${item.id}`}
                  onValueChange={(productId) => {
                    const selected = products.find(
                      (candidate) => candidate.id === productId,
                    );
                    updateItem(item.id, {
                      productId,
                      unitPrice: selected?.sellingPrice ?? 0,
                    });
                  }}
                  products={products}
                  value={item.productId}
                />
                {product ? (
                  <p
                    className={`mt-1.5 text-xs ${
                      exceedsStock || product.currentStock === 0
                        ? "font-medium text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {availableStock} {product.unit}s available for this document
                    {exceedsStock ? " · Reduce quantity" : ""}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground lg:sr-only" htmlFor={`quantity-${item.id}`}>
                  Quantity
                </label>
                <Input
                  id={`quantity-${item.id}`}
                  inputMode="numeric"
                  invalid={exceedsStock}
                  min={1}
                  onChange={(event) =>
                    updateItem(item.id, { quantity: Number(event.target.value) || 0 })
                  }
                  type="number"
                  value={item.quantity}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground lg:sr-only" htmlFor={`price-${item.id}`}>
                  Unit price
                </label>
                <Input
                  id={`price-${item.id}`}
                  inputMode="decimal"
                  min={0}
                  onChange={(event) =>
                    updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })
                  }
                  step="0.01"
                  type="number"
                  value={item.unitPrice}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground lg:sr-only" htmlFor={`discount-${item.id}`}>
                  Discount
                </label>
                <Input
                  id={`discount-${item.id}`}
                  inputMode="decimal"
                  min={0}
                  onChange={(event) =>
                    updateItem(item.id, { discount: Number(event.target.value) || 0 })
                  }
                  step="0.01"
                  type="number"
                  value={item.discount}
                />
              </div>

              <div className="flex min-h-11 items-center justify-between gap-3 lg:justify-end">
                <span className="text-xs font-semibold text-muted-foreground lg:sr-only">
                  Line total
                </span>
                <CurrencyDisplay amount={getLineTotal(item)} className="font-semibold" />
              </div>

              <IconButton
                disabled={items.length === 1}
                icon={Trash2}
                label={`Remove ${product?.name ?? `product line ${index + 1}`}`}
                onClick={() => onChange(items.filter((candidate) => candidate.id !== item.id))}
                size="sm"
                type="button"
                variant="ghost"
              />
            </div>
          );
        })}
      </div>

      {error ? <FieldError>{error}</FieldError> : null}
    </section>
  );
}
