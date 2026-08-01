"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Barcode, ImagePlus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/providers/toast-provider";
import { Button, Card, CardContent, CardHeader, CardTitle, Field, FieldDescription, FieldError, FieldLabel, Input, NativeSelect, Textarea, buttonStyles } from "@/components/ui";
import { products } from "@/lib/mock-data";
import type { Product } from "@/types";

const units = ["piece", "box", "pack", "kilogram", "gram", "litre", "metre"] as const;
const categories = ["Audio", "Chargers", "Garments", "Power Banks", "Cables", "Computer Accessories", "Other"];
const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name."),
  sku: z.string().trim().min(3, "SKU must contain at least 3 characters."),
  barcode: z.string().trim().regex(/^\d{8,14}$/, "Use an 8–14 digit barcode.").or(z.literal("")),
  category: z.string().min(1, "Choose a category."),
  description: z.string().trim().min(10, "Add a short useful description.").max(500),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative."),
  sellingPrice: z.number().min(0, "Selling price cannot be negative."),
  openingStock: z.number().int("Use a whole-number quantity.").min(0, "Stock cannot be negative."),
  lowStockThreshold: z.number().int("Use a whole-number threshold.").min(0, "Threshold cannot be negative."),
  unit: z.enum(units),
}).refine((values) => values.sellingPrice >= values.purchasePrice, { path: ["sellingPrice"], message: "Selling price should not be below purchase price." });

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [imageName, setImageName] = useState("");
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: product?.name ?? "", sku: product?.sku ?? "", barcode: product?.barcode ?? "", category: product?.category ?? "Audio", description: product?.description ?? "", purchasePrice: product?.purchasePrice ?? 0, sellingPrice: product?.sellingPrice ?? 0, openingStock: product?.currentStock ?? 0, lowStockThreshold: product?.lowStockThreshold ?? 5, unit: product?.unit ?? "piece" },
  });
  const sku = useWatch({ control, name: "sku" });
  const barcode = useWatch({ control, name: "barcode" });
  const duplicate = useMemo(() => products.find((candidate) => candidate.id !== product?.id && (candidate.sku.toLowerCase() === sku.trim().toLowerCase() || Boolean(barcode) && candidate.barcode === barcode.trim())), [barcode, product?.id, sku]);

  const submit = handleSubmit(async (values) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 550));
    toast({ title: product ? "Product updated" : "Product added", description: `${values.name} is ready in the catalogue and inventory.`, variant: "success" });
    router.push(product ? `/products/${product.id}` : "/products");
  });

  const errorId = (name: keyof ProductFormValues) => errors[name] ? `${name}-error` : undefined;

  return <form onSubmit={submit} noValidate className="space-y-5">
    <Card><CardHeader><CardTitle>Product information</CardTitle><p className="mt-1 text-sm text-muted-foreground">Core catalogue details visible in orders and invoices.</p></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
      <Field className="sm:col-span-2"><FieldLabel htmlFor="product-image" optional>Product image</FieldLabel><label htmlFor="product-image" className="flex min-h-28 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border-strong bg-muted/40 p-4 hover:border-primary/40 hover:bg-primary-soft/30"><span className="grid size-12 place-items-center rounded-xl bg-card text-primary shadow-sm"><ImagePlus className="size-5" /></span><span><span className="block text-sm font-semibold">{imageName || "Choose a product photo"}</span><span className="mt-1 block text-xs text-muted-foreground">PNG or JPG, ready for a future upload service.</span></span><input id="product-image" type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")} /></label></Field>
      <Field><FieldLabel htmlFor="name" required>Product name</FieldLabel><Input id="name" placeholder="Samsung 25W USB-C Charger" invalid={Boolean(errors.name)} aria-describedby={errorId("name")} {...register("name")} />{errors.name ? <FieldError id="name-error">{errors.name.message}</FieldError> : null}</Field>
      <Field><FieldLabel htmlFor="sku" required>SKU</FieldLabel><Input id="sku" autoCapitalize="characters" placeholder="SAM-CH-25W" invalid={Boolean(errors.sku)} aria-describedby={errors.sku ? "sku-error" : duplicate ? "duplicate-warning" : undefined} {...register("sku")} />{errors.sku ? <FieldError id="sku-error">{errors.sku.message}</FieldError> : null}</Field>
      <Field><FieldLabel htmlFor="barcode" optional>Barcode</FieldLabel><div className="relative"><Barcode className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="barcode" inputMode="numeric" className="pl-9" placeholder="8904130886474" invalid={Boolean(errors.barcode)} aria-describedby={errors.barcode ? "barcode-error" : duplicate ? "duplicate-warning" : undefined} {...register("barcode")} /></div>{errors.barcode ? <FieldError id="barcode-error">{errors.barcode.message}</FieldError> : null}</Field>
      <Field><FieldLabel htmlFor="category" required>Category</FieldLabel><NativeSelect id="category" invalid={Boolean(errors.category)} {...register("category")}>{categories.map((category) => <option value={category} key={category}>{category}</option>)}</NativeSelect>{errors.category ? <FieldError>{errors.category.message}</FieldError> : null}</Field>
      {duplicate ? <div id="duplicate-warning" role="status" className="sm:col-span-2 rounded-xl border border-warning/25 bg-warning-soft p-3 text-sm text-warning">The SKU or barcode already matches <strong>{duplicate.name}</strong>. Check the identifiers before saving.</div> : null}
      <Field className="sm:col-span-2"><FieldLabel htmlFor="description" required>Description</FieldLabel><Textarea id="description" invalid={Boolean(errors.description)} aria-describedby={errorId("description")} placeholder="Key product details customers and staff should know" {...register("description")} />{errors.description ? <FieldError id="description-error">{errors.description.message}</FieldError> : null}</Field>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Pricing and stock</CardTitle><p className="mt-1 text-sm text-muted-foreground">Opening values seed inventory; future movements use stock adjustments.</p></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <Field><FieldLabel htmlFor="purchasePrice" required>Purchase price</FieldLabel><Input id="purchasePrice" type="number" min="0" step="0.01" inputMode="decimal" invalid={Boolean(errors.purchasePrice)} {...register("purchasePrice", { valueAsNumber: true })} />{errors.purchasePrice ? <FieldError>{errors.purchasePrice.message}</FieldError> : null}</Field>
      <Field><FieldLabel htmlFor="sellingPrice" required>Selling price</FieldLabel><Input id="sellingPrice" type="number" min="0" step="0.01" inputMode="decimal" invalid={Boolean(errors.sellingPrice)} {...register("sellingPrice", { valueAsNumber: true })} />{errors.sellingPrice ? <FieldError>{errors.sellingPrice.message}</FieldError> : null}</Field>
      <Field><FieldLabel htmlFor="unit" required>Unit type</FieldLabel><NativeSelect id="unit" {...register("unit")}>{units.map((unit) => <option value={unit} key={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>)}</NativeSelect></Field>
      <Field><FieldLabel htmlFor="openingStock" required>{product ? "Current stock" : "Opening stock"}</FieldLabel><Input id="openingStock" type="number" min="0" step="1" inputMode="numeric" invalid={Boolean(errors.openingStock)} {...register("openingStock", { valueAsNumber: true })} />{errors.openingStock ? <FieldError>{errors.openingStock.message}</FieldError> : <FieldDescription>Use adjustments after the product is created.</FieldDescription>}</Field>
      <Field><FieldLabel htmlFor="lowStockThreshold" required>Low-stock threshold</FieldLabel><Input id="lowStockThreshold" type="number" min="0" step="1" inputMode="numeric" invalid={Boolean(errors.lowStockThreshold)} {...register("lowStockThreshold", { valueAsNumber: true })} />{errors.lowStockThreshold ? <FieldError>{errors.lowStockThreshold.message}</FieldError> : null}</Field>
    </CardContent></Card>
    <div className="sticky bottom-24 z-20 flex flex-col-reverse gap-2 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end lg:bottom-3"><Link href={product ? `/products/${product.id}` : "/products"} className={buttonStyles({ variant: "outline" })}>Cancel</Link><Button type="submit" leadingIcon={Save} isLoading={isSubmitting} loadingText="Saving product…">{product ? "Save changes" : "Add product"}</Button></div>
  </form>;
}
