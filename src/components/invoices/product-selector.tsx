"use client";

import { useId } from "react";

import { FieldError, SearchableSelect } from "@/components/ui";
import type { Product } from "@/types";

export type ProductSelectorProps = {
  products: readonly Product[];
  value?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  excludeIds?: readonly string[];
  error?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
};

export function ProductSelector({
  products,
  value,
  onValueChange,
  onBlur,
  excludeIds = [],
  error,
  id: providedId,
  name,
  disabled,
}: ProductSelectorProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <SearchableSelect
        describedBy={errorId}
        disabled={disabled}
        emptyMessage="No product matches that name, SKU or barcode."
        id={id}
        invalid={Boolean(error)}
        label="Product"
        name={name}
        onBlur={onBlur}
        onValueChange={onValueChange}
        options={products.map((product) => ({
          value: product.id,
          label: product.name,
          description: `₹${product.sellingPrice.toLocaleString("en-IN")} · ${product.currentStock} in stock · ${product.sku}`,
          keywords: `${product.sku} ${product.barcode ?? ""} ${product.category}`,
          disabled: excludeIds.includes(product.id) && value !== product.id,
        }))}
        placeholder="Select a product"
        searchPlaceholder="Search product, SKU or barcode…"
        value={value}
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
