import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderDetail } from "@/components/orders";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers, invoices, orders } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

type OrderDetailPageProps = { params: Promise<{ orderId: string }> };

export function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id }));
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return { title: orders.find((order) => order.id === orderId)?.orderNumber ?? "Order not found" };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = orders.find((candidate) => candidate.id === orderId);
  if (!order) notFound();
  const customer = customers.find((candidate) => candidate.id === order.customerId);
  if (!customer) notFound();
  const invoice = invoices.find((candidate) => candidate.id === order.invoiceId);

  return (
    <div className="app-page-enter space-y-6">
      <div>
        <Breadcrumbs items={[{ label: "Orders", href: "/orders" }, { label: order.orderNumber }]} />
        <PageHeader
          eyebrow="Order details"
          title={order.orderNumber}
          description={`${customer.fullName} · Ordered ${formatDate(order.orderDate)}`}
        />
      </div>
      <OrderDetail order={order} customer={customer} invoice={invoice} />
    </div>
  );
}
