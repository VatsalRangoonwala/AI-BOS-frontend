"use client";

import { useId } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  SearchableSelect,
} from "@/components/ui";
import type { Customer } from "@/types";

export type CustomerSelectorProps = {
  customers: readonly Customer[];
  value?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

export function CustomerSelector({
  customers,
  value,
  onValueChange,
  onBlur,
  label = "Customer",
  description,
  error,
  id: providedId,
  name,
  required,
  disabled,
}: CustomerSelectorProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const selectedCustomer = customers.find((customer) => customer.id === value);
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <Field>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <SearchableSelect
        describedBy={describedBy}
        disabled={disabled}
        emptyMessage="No customer matches that search."
        id={id}
        invalid={Boolean(error)}
        label={label}
        name={name}
        onBlur={onBlur}
        onValueChange={onValueChange}
        options={customers.map((customer) => ({
          value: customer.id,
          label: customer.fullName,
          description: `${customer.mobile} · ${customer.city}`,
          keywords: `${customer.email ?? ""} ${customer.mobile} ${customer.city}`,
        }))}
        placeholder="Select a customer"
        required={required}
        searchPlaceholder="Search name, mobile, email or city…"
        value={value}
      />
      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}
      {selectedCustomer ? (
        <p className="text-xs text-muted-foreground">
          {selectedCustomer.city} · Outstanding ₹
          {selectedCustomer.outstandingBalance.toLocaleString("en-IN")}
        </p>
      ) : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
