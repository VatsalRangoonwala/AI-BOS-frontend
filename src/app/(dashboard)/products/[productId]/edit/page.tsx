import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/products";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { products } from "@/lib/mock-data";

type EditProductPageProps = { params: Promise<{ productId: string }> };
export function generateStaticParams() { return products.map((product) => ({ productId: product.id })); }
export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> { const { productId } = await params; const product = products.find((candidate) => candidate.id === productId); return { title: product ? `Edit ${product.name}` : "Edit product" }; }
export default async function EditProductPage({ params }: EditProductPageProps) { const { productId } = await params; const product = products.find((candidate) => candidate.id === productId); if (!product) notFound(); return <div className="app-page-enter mx-auto max-w-5xl space-y-6"><Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: product.name, href: `/products/${product.id}` }, { label: "Edit" }]} /><PageHeader eyebrow="Catalogue record" title={`Edit ${product.name}`} description="Update catalogue, pricing and stock alert settings." /><ProductForm product={product} /></div>; }
