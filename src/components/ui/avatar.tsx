import Image from "next/image";
import type { HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

const pixelSizes: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "?";
}

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: string;
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
};

export function Avatar({
  name,
  src,
  alt = name,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-primary-soft font-semibold text-primary ring-1 ring-border",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          alt={alt}
          className="size-full object-cover"
          height={pixelSizes[size]}
          src={src}
          unoptimized
          width={pixelSizes[size]}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
      {!src ? <span className="sr-only">{name}</span> : null}
    </span>
  );
}
