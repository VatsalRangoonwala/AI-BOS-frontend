import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductProfile } from "@/components/products";
import { Breadcrumbs } from "@/components/shared";
import { inventoryAdjustments, orders, products } from "@/lib/mock-data";

type ProductPageProps = { params: Promise<{ productId: string }> };
export function generateStaticParams() { return products.map((product) => ({ productId: product.id })); }
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> { const { productId } = await params; const product = products.find((candidate) => candidate.id === productId); return { title: product?.name ?? "Product" }; }
export default async function ProductPage({ params }: ProductPageProps) { const { productId } = await params; const product = products.find((candidate) => candidate.id === productId); if (!product) notFound(); const relatedOrders = orders.filter((order) => order.items.some((item) => item.productId === product.id)); return <div className="app-page-enter"><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: product.name }]} /><ProductProfile product={product} adjustments={inventoryAdjustments.filter((item) => item.productId === product.id).sort((a, b) => b.date.localeCompare(a.date))} orders={relatedOrders.sort((a, b) => b.orderDate.localeCompare(a.orderDate))} /></div>; }
