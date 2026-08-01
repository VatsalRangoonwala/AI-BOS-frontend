import { DataExplorer, type DataColumn } from "@/components/shared";
import { products } from "@/lib/mock-data";

const columns: DataColumn[] = [
  { key: "product", label: "Product", priority: "primary" },
  { key: "sku", label: "SKU", priority: "secondary" },
  { key: "category", label: "Category" },
  { key: "currentStock", label: "On hand", format: "number", align: "right" },
  { key: "threshold", label: "Alert at", format: "number", align: "right" },
  { key: "stockValue", label: "Stock value", format: "currency", align: "right" },
  { key: "stockStatus", label: "Status", format: "status" },
];

export function InventoryOverviewTable() {
  const rows = products.map((product) => ({
    id: product.id,
    product: product.name,
    sku: product.sku,
    category: product.category,
    currentStock: product.currentStock,
    threshold: product.lowStockThreshold,
    stockValue: product.currentStock * product.purchasePrice,
    stockStatus: product.stockStatus,
  }));

  return (
    <DataExplorer
      rows={rows}
      columns={columns}
      searchKeys={["product", "sku", "category"]}
      searchPlaceholder="Search products, SKUs or categories…"
      filters={[
        { label: "All stock levels", value: "all", key: "stockStatus" },
        { label: "In stock", value: "in_stock", key: "stockStatus" },
        { label: "Low stock", value: "low_stock", key: "stockStatus" },
        { label: "Out of stock", value: "out_of_stock", key: "stockStatus" },
      ]}
      viewBasePath="/products"
      emptyTitle="No inventory products"
      emptyDescription="Add a product to start tracking stock."
      emptyAction={{ label: "Add product", href: "/products/new" }}
    />
  );
}
