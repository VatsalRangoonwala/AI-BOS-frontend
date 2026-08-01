import { AlertTriangle, Boxes, PackageCheck, PackageX, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { InventoryOverviewTable, StockAdjustmentDialog } from "@/components/inventory";
import { PageHeader, StatCard } from "@/components/shared";
import { Card, CardContent, buttonStyles } from "@/components/ui";
import { products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  const stockValue = products.reduce(
    (total, product) => total + product.currentStock * product.purchasePrice,
    0,
  );
  const totalUnits = products.reduce((total, product) => total + product.currentStock, 0);
  const lowStockCount = products.filter((product) => product.stockStatus === "low_stock").length;
  const outOfStockCount = products.filter((product) => product.stockStatus === "out_of_stock").length;

  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Stock control"
        title="Inventory"
        description="Monitor every product on hand, surface replenishment risks and keep a traceable adjustment history."
        actions={[
          { label: "Low-stock alerts", href: "/inventory/low-stock", icon: AlertTriangle, variant: "outline" },
          { label: "Adjustment history", href: "/inventory/adjustments", icon: SlidersHorizontal, variant: "outline" },
        ]}
      >
        <StockAdjustmentDialog />
      </PageHeader>

      <section aria-label="Inventory summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Units on hand" value={String(totalUnits)} icon={Boxes} tone="primary" />
        <StatCard label="Inventory value" value={formatINR(stockValue)} icon={PackageCheck} tone="success" />
        <StatCard label="Low-stock products" value={String(lowStockCount)} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of stock" value={String(outOfStockCount)} icon={PackageX} tone="danger" />
      </section>

      {lowStockCount + outOfStockCount > 0 ? (
        <Card className="border-warning/25 bg-warning-soft/45">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{lowStockCount + outOfStockCount} products need attention</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Review suggested reorder quantities before upcoming sales are affected.</p>
              </div>
            </div>
            <Link href="/inventory/low-stock" className={buttonStyles({ variant: "outline" })}>Review alerts</Link>
          </CardContent>
        </Card>
      ) : null}

      <section aria-labelledby="inventory-products-title" className="space-y-3">
        <div>
          <h2 id="inventory-products-title" className="text-lg font-semibold">Product stock</h2>
          <p className="mt-1 text-sm text-muted-foreground">Purchase-cost valuation and alert thresholds across the catalogue.</p>
        </div>
        <InventoryOverviewTable />
      </section>
    </div>
  );
}
