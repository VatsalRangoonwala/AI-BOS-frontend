import { CheckCircle2, ClipboardList, Clock3, PackageCheck, Plus, XCircle } from "lucide-react";
import type { Metadata } from "next";

import { DataExplorer, PageHeader, StatCard } from "@/components/shared";
import { customers, orders } from "@/lib/mock-data";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Orders" };

const customerById = new Map(customers.map((customer) => [customer.id, customer]));
const orderRecords: readonly Order[] = orders;

export default function OrdersPage() {
  const rows = [...orderRecords]
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: customerById.get(order.customerId)?.fullName ?? "Unknown customer",
      items: order.items.length,
      total: order.total,
      payment: order.paymentStatus.replaceAll("_", " "),
      status: order.status,
      date: order.orderDate,
    }));

  return (
    <div className="app-page-enter space-y-6">
      <PageHeader
        eyebrow="Sales fulfilment"
        title="Orders"
        description="Track each customer order from draft through confirmation, processing and completion."
        actions={[{ label: "Create order", href: "/orders/new", icon: Plus }]}
      />

      <section aria-label="Order summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="All orders" value={String(orderRecords.length)} tone="primary" />
        <StatCard icon={Clock3} label="Pending" value={String(orderRecords.filter((order) => order.status === "pending" || order.status === "draft").length)} tone="warning" />
        <StatCard icon={PackageCheck} label="Confirmed" value={String(orderRecords.filter((order) => order.status === "confirmed" || order.status === "processing").length)} tone="info" />
        <StatCard icon={CheckCircle2} label="Completed" value={String(orderRecords.filter((order) => order.status === "completed").length)} tone="success" />
        <StatCard icon={XCircle} label="Cancelled" value={String(orderRecords.filter((order) => order.status === "cancelled").length)} tone="danger" />
      </section>

      <DataExplorer
        columns={[
          { key: "orderNumber", label: "Order", priority: "primary" },
          { key: "customer", label: "Customer", priority: "secondary" },
          { key: "items", label: "Items", format: "number" },
          { key: "total", label: "Total", format: "currency", align: "right" },
          { key: "payment", label: "Payment", format: "status" },
          { key: "status", label: "Order status", format: "status" },
          { key: "date", label: "Date", format: "date" },
        ]}
        emptyAction={{ label: "Create your first order", href: "/orders/new" }}
        emptyDescription="Create an order to track customer requests and fulfilment."
        emptyTitle="No orders yet"
        dateFilter={{ key: "date", label: "Order date" }}
        filters={[
          { label: "All statuses", value: "all", key: "status", groupLabel: "status" },
          { label: "Draft", value: "draft", key: "status" },
          { label: "Pending", value: "pending", key: "status" },
          { label: "Confirmed", value: "confirmed", key: "status" },
          { label: "Processing", value: "processing", key: "status" },
          { label: "Completed", value: "completed", key: "status" },
          { label: "Cancelled", value: "cancelled", key: "status" },
          { label: "All customers", value: "all", key: "customer", groupLabel: "customer" },
          ...customers.map((customer) => ({
            label: customer.fullName,
            value: customer.fullName,
            key: "customer",
            groupLabel: "customer",
          })),
        ]}
        rows={rows}
        searchKeys={["orderNumber", "customer"]}
        searchPlaceholder="Search order or customer…"
        viewBasePath="/orders"
      />
    </div>
  );
}
