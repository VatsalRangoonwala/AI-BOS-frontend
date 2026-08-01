import { AlertTriangle, Boxes, PackageCheck, PackageX } from "lucide-react";
import type { Metadata } from "next";

import { AnalyticsDetail } from "@/components/analytics";
import { analyticsSummary, products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventory analytics" };

export default function InventoryAnalyticsPage() {
  return <AnalyticsDetail title="Inventory analytics" description="Balance stock investment against sales velocity and reorder risk." sectionLabel="Inventory" stats={[{ label: "Stock value", value: formatINR(analyticsSummary.inventoryValue), icon: Boxes }, { label: "Fast-moving", value: "3", change: 16, icon: PackageCheck, tone: "success" }, { label: "Low-stock risk", value: String(analyticsSummary.lowStockCount), icon: AlertTriangle, tone: "warning" }, { label: "Out of stock", value: String(analyticsSummary.outOfStockCount), icon: PackageX, tone: "danger" }]} chartTitle="Stock value by category" chartDescription="Purchase value compared with estimated retail value" chartData={[{ label: "Audio", primary: 7192, secondary: 11992 }, { label: "Chargers", primary: 12960, secondary: 23382 }, { label: "Garments", primary: 2100, secondary: 3995 }, { label: "Cables", primary: 6720, secondary: 15968 }, { label: "Computer", primary: 7840, secondary: 13986 }]} tableTitle="Velocity and risk" tableDescription="Use sales velocity and thresholds to plan restocking." rows={products.map((product, index) => ({ id: product.id, product: product.name, sku: product.sku, stock: product.currentStock, threshold: product.lowStockThreshold, velocity: `${[2.4, 1.2, 0.8, 1.7, 3.1, 0.6][index]} / week`, reorder: Math.max(0, product.lowStockThreshold * 3 - product.currentStock), status: product.stockStatus }))} columns={[{ key: "product", label: "Product", priority: "primary" }, { key: "sku", label: "SKU" }, { key: "stock", label: "Current", format: "number" }, { key: "threshold", label: "Threshold", format: "number" }, { key: "velocity", label: "Sales velocity" }, { key: "reorder", label: "Suggested reorder", format: "number" }, { key: "status", label: "Risk", format: "status" }]} searchKeys={["product", "sku"]} />;
}
