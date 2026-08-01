import type { Metadata } from "next";

import { InventoryAdjustmentsView } from "@/components/inventory";
import { Breadcrumbs, PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Inventory adjustments" };

export default function InventoryAdjustmentsPage() {
  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Inventory", href: "/inventory" }, { label: "Adjustments" }]} />
        <PageHeader
          eyebrow="Inventory audit"
          title="Stock adjustments"
          description="Review each movement, who recorded it and the resulting on-hand quantity."
        />
      </div>
      <InventoryAdjustmentsView />
    </div>
  );
}
