import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  const isInvalid = invalid ?? ariaInvalid;

  return (
    <input
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(
        "flex min-h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm",
        "placeholder:text-muted-foreground file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
        className,
      )}
      {...props}
    />
  );
});
