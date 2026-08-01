import type { Metadata } from "next";
import {
  Accessibility,
  BrainCircuit,
  CheckCircle2,
  Compass,
  HeartHandshake,
  IndianRupee,
  Layers3,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";

import {
  MarketingCTA,
  MarketingContainer,
  MarketingPageHero,
  SectionHeading,
} from "@/components/marketing/marketing-primitives";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why AI-BOS is building a simpler, trustworthy business operating system for India’s small and medium-sized businesses.",
};

const principles = [
  {
    icon: Compass,
    title: "Clarity before cleverness",
    description: "A business owner should understand a screen, status or recommendation at first glance.",
  },
  {
    icon: HeartHandshake,
    title: "Trust is a product feature",
    description: "Important actions show their impact, ask for confirmation and leave a visible record.",
  },
  {
    icon: Smartphone,
    title: "Mobile is the real workplace",
    description: "Core tasks must remain quick and comfortable on the phone already used at the counter.",
  },
  {
    icon: BrainCircuit,
    title: "AI should reduce work",
    description: "The assistant exists to answer, prepare and recommend—not to make the product feel futuristic.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <MarketingPageHero
        eyebrow="Our mission"
        title="Make good business systems feel natural to use."
        description="AI-BOS is built around a simple belief: growing businesses deserve operational clarity without having to become software experts."
        primaryAction={{ label: "Explore the product", href: "/features" }}
        secondaryAction={{ label: "Talk to us", href: "/contact" }}
      />

      <section className="bg-background py-16 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Badge variant="primary">Why AI-BOS exists</Badge>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                The business is connected. Its tools should be too.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
                <p>
                  A sale changes stock. A payment changes a customer balance. An overdue invoice changes what needs attention tomorrow. Yet many small businesses still manage each part in a different notebook, spreadsheet or chat.
                </p>
                <p>
                  AI-BOS brings those everyday records into one calm workspace. Traditional screens make routine entry dependable; a conversational assistant makes the same information easier to query and act on.
                </p>
                <p>
                  The goal is not to imitate a large-company ERP. It is to give owners and staff a reliable view of the work that keeps a shop or trading business healthy.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3 border-b border-border pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Layers3 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">One operating picture</p>
                  <p className="text-xs text-muted-foreground">Built from connected everyday records</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Customers", "Know the relationship"],
                  ["Products", "Know what you sell"],
                  ["Inventory", "Know what is available"],
                  ["Invoices", "Know what was billed"],
                  ["Payments", "Know what was collected"],
                  ["AI insights", "Know what to do next"],
                ].map(([title, detail], index) => (
                  <div className="rounded-xl border border-border bg-background p-4" key={title}>
                    <span className="text-[10px] font-bold text-primary">0{index + 1}</span>
                    <p className="mt-2 text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="Product principles"
            title="Designed for confidence during a busy day."
            description="These principles guide both the visible interface and the decisions behind it."
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => {
              const PrincipleIcon = principle.icon;

              return (
                <article className="rounded-2xl border border-border bg-background p-5" key={principle.title}>
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary-soft text-secondary">
                    <PrincipleIcon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{principle.description}</p>
                </article>
              );
            })}
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6 lg:col-span-2 sm:p-8">
              <Badge variant="success">Built for Indian businesses</Badge>
              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Familiar details, from rupee values to everyday payment methods.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                AI-BOS is shaped around the realities of mobile shops, electronics and garment stores, grocery retailers, wholesalers and other growing businesses. INR formatting, Indian phone numbers, UPI and Razorpay-style subscription flows are treated as first-class product details—not afterthoughts.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: IndianRupee, title: "INR-first", detail: "Readable Indian number formatting" },
                  { icon: Store, title: "Retail-ready", detail: "Fast customer and stock workflows" },
                  { icon: Accessibility, title: "Inclusive", detail: "Clear language and accessible controls" },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4" key={item.title}><ItemIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p></div></div>;
                })}
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-foreground p-6 text-background sm:p-8">
              <ShieldCheck className="size-7" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold tracking-tight">Deliberately focused.</h2>
              <p className="mt-4 text-sm leading-7 text-background/70">
                AI-BOS is an operating workspace, not a complex accounting, payroll or manufacturing suite. Clear boundaries keep the experience useful for the businesses it serves.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {["No payroll workflows", "No manufacturing planning", "No multi-country tax engine", "No hidden AI actions"].map((item) => (
                  <li className="flex gap-2" key={item}><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-14">
        <MarketingContainer>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              ["Simple", "Enough structure to be reliable, without turning every task into a process."],
              ["Practical", "Built around real actions: sell, restock, invoice, collect and follow up."],
              ["Intelligent", "AI adds context and momentum while keeping the owner in control."],
            ].map(([title, description]) => (
              <div key={title}>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <MarketingCTA title="Build a calmer way to run the business." description="Start free and turn scattered everyday records into one reliable business picture." />
    </>
  );
}

