"use client";

import {
  ArrowRight,
  BookOpen,
  Box,
  FileText,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button, Card, CardContent, Badge, buttonStyles } from "@/components/ui";

import { helpArticles, helpCategories, type HelpCategory } from "./help-content";

const categoryIcons: Record<HelpCategory["icon"], LucideIcon> = {
  rocket: Rocket,
  receipt: FileText,
  package: Box,
  wallet: WalletCards,
  sparkles: Sparkles,
  shield: ShieldCheck,
};

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredArticles = useMemo(
    () =>
      helpArticles.filter((article) => {
        const matchesCategory = category === "all" || article.categoryId === category;
        const haystack = [article.title, article.summary, ...article.keywords].join(" ").toLowerCase();
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
      }),
    [category, normalizedQuery],
  );

  const isFiltering = Boolean(normalizedQuery) || category !== "all";
  const visibleArticles = isFiltering
    ? filteredArticles
    : filteredArticles.filter((article) => article.featured);

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="relative overflow-hidden border-primary/20 bg-primary-soft/55">
        <div className="absolute -right-16 -top-20 size-52 rounded-full bg-primary/8" aria-hidden="true" />
        <CardContent className="relative p-5 sm:p-7 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">What can we help you with?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Search practical guides for daily sales, stock, payments and account management.</p>
            <label className="relative mt-5 block text-left">
              <span className="sr-only">Search help articles</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try ‘stock adjustment’ or ‘record payment’"
                className="min-h-12 w-full rounded-xl border border-border-strong bg-card pl-12 pr-11 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear help search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="help-categories-title" className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="help-categories-title" className="text-lg font-semibold">Browse by topic</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose a part of the workspace to narrow the guides.</p>
          </div>
          {isFiltering ? <Button type="button" variant="link" onClick={() => { setQuery(""); setCategory("all"); }}>Clear all filters</Button> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {helpCategories.map((item) => {
            const Icon = categoryIcons[item.icon];
            const active = category === item.id;
            const articleCount = helpArticles.filter((article) => article.categoryId === item.id).length;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(active ? "all" : item.id)}
                aria-pressed={active}
                className={`flex min-h-28 items-start gap-3 rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/30 hover:bg-primary-soft/30"}`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{item.title}</span>
                    <Badge variant={active ? "primary" : "neutral"}>{articleCount}</Badge>
                  </span>
                  <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="help-results-title" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="help-results-title" className="text-lg font-semibold">{isFiltering ? "Search results" : "Popular guides"}</h2>
            <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">{visibleArticles.length} guide{visibleArticles.length === 1 ? "" : "s"} available</p>
          </div>
        </div>

        {visibleArticles.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleArticles.map((article) => {
                const articleCategory = helpCategories.find((item) => item.id === article.categoryId);
                return (
                  <Link
                    key={article.slug}
                    href={`/help/${article.slug}`}
                    className="group flex min-h-32 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary-soft/25 sm:p-5"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span>{articleCategory?.title}</span><span aria-hidden="true">·</span><span>{article.readMinutes} min read</span>
                    </div>
                    <h3 className="mt-2 font-semibold leading-6 group-hover:text-primary">{article.title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">{article.summary}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">Read guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                  </Link>
                );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="grid justify-items-center gap-3 py-12 text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><Search className="size-5" /></span>
              <div><h3 className="font-semibold">No matching help articles</h3><p className="mt-1 text-sm text-muted-foreground">Try fewer words or choose another topic.</p></div>
              <Button type="button" variant="outline" onClick={() => { setQuery(""); setCategory("all"); }}>Clear search</Button>
            </CardContent>
          </Card>
        )}
      </section>

      <Card className="border-primary/20">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold">Still need a hand?</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Send the support team the details and reference number so they can investigate faster.</p>
          </div>
          <Link href="/support" className={buttonStyles()}>Contact support <ArrowRight className="size-4" /></Link>
        </CardContent>
      </Card>
    </div>
  );
}
