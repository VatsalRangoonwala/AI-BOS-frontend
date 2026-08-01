import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { Icon } from "@/components/icon";
import { cn } from "@/components/ui/utils";

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  wrapperClassName?: string;
};

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      className,
      wrapperClassName,
      invalid,
      "aria-invalid": ariaInvalid,
      children,
      ...props
    },
    ref,
  ) {
    const isInvalid = invalid ?? ariaInvalid;

    return (
      <span className={cn("relative block", wrapperClassName)}>
        <select
          ref={ref}
          aria-invalid={isInvalid || undefined}
          className={cn(
            "min-h-11 w-full appearance-none rounded-md border border-input bg-card py-2 pr-10 pl-3 text-sm text-foreground shadow-sm",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
            "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <Icon
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          icon={ChevronDown}
          size="sm"
        />
      </span>
    );
  },
);
