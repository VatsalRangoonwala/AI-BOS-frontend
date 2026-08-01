import { ArrowRight, PackageSearch, TrendingDown } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent, StockStatusBadge, buttonStyles } from "@/components/ui";
import { inventoryAdjustments, products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

import { StockAdjustmentDialog } from "./stock-adjustment-dialog";

const alertedProducts = products
  .filter((product) => product.stockStatus !== "in_stock")
  .sort((a, b) => a.currentStock - b.currentStock);

function unitsSold(productId: string) {
  return inventoryAdjustments
    .filter((adjustment) => adjustment.productId === productId && adjustment.type === "sale")
    .reduce((total, adjustment) => total + Math.abs(adjustment.changedQuantity), 0);
}

function reorderQuantity(currentStock: number, threshold: number) {
  return Math.max(threshold * 3 - currentStock, threshold - currentStock + 1);
}

export function LowStockList() {
  if (!alertedProducts.length) {
    return (
      <Card>
        <CardContent className="grid justify-items-center gap-3 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-success-soft text-success">
            <PackageSearch className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">All products are sufficiently stocked</h2>
            <p className="mt-1 text-sm text-muted-foreground">New alerts will appear here automatically.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <th className="px-4 py-3.5">Product</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">On hand</th>
              <th className="px-4 py-3.5 text-right">Alert at</th>
              <th className="px-4 py-3.5 text-right">Recent sales</th>
              <th className="px-4 py-3.5 text-right">Suggested reorder</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {alertedProducts.map((product) => {
              const suggested = reorderQuantity(product.currentStock, product.lowStockThreshold);
              return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-4">
                    <Link href={`/products/${product.id}`} className="font-semibold hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.category}</p>
                  </td>
                  <td className="px-4 py-4"><StockStatusBadge status={product.stockStatus} /></td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums">{product.currentStock}</td>
                  <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">{product.lowStockThreshold}</td>
                  <td className="px-4 py-4 text-right text-muted-foreground tabular-nums">{unitsSold(product.id)}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-semibold tabular-nums">{suggested} {product.unit}s</span>
                    <p className="mt-1 text-xs text-muted-foreground">{formatINR(suggested * product.purchasePrice)}</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <StockAdjustmentDialog
                      productId={product.id}
                      trigger={<Button type="button" size="sm">Restock</Button>}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {alertedProducts.map((product) => {
          const suggested = reorderQuantity(product.currentStock, product.lowStockThreshold);
          return (
            <article key={product.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${product.currentStock === 0 ? "bg-danger-soft text-destructive" : "bg-warning-soft text-warning"}`}>
                  <TrendingDown className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-5">{product.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{product.sku}</p>
                </div>
                <StockStatusBadge status={product.stockStatus} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div><dt className="text-xs text-muted-foreground">On hand</dt><dd className="mt-1 font-semibold tabular-nums">{product.currentStock} {product.unit}s</dd></div>
                <div><dt className="text-xs text-muted-foreground">Alert threshold</dt><dd className="mt-1 font-semibold tabular-nums">{product.lowStockThreshold}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Recent sales</dt><dd className="mt-1 font-semibold tabular-nums">{unitsSold(product.id)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Suggested reorder</dt><dd className="mt-1 font-semibold tabular-nums">{suggested} · {formatINR(suggested * product.purchasePrice)}</dd></div>
              </dl>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/products/${product.id}`} className={buttonStyles({ variant: "outline", className: "w-full" })}>
                  Details <ArrowRight className="size-4" />
                </Link>
                <StockAdjustmentDialog
                  productId={product.id}
                  trigger={<Button type="button" block>Restock</Button>}
                />
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
