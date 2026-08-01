import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type FAQItem = {
  question: string;
  answer: string;
};

export function FAQList({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, index) => (
        <details className="group" key={item.question} open={index === 0}>
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-semibold text-foreground focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-transform group-open:rotate-45 motion-reduce:transition-none">
              <Plus className="size-4" aria-hidden="true" />
            </span>
          </summary>
          <p className="max-w-3xl pb-5 pr-12 text-sm leading-7 text-muted-foreground sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

