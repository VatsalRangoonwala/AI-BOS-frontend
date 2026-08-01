import { History, PackagePlus } from "lucide-react";
import type { Metadata } from "next";

import { LowStockList } from "@/components/inventory";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { products } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Low-stock alerts" };

export default function LowStockPage() {
  const alertCount = products.filter((product) => product.stockStatus !== "in_stock").length;

  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Inventory", href: "/inventory" }, { label: "Low-stock alerts" }]} />
        <PageHeader
          eyebrow="Replenishment queue"
          title="Low-stock alerts"
          description={`${alertCount} product${alertCount === 1 ? "" : "s"} are below their configured threshold. Prioritise unavailable and fast-moving stock first.`}
          actions={[
            { label: "Adjustment history", href: "/inventory/adjustments", icon: History, variant: "outline" },
            { label: "Add product", href: "/products/new", icon: PackagePlus, variant: "outline" },
          ]}
        />
      </div>
      <LowStockList />
    </div>
  );
}
