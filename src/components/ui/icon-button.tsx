import { forwardRef } from "react";
import { LoaderCircle, type LucideIcon } from "lucide-react";

import { Icon, type IconSize } from "@/components/icon";
import {
  Button,
  type ButtonProps,
  type ButtonSize,
} from "@/components/ui/button";

const buttonSizes = {
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
} satisfies Record<IconButtonSize, ButtonSize>;

const iconSizes = {
  sm: "sm",
  md: "md",
  lg: "lg",
} satisfies Record<IconButtonSize, IconSize>;

export type IconButtonSize = "sm" | "md" | "lg";

export type IconButtonProps = Omit<
  ButtonProps,
  | "aria-label"
  | "children"
  | "isLoading"
  | "leadingIcon"
  | "loadingText"
  | "size"
  | "trailingIcon"
> & {
  icon: LucideIcon;
  label: string;
  size?: IconButtonSize;
  isLoading?: boolean;
  showTooltip?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      label,
      size = "md",
      isLoading = false,
      showTooltip = true,
      disabled,
      title,
      ...props
    },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        aria-label={label}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        size={buttonSizes[size]}
        title={showTooltip ? (title ?? label) : title}
        {...props}
      >
        <Icon
          className={isLoading ? "animate-spin motion-reduce:animate-none" : undefined}
          icon={isLoading ? LoaderCircle : icon}
          size={iconSizes[size]}
        />
      </Button>
    );
  },
);
