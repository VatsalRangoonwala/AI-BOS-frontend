import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse rounded-md bg-muted motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export type SkeletonGroupProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(
  function SkeletonGroup(
    { className, label = "Loading content", children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-busy="true"
        className={className}
        role="status"
        {...props}
      >
        <span className="sr-only">{label}</span>
        {children}
      </div>
    );
  },
);
