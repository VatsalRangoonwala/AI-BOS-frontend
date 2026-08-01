import {
  forwardRef,
  type FieldsetHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from "react";

import { cn } from "@/components/ui/utils";

export const Field = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Field({ className, ...props }, ref) {
    return <div ref={ref} className={cn("grid gap-2", className)} {...props} />;
  },
);

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
  optional?: boolean;
};

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel(
    { className, children, required = false, optional = false, ...props },
    ref,
  ) {
    return (
      <label
        ref={ref}
        className={cn(
          "flex items-baseline gap-1.5 text-sm font-medium leading-none text-foreground",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {required ? (
          <>
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
        {optional && !required ? (
          <span className="text-xs font-normal text-muted-foreground">Optional</span>
        ) : null}
      </label>
    );
  },
);

export const Label = FieldLabel;

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FieldDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-xs leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
});

export const FieldError = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FieldError({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      aria-live="polite"
      className={cn("text-xs font-medium leading-5 text-destructive", className)}
      role="alert"
      {...props}
    />
  );
});

export const FieldSet = forwardRef<
  HTMLFieldSetElement,
  FieldsetHTMLAttributes<HTMLFieldSetElement>
>(function FieldSet({ className, ...props }, ref) {
  return (
    <fieldset
      ref={ref}
      className={cn("grid min-w-0 gap-4 border-0 p-0", className)}
      {...props}
    />
  );
});

export const FieldLegend = forwardRef<
  HTMLLegendElement,
  HTMLAttributes<HTMLLegendElement>
>(function FieldLegend({ className, ...props }, ref) {
  return (
    <legend
      ref={ref}
      className={cn("mb-1 text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
});
