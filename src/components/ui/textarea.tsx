import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className, invalid, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) {
    const isInvalid = invalid ?? ariaInvalid;

    return (
      <textarea
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "flex min-h-28 w-full resize-y rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground shadow-sm",
          "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
          className,
        )}
        {...props}
      />
    );
  },
);
