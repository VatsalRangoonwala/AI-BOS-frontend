import type { Metadata } from "next";

import { OrderBuilder } from "@/components/orders";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers, products } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Create order" };

export default function NewOrderPage() {
  return (
    <div className="app-page-enter space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Orders", href: "/orders" }, { label: "Create order" }]} />
        <PageHeader
          eyebrow="Order builder"
          title="Create order"
          description="Capture the customer request, check available stock and set the starting fulfilment status."
        />
      </div>
      <OrderBuilder customers={customers} products={products} />
    </div>
  );
}
