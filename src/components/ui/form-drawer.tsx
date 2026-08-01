"use client";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function FormDrawer({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className="w-full sm:max-w-xl"><SheetHeader><SheetTitle>{title}</SheetTitle>{description ? <SheetDescription>{description}</SheetDescription> : null}</SheetHeader><div className="mt-6 min-h-0 flex-1 overflow-y-auto">{children}</div>{footer ? <SheetFooter>{footer}</SheetFooter> : null}</SheetContent></Sheet>;
}
