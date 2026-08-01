import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HelpArticle, getHelpArticle, getHelpCategory, helpArticles } from "@/components/help";
import { Breadcrumbs } from "@/components/shared";

type HelpArticlePageProps = { params: Promise<{ articleSlug: string }> };

export function generateStaticParams() {
  return helpArticles.map((article) => ({ articleSlug: article.slug }));
}

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = getHelpArticle(articleSlug);
  return {
    title: article?.title ?? "Help article",
    description: article?.summary,
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { articleSlug } = await params;
  const article = getHelpArticle(articleSlug);
  if (!article) notFound();
  const category = getHelpCategory(article.categoryId);

  return (
    <div className="app-page-enter">
      <Breadcrumbs items={[{ label: "Help", href: "/help" }, { label: category?.title ?? "Guide" }, { label: article.title }]} />
      <HelpArticle article={article} />
    </div>
  );
}
