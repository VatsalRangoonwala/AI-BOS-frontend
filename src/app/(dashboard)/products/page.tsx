import { Boxes, FolderTree, Package, PackagePlus } from "lucide-react";
import type { Metadata } from "next";

import { ProductCatalogue } from "@/components/products";
import { PageHeader, StatCard } from "@/components/shared";
import { products } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  const stockValue = products.reduce((total, product) => total + product.currentStock * product.purchasePrice, 0);
  const alerts = products.filter((product) => product.stockStatus !== "in_stock").length;
  const categories = new Set(products.map((product) => product.category)).size;
  return <div className="app-page-enter space-y-6 lg:space-y-8"><PageHeader eyebrow="Product catalogue" title="Products" description="Manage product identifiers, pricing and the stock settings used across the business." actions={[{ label: "Add product", href: "/products/new", icon: PackagePlus }]} /><section aria-label="Product summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total products" value={String(products.length)} icon={Package} /><StatCard label="Stock value" value={formatINR(stockValue)} icon={Boxes} tone="success" /><StatCard label="Stock alerts" value={String(alerts)} icon={PackagePlus} tone="warning" /><StatCard label="Categories" value={String(categories)} icon={FolderTree} tone="info" /></section><ProductCatalogue /></div>;
}
