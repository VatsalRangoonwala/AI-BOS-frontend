import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { LoaderCircle, type LucideIcon } from "lucide-react";

import { Icon } from "@/components/icon";
import { cn } from "@/components/ui/utils";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "soft"
  | "destructive"
  | "link";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon-sm"
  | "icon"
  | "icon-lg";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:brightness-95",
  outline:
    "border border-border-strong bg-card text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  soft: "bg-primary-soft text-primary hover:bg-primary/15",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:brightness-95",
  link: "min-h-0 rounded-none p-0 text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3 text-sm sm:min-h-9",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
  "icon-sm": "size-11 p-0 sm:size-9",
  icon: "size-11 p-0",
  "icon-lg": "size-12 p-0",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "motion-reduce:transition-none",
    variantClasses[variant],
    sizeClasses[size],
    block && "w-full",
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  asChild?: boolean;
  children?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      block = false,
      isLoading = false,
      loadingText,
      leadingIcon,
      trailingIcon,
      asChild = false,
      className,
      disabled,
      type,
      "aria-disabled": ariaDisabled,
      children,
      ...props
    },
    ref,
  ) {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        aria-busy={isLoading || undefined}
        aria-disabled={
          asChild && (disabled || isLoading) ? true : ariaDisabled
        }
        className={buttonStyles({ variant, size, block, className })}
        disabled={asChild ? undefined : disabled || isLoading}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      >
        {isLoading ? (
          <Icon className="animate-spin motion-reduce:animate-none" icon={LoaderCircle} size="sm" />
        ) : leadingIcon ? (
          <Icon icon={leadingIcon} size="sm" />
        ) : null}
        {asChild ? (
          <Slottable>{isLoading && loadingText ? loadingText : children}</Slottable>
        ) : isLoading && loadingText ? (
          loadingText
        ) : (
          children
        )}
        {!isLoading && trailingIcon ? <Icon icon={trailingIcon} size="sm" /> : null}
      </Component>
    );
  },
);
