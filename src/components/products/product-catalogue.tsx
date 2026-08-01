"use client";

import { Barcode, Grid2X2, List, Package, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Button, CurrencyDisplay, EmptyState, NativeSelect, StockStatusBadge, buttonStyles } from "@/components/ui";
import { products } from "@/lib/mock-data";

type ViewMode = "grid" | "table";

function ProductVisual({ category }: { category: string }) {
  return <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Package className="size-6" aria-hidden="true" /><span className="sr-only">{category} product</span></span>;
}

export function ProductCatalogue() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState<ViewMode>("grid");
  const categories = [...new Set(products.map((product) => product.category))].sort();

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...products]
      .filter((product) => !normalized || [product.name, product.sku, product.barcode ?? ""].some((value) => value.toLowerCase().includes(normalized)))
      .filter((product) => category === "all" || product.category === category)
      .filter((product) => stock === "all" || product.stockStatus === stock)
      .sort((left, right) => {
        if (sort === "price-high") return right.sellingPrice - left.sellingPrice;
        if (sort === "price-low") return left.sellingPrice - right.sellingPrice;
        if (sort === "stock") return left.currentStock - right.currentStock;
        return left.name.localeCompare(right.name);
      });
  }, [category, query, sort, stock]);

  const reset = () => { setQuery(""); setCategory("all"); setStock("all"); setSort("name"); };

  return (
    <section aria-labelledby="catalogue-title" className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div><h2 id="catalogue-title" className="text-lg font-semibold tracking-tight">Product catalogue</h2><p className="mt-1 text-sm text-muted-foreground">Browse pricing and stock without horizontal scrolling on mobile.</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" leadingIcon={Barcode} onClick={() => toast({ title: "Barcode scanner placeholder", description: "Connect a supported camera or scanner from Settings → Integrations.", variant: "info" })}>Scan barcode</Button>
          <div className="inline-flex rounded-xl border border-border bg-card p-1" aria-label="Catalogue view">
            <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} className={`grid size-10 place-items-center rounded-lg ${view === "grid" ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"}`} aria-label="Grid view"><Grid2X2 className="size-4" /></button>
            <button type="button" onClick={() => setView("table")} aria-pressed={view === "table"} className={`grid size-10 place-items-center rounded-lg ${view === "table" ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"}`} aria-label="Table view"><List className="size-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid gap-2 rounded-2xl border border-border bg-card p-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(10rem,0.35fr))]">
        <label className="relative sm:col-span-2 xl:col-span-1"><span className="sr-only">Search products</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, SKU or barcode…" className="min-h-11 w-full rounded-md border border-input bg-card pl-9 pr-9 text-sm" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear product search" className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><X className="size-4" /></button> : null}</label>
        <NativeSelect aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</NativeSelect>
        <NativeSelect aria-label="Filter by stock status" value={stock} onChange={(event) => setStock(event.target.value)}><option value="all">All stock statuses</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option></NativeSelect>
        <NativeSelect aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name A–Z</option><option value="price-high">Highest price</option><option value="price-low">Lowest price</option><option value="stock">Lowest stock</option></NativeSelect>
      </div>

      {!visibleProducts.length ? <EmptyState icon={Package} title="No products match" description="Try clearing one of the current catalogue filters." action={<Button type="button" onClick={reset}>Clear filters</Button>} /> : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => <article key={product.id} className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card"><div className="flex items-start gap-3"><ProductVisual category={product.category} /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.category}</p></div><StockStatusBadge status={product.stockStatus} /></div><p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{product.description}</p><dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3"><div><dt className="text-[0.68rem] uppercase tracking-wide text-muted-foreground">Selling price</dt><dd className="mt-1 font-bold"><CurrencyDisplay amount={product.sellingPrice} /></dd></div><div><dt className="text-[0.68rem] uppercase tracking-wide text-muted-foreground">Current stock</dt><dd className="mt-1 font-bold tabular-nums">{product.currentStock} {product.unit}s</dd></div></dl><Link href={`/products/${product.id}`} className={buttonStyles({ variant: "outline", block: true, className: "mt-4" })}>View product</Link></article>)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-right">Purchase</th><th className="px-4 py-3 text-right">Selling</th><th className="px-4 py-3 text-right">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40"><td className="px-4 py-4"><div className="flex items-center gap-3"><ProductVisual category={product.category} /><span className="max-w-56 font-semibold">{product.name}</span></div></td><td className="px-4 py-4 text-muted-foreground">{product.sku}</td><td className="px-4 py-4 text-muted-foreground">{product.category}</td><td className="px-4 py-4 text-right"><CurrencyDisplay amount={product.purchasePrice} /></td><td className="px-4 py-4 text-right font-semibold"><CurrencyDisplay amount={product.sellingPrice} /></td><td className="px-4 py-4 text-right font-semibold tabular-nums">{product.currentStock}</td><td className="px-4 py-4"><StockStatusBadge status={product.stockStatus} /></td><td className="px-4 py-4 text-right"><Link href={`/products/${product.id}`} className="inline-flex min-h-9 items-center rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary-soft">View</Link></td></tr>)}</tbody></table></div>
          <div className="grid gap-3 p-3 md:hidden">{visibleProducts.map((product) => <article key={product.id} className="rounded-xl border border-border p-4"><div className="flex gap-3"><ProductVisual category={product.category} /><div className="min-w-0 flex-1"><p className="font-semibold">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.sku}</p></div><StockStatusBadge status={product.stockStatus} /></div><div className="mt-4 flex items-center justify-between"><span className="font-bold"><CurrencyDisplay amount={product.sellingPrice} /></span><span className="text-sm text-muted-foreground">{product.currentStock} in stock</span></div><Link href={`/products/${product.id}`} className={buttonStyles({ variant: "outline", block: true, className: "mt-4" })}>View details</Link></article>)}</div>
        </div>
      )}
      <p className="text-sm text-muted-foreground">Showing {visibleProducts.length} of {products.length} products</p>
    </section>
  );
}
