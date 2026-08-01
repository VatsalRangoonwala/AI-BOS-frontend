"use client";

import {
  cloneElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/components/ui/utils";

export type TooltipSide = "top" | "right" | "bottom" | "left";

const sideClasses: Record<TooltipSide, string> = {
  top: "bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2",
  right: "top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2",
  bottom: "top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2",
  left: "top-1/2 right-[calc(100%+0.5rem)] -translate-y-1/2",
};

type TooltipTriggerProps = {
  "aria-describedby"?: string;
};

export type TooltipProps = {
  children: ReactElement<TooltipTriggerProps>;
  content: ReactNode;
  side?: TooltipSide;
  className?: string;
};

export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: TooltipProps) {
  const id = useId();
  const describedBy = [children.props["aria-describedby"], id]
    .filter(Boolean)
    .join(" ");

  return (
    <span className="group/tooltip relative inline-flex">
      {cloneElement(children, { "aria-describedby": describedBy })}
      <span
        className={cn(
          "pointer-events-none absolute z-[120] w-max max-w-64 rounded-sm bg-foreground px-2 py-1 text-xs leading-5 text-background shadow-md",
          "invisible opacity-0 transition-opacity group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 motion-reduce:transition-none",
          sideClasses[side],
          className,
        )}
        id={id}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
