"use client";

import { forwardRef, type HTMLAttributes } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/components/ui/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-[100] bg-slate-950/55 backdrop-blur-[1px] transition-opacity",
        "data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
});

export type SheetSide = "top" | "right" | "bottom" | "left";

const sheetSides: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 max-h-[90dvh] rounded-b-xl border-b data-[state=closed]:-translate-y-4",
  right:
    "inset-y-0 right-0 h-full w-[min(26rem,calc(100%-2rem))] border-l data-[state=closed]:translate-x-4",
  bottom:
    "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-xl border-t data-[state=closed]:translate-y-4",
  left: "inset-y-0 left-0 h-full w-[min(26rem,calc(100%-2rem))] border-r data-[state=closed]:-translate-x-4",
};

export type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: SheetSide;
  showClose?: boolean;
};

export const SheetContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { side = "right", className, children, showClose = true, ...props },
  ref,
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-[101] flex flex-col overflow-y-auto border-border bg-card p-5 text-card-foreground shadow-xl",
          "transition-[opacity,transform] data-[state=closed]:opacity-0 data-[state=open]:translate-x-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 motion-reduce:transition-none sm:p-6",
          sheetSides[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close asChild>
            <IconButton
              className="absolute top-3 right-3"
              icon={X}
              label="Close panel"
              size="sm"
              variant="ghost"
            />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});

export const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-2 pr-10 text-left", className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end", className)} {...props} />
);

export const SheetTitle = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
});
