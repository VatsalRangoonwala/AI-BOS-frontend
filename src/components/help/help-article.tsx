import { ArrowLeft, ArrowRight, Clock3, Info, Lightbulb, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Badge, Card, CardContent, buttonStyles } from "@/components/ui";
import { formatDate } from "@/lib/utils";

import { ArticleFeedback } from "./article-feedback";
import { getHelpArticle, getHelpCategory, type HelpArticleContent } from "./help-content";

export function HelpArticle({ article }: { article: HelpArticleContent }) {
  const category = getHelpCategory(article.categoryId);
  const relatedArticles = article.relatedSlugs.map(getHelpArticle).filter((item): item is HelpArticleContent => Boolean(item));

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]">
      <article className="min-w-0">
        <Card className="overflow-hidden">
          <CardContent className="p-5 sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{category?.title}</Badge>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{article.readMinutes} min read</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><RefreshCw className="size-3.5" />Updated {formatDate(article.updatedAt)}</span>
            </div>
            <h1 className="mt-4 text-balance text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{article.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{article.summary}</p>

            <div className="my-7 flex gap-3 rounded-xl border border-info/20 bg-info-soft p-4 text-sm leading-6">
              <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden="true" />
              <p><strong>In this guide:</strong> follow the steps in order, then verify the connected record before repeating a financial or inventory action.</p>
            </div>

            <div className="space-y-8">
              {article.sections.map((section, sectionIndex) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Step {sectionIndex + 1}</p>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{section.heading}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
                  {section.steps ? (
                    <ol className="mt-4 space-y-3">
                      {section.steps.map((step, index) => (
                        <li key={step} className="flex gap-3 text-sm leading-6">
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {section.bullets ? (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 rounded-lg bg-muted/55 p-3 text-sm leading-5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.note ? (
                    <div className="mt-4 flex gap-3 rounded-xl border border-warning/20 bg-warning-soft p-4 text-sm leading-6">
                      <Lightbulb className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
                      <p><strong>Good to know:</strong> {section.note}</p>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-9 border-t border-border pt-6">
              <ArticleFeedback articleTitle={article.title} />
            </div>
          </CardContent>
        </Card>
      </article>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start" aria-label="Article navigation">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold">On this page</h2>
            <nav className="mt-3 grid gap-1">
              {article.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="rounded-lg px-2.5 py-2 text-sm leading-5 text-muted-foreground hover:bg-muted hover:text-foreground">{section.heading}</a>
              ))}
            </nav>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold">Related guides</h2>
            <div className="mt-3 divide-y divide-border">
              {relatedArticles.map((related) => (
                <Link key={related.slug} href={`/help/${related.slug}`} className="group flex items-start gap-2 py-3 first:pt-0 last:pb-0">
                  <span className="min-w-0 flex-1 text-sm leading-5 group-hover:text-primary">{related.title}</span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Link href="/help" className={buttonStyles({ variant: "outline", className: "w-full" })}><ArrowLeft className="size-4" />All help articles</Link>
      </aside>
    </div>
  );
}
