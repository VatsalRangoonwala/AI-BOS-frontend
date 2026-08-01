"use client";

import type { LucideIcon } from "lucide-react";
import { FileText, Package, Search, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

import { invoices, orders } from "@/lib/mock-data/commerce";
import { customers } from "@/lib/mock-data/customers";
import { products } from "@/lib/mock-data/products";
import { cn, formatINR } from "@/lib/utils";

type SearchGroup = "Customers" | "Products" | "Invoices" | "Orders";
type ResultTone = "neutral" | "success" | "warning" | "danger" | "info";

type SearchResult = {
  id: string;
  group: SearchGroup;
  label: string;
  description: string;
  meta: string;
  href: string;
  searchText: string;
  icon: LucideIcon;
  tone: ResultTone;
};

const groupOrder: SearchGroup[] = ["Customers", "Products", "Invoices", "Orders"];
const toneClasses: Record<ResultTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

const customerNames = new Map(customers.map((customer) => [customer.id, customer.fullName]));
const humanize = (value: string) =>
  value
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const searchIndex: SearchResult[] = [
  ...customers.map((customer): SearchResult => ({
    id: `customer-${customer.id}`,
    group: "Customers",
    label: customer.fullName,
    description: `${customer.mobile} · ${customer.city}`,
    meta: customer.outstandingBalance > 0 ? `${formatINR(customer.outstandingBalance)} due` : "Fully paid",
    href: `/customers/${customer.id}`,
    searchText: [customer.fullName, customer.mobile, customer.email, customer.city, customer.notes].filter(Boolean).join(" "),
    icon: Users,
    tone: customer.outstandingBalance > 0 ? "warning" : "success",
  })),
  ...products.map((product): SearchResult => ({
    id: `product-${product.id}`,
    group: "Products",
    label: product.name,
    description: `${product.sku} · ${product.category}`,
    meta:
      product.stockStatus === "out_of_stock"
        ? "Out of stock"
        : product.stockStatus === "low_stock"
          ? `${product.currentStock} left · Low stock`
          : `${product.currentStock} in stock`,
    href: `/products/${product.id}`,
    searchText: [product.name, product.sku, product.barcode, product.category, product.description].filter(Boolean).join(" "),
    icon: Package,
    tone: product.stockStatus === "out_of_stock" ? "danger" : product.stockStatus === "low_stock" ? "warning" : "success",
  })),
  ...invoices.map((invoice): SearchResult => {
    const customer = customerNames.get(invoice.customerId) ?? "Unknown customer";
    const status = humanize(invoice.status);
    return {
      id: `invoice-${invoice.id}`,
      group: "Invoices",
      label: invoice.invoiceNumber,
      description: `${customer} · ${formatINR(invoice.total)}`,
      meta: status,
      href: `/invoices/${invoice.id}`,
      searchText: [invoice.invoiceNumber, invoice.reference, customer, status, ...invoice.items.flatMap((item) => [item.productName, item.sku])].filter(Boolean).join(" "),
      icon: FileText,
      tone: invoice.status === "paid" ? "success" : invoice.status === "overdue" ? "danger" : invoice.status === "draft" ? "neutral" : "info",
    };
  }),
  ...orders.map((order): SearchResult => {
    const customer = customerNames.get(order.customerId) ?? "Unknown customer";
    const orderStatus: string = order.status;
    const status = humanize(orderStatus);
    return {
      id: `order-${order.id}`,
      group: "Orders",
      label: order.orderNumber,
      description: `${customer} · ${formatINR(order.total)}`,
      meta: status,
      href: `/orders/${order.id}`,
      searchText: [order.orderNumber, customer, status, order.paymentStatus, ...order.items.flatMap((item) => [item.productName, item.sku])].join(" "),
      icon: ShoppingBag,
      tone: orderStatus === "completed" ? "success" : orderStatus === "cancelled" ? "danger" : orderStatus === "draft" ? "neutral" : "info",
    };
  }),
];

const suggestedResults = groupOrder.flatMap((group) => {
  const result = searchIndex.find((candidate) => candidate.group === group);
  return result ? [result] : [];
});

function findResults(query: string) {
  const terms = query.trim().toLocaleLowerCase("en-IN").split(/\s+/).filter(Boolean);
  if (terms.length === 0) return suggestedResults;
  return searchIndex.filter((result) => {
    const searchable = `${result.label} ${result.description} ${result.meta} ${result.searchText}`.toLocaleLowerCase("en-IN");
    return terms.every((term) => searchable.includes(term));
  });
}

export function GlobalSearch({ inputRef }: { inputRef?: RefObject<HTMLInputElement | null> }) {
  const router = useRouter();
  const containerRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = useMemo(() => findResults(query), [query]);
  const groups = useMemo(
    () =>
      groupOrder
        .map((group) => ({
          group,
          results: results.map((result, index) => ({ result, index })).filter(({ result }) => result.group === group),
        }))
        .filter((group) => group.results.length > 0),
    [results],
  );

  useEffect(() => {
    function handleOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setOpen(true);
    setActiveIndex(findResults(nextQuery).length > 0 ? 0 : -1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (results.length ? Math.min(current + 1, results.length - 1) : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (results.length ? (current <= 0 ? results.length - 1 : current - 1) : -1));
    } else if (event.key === "Home" && open && results.length) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && open && results.length) {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) {
        close();
        router.push(result.href);
      }
    }
  }

  return (
    <form ref={containerRef} role="search" className="relative z-50 mx-2 hidden min-w-40 max-w-xl flex-1 md:block" onSubmit={(event) => event.preventDefault()}>
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 text-muted-foreground transition-colors focus-within:border-primary/40 focus-within:bg-card">
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="sr-only">Search your business</span>
        <input
          ref={inputRef}
          role="combobox"
          type="search"
          aria-autocomplete="list"
          aria-controls="global-search-results"
          aria-expanded={open}
          aria-activedescendant={open && activeIndex >= 0 ? `global-search-option-${results[activeIndex]?.id}` : undefined}
          autoComplete="off"
          value={query}
          placeholder="Search customers, products, invoices, orders…"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
          onChange={handleChange}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(results.length ? 0 : -1);
          }}
          onKeyDown={handleKeyDown}
        />
        <kbd className="hidden rounded-md border border-border-strong bg-card px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground xl:inline-flex">Ctrl K</kbd>
      </label>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl shadow-slate-950/10">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-xs font-semibold text-foreground">{query.trim() ? "Search results" : "Suggested records"}</p>
            <p className="text-[0.68rem] text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? "result" : "results"}</p>
          </div>
          <div id="global-search-results" role="listbox" aria-label="Business search results" className="max-h-[min(28rem,calc(100vh-7rem))] overflow-y-auto p-2">
            {results.length ? (
              groups.map(({ group, results: groupResults }) => (
                <div role="group" aria-labelledby={`global-search-group-${group.toLowerCase()}`} className="mb-2 last:mb-0" key={group}>
                  <p id={`global-search-group-${group.toLowerCase()}`} className="px-2.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-muted-foreground">{group}</p>
                  <div className="space-y-0.5">
                    {groupResults.map(({ result, index }) => (
                      <ResultOption key={result.id} result={result} active={index === activeIndex} onActive={() => setActiveIndex(index)} onSelect={close} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid place-items-center px-5 py-10 text-center">
                <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><Search className="size-5" aria-hidden="true" /></span>
                <p className="mt-4 text-sm font-semibold text-foreground">No records found</p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">Try a customer name, mobile number, product, SKU, invoice number or order number.</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-border bg-muted/35 px-4 py-2 text-[0.68rem] text-muted-foreground">
            <span><kbd className="font-sans font-semibold">↑ ↓</kbd> move</span>
            <span><kbd className="font-sans font-semibold">Enter</kbd> open</span>
            <span><kbd className="font-sans font-semibold">Esc</kbd> close</span>
          </div>
        </div>
      ) : null}
    </form>
  );
}

function ResultOption({ result, active, onActive, onSelect }: { result: SearchResult; active: boolean; onActive: () => void; onSelect: () => void }) {
  const ResultIcon = result.icon;
  return (
    <Link
      id={`global-search-option-${result.id}`}
      href={result.href}
      role="option"
      tabIndex={-1}
      aria-selected={active}
      className={cn("flex min-h-14 items-center gap-3 rounded-xl px-2.5 py-2 outline-none transition-colors", active ? "bg-primary-soft" : "hover:bg-surface-muted")}
      onMouseMove={onActive}
      onFocus={onActive}
      onClick={onSelect}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", toneClasses[result.tone])}><ResultIcon className="size-4" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{result.label}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{result.description}</span></span>
      <span className={cn("shrink-0 rounded-full px-2 py-1 text-[0.65rem] font-semibold", toneClasses[result.tone])}>{result.meta}</span>
    </Link>
  );
}
