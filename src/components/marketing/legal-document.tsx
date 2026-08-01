import type { ReactNode } from "react";

import { MarketingContainer } from "@/components/marketing/marketing-primitives";
import { Badge } from "@/components/ui/badge";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export function LegalDocument({
  eyebrow,
  title,
  summary,
  effectiveDate,
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="border-b border-border bg-card py-14 sm:py-18">
        <MarketingContainer>
          <div className="max-w-3xl">
            <Badge variant="outline">{eyebrow}</Badge>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-0.045em] sm:text-5xl">{title}</h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{summary}</p>
            <p className="mt-5 text-xs font-semibold text-muted-foreground">Effective {effectiveDate}</p>
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <MarketingContainer>
          <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24" aria-label={`${title} contents`}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">On this page</p>
              <nav className="mt-4">
                <ol className="space-y-1">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a className="flex min-h-10 items-center rounded-lg px-2 text-xs font-medium leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href={`#${section.id}`}>
                        <span className="mr-2 font-mono text-[10px] text-border-strong">{String(index + 1).padStart(2, "0")}</span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="min-w-0 rounded-2xl border border-border bg-card px-5 py-2 shadow-card sm:px-8">
              {sections.map((section, index) => (
                <section className="scroll-mt-28 border-b border-border py-8 last:border-b-0 sm:py-10" id={section.id} key={section.id}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 font-mono text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
                      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </article>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}

