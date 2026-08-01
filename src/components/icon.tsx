import type { ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/components/ui/utils";

const iconSizes = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

export type IconSize = keyof typeof iconSizes;

export type IconProps = Omit<
  ComponentPropsWithoutRef<LucideIcon>,
  "children"
> & {
  icon: LucideIcon;
  size?: IconSize;
  title?: string;
};

export function Icon({
  icon: IconComponent,
  size = "md",
  className,
  title,
  "aria-label": ariaLabel,
  ...props
}: IconProps) {
  const accessibleName = ariaLabel ?? title;

  return (
    <IconComponent
      aria-hidden={accessibleName ? undefined : true}
      aria-label={accessibleName}
      className={cn("shrink-0", iconSizes[size], className)}
      focusable="false"
      role={accessibleName ? "img" : undefined}
      {...props}
    />
  );
}
