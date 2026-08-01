import type { Metadata } from "next";

import { ProductForm } from "@/components/products";
import { Breadcrumbs, PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() { return <div className="app-page-enter mx-auto max-w-5xl space-y-6"><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: "Add product" }]} /><PageHeader eyebrow="Catalogue setup" title="Add product" description="Create one connected product record for catalogue, inventory, orders and invoices." /><ProductForm /></div>; }
