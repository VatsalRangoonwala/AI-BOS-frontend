import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/components/ui/utils";

export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = "horizontal", decorative = true, className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden={decorative || undefined}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className,
        )}
        role={decorative ? "none" : "separator"}
        {...props}
      />
    );
  },
);
