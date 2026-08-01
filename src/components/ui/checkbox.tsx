import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/components/ui/utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, invalid, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) {
    const isInvalid = invalid ?? ariaInvalid;

    return (
      <input
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "size-5 shrink-0 cursor-pointer rounded border-input accent-primary",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-2 aria-invalid:ring-destructive/30",
          className,
        )}
        type="checkbox"
        {...props}
      />
    );
  },
);

export type CheckboxFieldProps = Omit<CheckboxProps, "children"> & {
  label: ReactNode;
  description?: ReactNode;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(
    { id: providedId, label, description, className, ...props },
    ref,
  ) {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <div className="flex items-start gap-3">
        <Checkbox
          ref={ref}
          aria-describedby={descriptionId}
          className={cn("mt-0.5", className)}
          id={id}
          {...props}
        />
        <div className="grid gap-1">
          <label className="cursor-pointer text-sm font-medium leading-5 text-foreground" htmlFor={id}>
            {label}
          </label>
          {description ? (
            <p className="text-xs leading-5 text-muted-foreground" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);
