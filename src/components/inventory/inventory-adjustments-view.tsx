"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { DataExplorer, type DataColumn } from "@/components/shared";
import { Button, Card, CardContent } from "@/components/ui";
import { inventoryAdjustments, products } from "@/lib/mock-data";
import type { InventoryAdjustment } from "@/types";

import {
  StockAdjustmentDialog,
  type StockAdjustmentDraft,
} from "./stock-adjustment-dialog";

const productById = new Map(products.map((product) => [product.id, product]));

const typeLabels: Record<InventoryAdjustment["type"], string> = {
  opening_stock: "Opening stock",
  purchase: "Purchase",
  sale: "Sale",
  customer_return: "Customer return",
  supplier_return: "Supplier return",
  damage: "Damage",
  correction: "Correction",
};

const columns: DataColumn[] = [
  { key: "product", label: "Product", priority: "primary" },
  { key: "date", label: "Date", format: "date", priority: "secondary" },
  { key: "type", label: "Movement" },
  { key: "change", label: "Change", align: "right" },
  { key: "newQuantity", label: "After", format: "number", align: "right" },
  { key: "reason", label: "Reason" },
  { key: "changedBy", label: "Changed by" },
];

export function InventoryAdjustmentsView() {
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([
    ...inventoryAdjustments,
  ]);

  const rows = useMemo(
    () =>
      [...adjustments]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((adjustment) => ({
          id: adjustment.id,
          product: productById.get(adjustment.productId)?.name ?? "Unknown product",
          date: adjustment.date,
          type: typeLabels[adjustment.type],
          change:
            adjustment.changedQuantity > 0
              ? `+${adjustment.changedQuantity}`
              : String(adjustment.changedQuantity),
          newQuantity: adjustment.newQuantity,
          reason: adjustment.reason,
          changedBy: adjustment.changedBy,
        })),
    [adjustments],
  );

  const addAdjustment = (draft: StockAdjustmentDraft) => {
    const record: InventoryAdjustment = {
      id: `adj_mock_${Date.now()}`,
      businessId: "biz_001",
      productId: draft.productId,
      date: new Date().toISOString(),
      type: "correction",
      previousQuantity: draft.previousQuantity,
      changedQuantity: draft.changedQuantity,
      newQuantity: draft.newQuantity,
      reason: draft.reason,
      notes: draft.notes,
      changedBy: "Vikram Sharma",
    };
    setAdjustments((current) => [record, ...current]);
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary-soft/40">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-semibold">Inventory audit trail</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Every opening balance, sale, purchase and manual correction stays attributable.
            </p>
          </div>
          <StockAdjustmentDialog
            onAdjusted={addAdjustment}
            trigger={
              <Button type="button" leadingIcon={SlidersHorizontal}>
                New adjustment
              </Button>
            }
          />
        </CardContent>
      </Card>

      <DataExplorer
        rows={rows}
        columns={columns}
        searchKeys={["product", "reason", "changedBy"]}
        searchPlaceholder="Search products, reasons or team members…"
        filters={[
          { label: "All movements", value: "all", key: "type" },
          { label: "Sales", value: "Sale", key: "type" },
          { label: "Purchases", value: "Purchase", key: "type" },
          { label: "Corrections", value: "Correction", key: "type" },
          { label: "Opening stock", value: "Opening stock", key: "type" },
        ]}
        pageSize={10}
        emptyTitle="No stock movements"
        emptyDescription="Record an adjustment to start an inventory audit trail."
      />
    </div>
  );
}
