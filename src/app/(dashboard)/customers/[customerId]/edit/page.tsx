import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomerForm } from "@/components/customers";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { customers } from "@/lib/mock-data";

type EditCustomerPageProps = { params: Promise<{ customerId: string }> };

export function generateStaticParams() { return customers.map((customer) => ({ customerId: customer.id })); }

export async function generateMetadata({ params }: EditCustomerPageProps): Promise<Metadata> {
  const { customerId } = await params;
  const customer = customers.find((candidate) => candidate.id === customerId);
  return { title: customer ? `Edit ${customer.fullName}` : "Edit customer" };
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { customerId } = await params;
  const customer = customers.find((candidate) => candidate.id === customerId);
  if (!customer) notFound();
  return <div className="app-page-enter mx-auto max-w-5xl space-y-6"><Breadcrumbs items={[{ label: "Customers", href: "/customers" }, { label: customer.fullName, href: `/customers/${customer.id}` }, { label: "Edit" }]} /><PageHeader eyebrow="Customer profile" title={`Edit ${customer.fullName}`} description="Changes are simulated locally and ready to connect to a customer service." /><CustomerForm customer={customer} /></div>;
}
