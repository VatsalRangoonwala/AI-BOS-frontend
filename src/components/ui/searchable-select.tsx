"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

export type SearchableSelectOption = {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
  disabled?: boolean;
};

export type SearchableSelectProps = {
  options: readonly SearchableSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

export function SearchableSelect({
  options,
  value,
  onValueChange,
  onBlur,
  id: providedId,
  name,
  label,
  placeholder = "Select an option",
  searchPlaceholder = "Search options…",
  emptyMessage = "No matching options",
  disabled,
  required,
  invalid,
  describedBy,
  className,
}: SearchableSelectProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      [option.label, option.description, option.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [options, query]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      onBlur?.();
    }
  };

  return (
    <>
      {name ? <input name={name} type="hidden" value={value ?? ""} /> : null}
      <Button
        aria-controls={`${id}-options`}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-label={`${label}: ${selected?.label ?? placeholder}`}
        aria-required={required || undefined}
        className={cn(
          "w-full justify-between overflow-hidden px-3 text-left font-normal",
          !selected && "text-muted-foreground",
          invalid && "border-destructive ring-2 ring-destructive/15",
          className,
        )}
        disabled={disabled}
        id={id}
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
      >
        <span className="min-w-0 truncate">{selected?.label ?? placeholder}</span>
        <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      </Button>

      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select {label.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Search the connected records, then choose one result.
            </DialogDescription>
          </DialogHeader>

          <label className="relative block">
            <span className="sr-only">{searchPlaceholder}</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoFocus
              className="pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={query}
            />
          </label>

          <div
            aria-label={`${label} options`}
            className="max-h-[min(22rem,52dvh)] space-y-1 overflow-y-auto rounded-lg border border-border p-1.5"
            id={`${id}-options`}
            role="listbox"
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    aria-selected={isSelected}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted",
                      isSelected && "bg-primary-soft text-primary",
                    )}
                    disabled={option.disabled}
                    key={option.value}
                    onClick={() => {
                      onValueChange(option.value);
                      handleOpenChange(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{option.label}</span>
                      {option.description ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
