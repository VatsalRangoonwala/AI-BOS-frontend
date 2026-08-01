"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ConfirmationDialog({ trigger, title, description, confirmLabel = "Confirm", cancelLabel = "Go back", destructive = false, onConfirm }: { trigger: React.ReactNode; title: string; description: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean; onConfirm: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false); const [working, setWorking] = useState(false);
  const confirm = async () => { setWorking(true); await onConfirm(); setWorking(false); setOpen(false); };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent><DialogHeader>{destructive ? <span className="grid size-11 place-items-center rounded-xl bg-danger-soft text-danger"><AlertTriangle className="size-5" /></span> : null}<DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="outline" disabled={working}>{cancelLabel}</Button></DialogClose><Button variant={destructive ? "destructive" : "primary"} isLoading={working} loadingText="Working…" onClick={confirm}>{confirmLabel}</Button></DialogFooter></DialogContent></Dialog>;
}
