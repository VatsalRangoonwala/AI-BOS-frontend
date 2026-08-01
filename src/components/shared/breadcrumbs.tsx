import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link href="/dashboard" className="grid size-7 place-items-center rounded-lg hover:bg-muted hover:text-foreground" aria-label="Dashboard">
            <Home className="size-3.5" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="rounded-md px-1 py-1 hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
