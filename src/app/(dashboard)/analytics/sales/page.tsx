import { IndianRupee, Percent, ShoppingBag, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { AnalyticsDetail } from "@/components/analytics";
import { analyticsSummary, products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Sales analytics" };

export default function SalesAnalyticsPage() {
  return <AnalyticsDetail title="Sales analytics" description="Track revenue patterns, order value, and the products driving growth." sectionLabel="Sales" stats={[{ label: "Gross sales", value: formatINR(analyticsSummary.grossSales), change: 12.4, icon: IndianRupee }, { label: "Orders", value: String(analyticsSummary.totalOrders), change: 8.1, icon: ShoppingBag, tone: "info" }, { label: "Average order", value: formatINR(analyticsSummary.averageOrderValue), change: 5.8, icon: TrendingUp, tone: "success" }, { label: "Sales growth", value: "12.4%", change: 3.2, icon: Percent, tone: "success" }]} chartTitle="Daily sales" chartDescription="Gross sales compared with the previous period" chartType="line" chartData={analyticsSummary.revenueTrend.map((item) => ({ label: item.label, revenue: item.value, previous: item.previousValue }))} tableTitle="Product performance" tableDescription="Sales contribution and remaining stock for each product." rows={products.map((product) => ({ id: product.id, product: product.name, sku: product.sku, category: product.category, sales: analyticsSummary.topProducts.find((item) => item.id === product.id)?.value ?? 0, stock: product.currentStock, status: product.stockStatus }))} columns={[{ key: "product", label: "Product", priority: "primary" }, { key: "sku", label: "SKU" }, { key: "category", label: "Category" }, { key: "sales", label: "Sales", format: "currency", align: "right" }, { key: "stock", label: "Stock", format: "number", align: "right" }, { key: "status", label: "Status", format: "status" }]} searchKeys={["product", "sku", "category"]} />;
}
