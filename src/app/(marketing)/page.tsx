import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  FileText,
  IndianRupee,
  PackageCheck,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Users,
  Warehouse,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { FAQList, type FAQItem } from "@/components/marketing/faq-list";
import {
  MarketingCTA,
  MarketingContainer,
  SectionHeading,
} from "@/components/marketing/marketing-primitives";
import { ProductPreview } from "@/components/marketing/product-preview";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Business Operating System for growing businesses",
  description:
    "Manage sales, stock, customers, invoices and payments from simple business screens or by asking AI-BOS in everyday language.",
};

const naturalLanguageCommands = [
  "Create invoice for Rahul",
  "Add 20 boAt Earphones",
  "Show today’s sales",
  "Who has not paid me?",
];

const features: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "AI business assistant",
    description: "Ask about sales, stock and payments—or prepare routine work using plain language.",
    icon: Sparkles,
  },
  {
    title: "Fast invoicing",
    description: "Build clear invoices from saved customers and products, then track every balance.",
    icon: FileText,
  },
  {
    title: "Inventory control",
    description: "See live quantities, stock value and practical alerts before popular items run out.",
    icon: Boxes,
  },
  {
    title: "Customer ledger",
    description: "Keep purchases, payments, notes and running balances together for every customer.",
    icon: Users,
  },
  {
    title: "Payment follow-up",
    description: "Spot overdue invoices, record partial payments and prepare friendly reminders.",
    icon: IndianRupee,
  },
  {
    title: "Useful analytics",
    description: "Understand revenue, bestsellers, slow stock and payment health without spreadsheets.",
    icon: BarChart3,
  },
];

const businessTypes: Array<{
  name: string;
  detail: string;
  icon: LucideIcon;
}> = [
  { name: "Mobile shops", detail: "Accessories, devices and repairs", icon: Smartphone },
  { name: "Electronics stores", detail: "Products, warranties and stock", icon: Zap },
  { name: "Grocery stores", detail: "Fast-moving daily inventory", icon: ShoppingBasket },
  { name: "Garment stores", detail: "Styles, sizes and categories", icon: Shirt },
  { name: "Wholesalers", detail: "Larger orders and receivables", icon: Warehouse },
  { name: "Other retailers", detail: "Flexible everyday operations", icon: Store },
];

const faqs: FAQItem[] = [
  {
    question: "Do I need accounting or technical experience?",
    answer:
      "No. AI-BOS is designed around familiar business tasks such as creating an invoice, adding stock and recording a payment. Labels are plain, screens stay focused and the AI assistant accepts everyday language.",
  },
  {
    question: "Can I use AI-BOS from my phone?",
    answer:
      "Yes. The workspace is mobile-first, with card-based lists, large touch targets, quick-create actions and a chat composer designed to remain accessible on smaller screens.",
  },
  {
    question: "Will AI make changes without asking me?",
    answer:
      "No financial or destructive action should happen silently. AI-BOS shows the proposed details and asks for confirmation before creating invoices, recording payments, sending reminders or deleting records.",
  },
  {
    question: "Can I start without importing old data?",
    answer:
      "Absolutely. Add one product and one customer, or skip setup and explore. You can build your catalogue and customer records gradually as you work.",
  },
  {
    question: "Does AI-BOS support partial payments?",
    answer:
      "Yes. Record part payments against an invoice and AI-BOS keeps the paid amount, remaining balance, customer ledger and payment history aligned.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Free includes a basic dashboard, one user and limited invoice and AI usage. You can move to Pro or Premium as transaction volume and team needs grow.",
  },
];

export default function MarketingHomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-card pb-14 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div aria-hidden="true" className="absolute -left-32 top-8 size-80 rounded-full bg-primary-soft blur-3xl" />
        <div aria-hidden="true" className="absolute -right-20 top-32 size-64 rounded-full bg-secondary-soft opacity-80 blur-3xl" />
        <MarketingContainer className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="primary" className="mb-5">
              <Sparkles className="size-3" aria-hidden="true" />
              Built for practical, growing businesses
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
              Your business, finally in one clear place.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Manage sales, stock, customers, invoices and payments with simple business screens—or ask AI-BOS in the words you already use every day.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className={buttonStyles({ size: "lg", className: "rounded-xl" })}>
                Start free
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="#product-preview"
                className={buttonStyles({ variant: "outline", size: "lg", className: "rounded-xl" })}
              >
                See how it works
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                No card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                Works on phone and desktop
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                Set up in minutes
              </span>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-4">
            {naturalLanguageCommands.map((command) => (
              <div className="rounded-xl border border-border bg-background/80 px-3 py-3 text-center text-xs font-medium text-muted-foreground shadow-sm" key={command}>
                “{command}”
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14" id="product-preview">
            <ProductPreview />
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-background py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="One connected workspace"
            title="Everything needed to run the day—without ERP complexity."
            description="Each workflow shares the same customers, products and payment records, so updates stay consistent from the first order to the final payment."
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <article className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6" key={feature.title}>
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <FeatureIcon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/features" className={buttonStyles({ variant: "soft", className: "rounded-xl" })}>
              Explore every feature
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <SectionHeading
              eyebrow="Made for the shop floor"
              title="Fits the way Indian businesses actually work."
              description="Whether you sell five products or five thousand, AI-BOS keeps common daily tasks familiar and gives you a clearer view of what needs attention."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {businessTypes.map((business) => {
                const BusinessIcon = business.icon;

                return (
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4" key={business.name}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary-soft text-secondary">
                      <BusinessIcon className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{business.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{business.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-background py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="How AI-BOS works"
            title="Start small. Build one reliable operating rhythm."
            description="You do not need a long implementation project. AI-BOS becomes useful from the first customer, product and invoice."
            align="center"
          />
          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Set up your business",
                description: "Choose your business type, invoice prefix and stock preferences. Add one product or skip ahead.",
                icon: Store,
              },
              {
                step: "02",
                title: "Run everyday work",
                description: "Create orders and invoices, record payments and let stock update through connected workflows.",
                icon: ShoppingCart,
              },
              {
                step: "03",
                title: "Act on what matters",
                description: "Use alerts, reports and AI suggestions to follow up payments and restock at the right time.",
                icon: PackageCheck,
              },
            ].map((item) => {
              const StepIcon = item.icon;

              return (
                <li className="relative rounded-2xl border border-border bg-card p-6 shadow-card" key={item.step}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                      <StepIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-2xl font-bold text-border-strong">{item.step}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </li>
              );
            })}
          </ol>
        </MarketingContainer>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-10 rounded-3xl border border-border bg-background p-6 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-12">
            <div>
              <Badge variant="success">Clarity at a glance</Badge>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Spend less time checking registers. More time moving the business forward.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                AI-BOS connects the details that are easy to lose across notebooks, chats and spreadsheets.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Know today’s sales and open orders without manual totals",
                "See every customer balance before making a follow-up call",
                "Catch low stock before it becomes a missed sale",
                "Turn business data into a short, useful action list",
              ].map((benefit) => (
                <li className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium leading-6" key={benefit}>
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-background py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="Simple pricing"
            title="Start free, then upgrade when the work grows."
            description="Every plan includes the core customer, product and business records. Pay for more volume, automation and team access only when you need it."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { name: "Free", price: "₹0", detail: "Basic operations for one user", items: ["Limited invoices", "Limited AI use", "Basic dashboard"] },
              { name: "Pro", price: "₹799", detail: "For active day-to-day businesses", items: ["Unlimited invoices", "Advanced inventory", "Payment reminders"], featured: true },
              { name: "Premium", price: "₹1,599", detail: "For growing teams and automation", items: ["Team management", "Advanced analytics", "WhatsApp integration"] },
            ].map((plan) => (
              <article className={`rounded-2xl border bg-card p-6 ${plan.featured ? "border-primary ring-1 ring-primary" : "border-border"}`} key={plan.name}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  {plan.featured ? <Badge variant="primary">Popular</Badge> : null}
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight tabular-nums">
                  {plan.price}<span className="text-sm font-normal text-muted-foreground"> / month</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.detail}</p>
                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {plan.items.map((item) => (
                    <li className="flex items-center gap-2 text-sm" key={item}>
                      <Check className="size-4 text-success" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className={buttonStyles({ variant: "outline", size: "lg", className: "rounded-xl" })}>
              Compare all plans
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <MarketingContainer className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Questions, answered"
            title="A practical tool should be easy to understand."
            description="Here are the things business owners ask before getting started."
          />
          <FAQList items={faqs} />
        </MarketingContainer>
      </section>

      <MarketingCTA
        title="Give tomorrow’s work a clearer starting point."
        description="Create your AI-BOS workspace, add your first customer or product, and see your business take shape in one place."
      />
    </>
  );
}
