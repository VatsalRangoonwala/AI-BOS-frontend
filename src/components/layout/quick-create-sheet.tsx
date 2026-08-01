"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import Link from "next/link";

import { quickCreateItems } from "@/lib/navigation";

type QuickCreateSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickCreateSheet({ open, onOpenChange }: QuickCreateSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content className="safe-bottom fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-3xl border border-b-0 border-border bg-card px-4 pb-4 pt-3 shadow-2xl focus:outline-none sm:left-1/2 sm:bottom-5 sm:max-w-lg sm:-translate-x-1/2 sm:rounded-3xl sm:border sm:p-5">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border-strong sm:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold tracking-tight">Create something</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-5 text-muted-foreground">
                Choose a quick action to keep your business moving.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                aria-label="Close quick create"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickCreateItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Dialog.Close asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex min-h-[4.5rem] items-center gap-3 rounded-2xl border p-3 transition-colors ${
                      index === 0
                        ? "border-primary/20 bg-primary-soft hover:border-primary/40"
                        : "border-border bg-card hover:bg-surface-muted"
                    }`}
                  >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === 0 ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground"}`}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                </Dialog.Close>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5 text-xs leading-5 text-muted-foreground">
            <Plus className="size-4 shrink-0 text-primary" aria-hidden="true" />
            You can also ask AI Assistant to create records from a conversation.
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
