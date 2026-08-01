"use client";

import { Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { StockAdjustmentDialog } from "@/components/inventory/stock-adjustment-dialog";
import { useToast } from "@/components/providers/toast-provider";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";

export function ProductActions({ productId, productName }: { productId: string; productName: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const remove = () => { setDeleteOpen(false); toast({ title: "Product deletion simulated", description: `${productName} would be removed after a backend confirmation.`, variant: "success" }); router.push("/products"); };
  return <div className="flex flex-wrap gap-2"><Button asChild variant="outline" leadingIcon={Pencil}><Link href={`/products/${productId}/edit`}>Edit product</Link></Button><StockAdjustmentDialog productId={productId} trigger={<Button type="button" leadingIcon={SlidersHorizontal}>Adjust stock</Button>} /><Button type="button" variant="destructive" leadingIcon={Trash2} onClick={() => setDeleteOpen(true)}>Delete</Button><Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Delete {productName}?</DialogTitle><DialogDescription>This destructive action would remove the catalogue item. Historical invoices and stock records must remain available, so a real API should archive rather than erase connected data.</DialogDescription></DialogHeader><DialogFooter><Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Keep product</Button><Button type="button" variant="destructive" onClick={remove}>Confirm deletion</Button></DialogFooter></DialogContent></Dialog></div>;
}
