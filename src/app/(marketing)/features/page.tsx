import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Boxes,
  CheckCircle2,
  FileText,
  IndianRupee,
  LockKeyhole,
  MessageCircleMore,
  PackageSearch,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRoundCheck,
  Users,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";

import {
  MarketingCTA,
  MarketingContainer,
  MarketingPageHero,
  SectionHeading,
} from "@/components/marketing/marketing-primitives";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore AI-BOS tools for customers, stock, invoices, orders, payments, analytics, notifications, teams and WhatsApp workflows.",
};

const operationFeatures: Array<{
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
  metric: string;
  metricLabel: string;
}> = [
  {
    id: "customer-management",
    title: "Customer management",
    description: "A useful customer record, not just an address book.",
    points: ["Purchases, orders and payments in one timeline", "Running ledger and reliable outstanding balance", "Notes and reminder-ready contact details"],
    icon: Users,
    metric: "₹2,297",
    metricLabel: "Rahul Sharma · balance due",
  },
  {
    id: "inventory-management",
    title: "Inventory management",
    description: "Know what is available, what moved and what needs ordering.",
    points: ["Low-stock and out-of-stock alerts", "Adjustment history with reason and team member", "Sales velocity and suggested reorder quantity"],
    icon: Boxes,
    metric: "8 units",
    metricLabel: "boAt earphones · threshold 10",
  },
  {
    id: "invoice-management",
    title: "Invoice management",
    description: "Build professional invoices without slowing down a sale.",
    points: ["Saved customer and product selectors", "Flexible discounts and simple tax setting", "Draft, send, print, share and payment timeline"],
    icon: FileText,
    metric: "SME-1042",
    metricLabel: "Part paid · ₹2,297 remaining",
  },
  {
    id: "order-management",
    title: "Order management",
    description: "Move from enquiry to fulfilment with a clear status trail.",
    points: ["Draft through completed order states", "Stock-aware product selection", "Create an invoice directly from an order"],
    icon: ShoppingBag,
    metric: "2 pending",
    metricLabel: "Orders that need action today",
  },
  {
    id: "payment-tracking",
    title: "Payment tracking",
    description: "See what came in, what remains and who needs a reminder.",
    points: ["Cash, UPI, card and bank transfer records", "Partial payments matched to invoices", "Overdue ageing and scheduled reminders"],
    icon: IndianRupee,
    metric: "₹8,390",
    metricLabel: "Outstanding across 3 customers",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "A focused feed of events that deserve attention.",
    points: ["Stock, payment, order and subscription alerts", "Open the related record in one tap", "Mark, filter or clear updates when resolved"],
    icon: BellRing,
    metric: "3 unread",
    metricLabel: "One urgent payment alert",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingPageHero
        eyebrow="Complete business workspace"
        title="Everyday operations, connected by one useful AI."
        description="AI-BOS keeps customers, products, invoices, orders and payments in sync—then helps you understand and act on that shared business picture."
        primaryAction={{ label: "Start free", href: "/register" }}
        secondaryAction={{ label: "Compare plans", href: "/pricing" }}
      >
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
          {["Customers", "Inventory", "Invoices", "Payments", "AI insights"].map((label, index) => (
            <div className="rounded-xl border border-border bg-background/80 p-3 text-center" key={label}>
              <span className="mx-auto grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {index + 1}
              </span>
              <p className="mt-2 text-xs font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </MarketingPageHero>

      <section className="bg-background py-16 sm:py-20" id="ai-assistant">
        <MarketingContainer>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Badge variant="primary">
                <WandSparkles className="size-3" aria-hidden="true" />
                AI Business Assistant
              </Badge>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Ask a business question. Get an answer you can act on.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                AI-BOS uses the records already in your workspace to return structured results—not vague chat. It can find unpaid customers, prepare invoices, surface stock risk and summarise sales.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Suggested next actions alongside every result",
                  "Editable previews before records are created",
                  "Explicit confirmation for financial or destructive actions",
                  "Usage visibility and clear failure or offline states",
                ].map((point) => (
                  <li className="flex gap-3 text-sm leading-6" key={point}>
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">AI Business Assistant</h3>
                    <p className="text-xs text-success">Connected to your workspace</p>
                  </div>
                </div>
                <Badge variant="outline">68 / 200 actions</Badge>
              </div>
              <div className="mt-5 space-y-4">
                <div className="ml-auto max-w-md rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">
                  Create an invoice for Rahul with 2 boAt earphones and one Samsung charger.
                </div>
                <div className="max-w-lg rounded-2xl rounded-bl-md border border-border bg-background p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4 text-primary" aria-hidden="true" />
                    Invoice ready to review
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs text-muted-foreground">Customer</dt><dd className="mt-1 font-medium">Rahul Sharma</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Invoice</dt><dd className="mt-1 font-medium">SME-1042</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Items</dt><dd className="mt-1 font-medium">3 units</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Total</dt><dd className="mt-1 font-bold tabular-nums">₹4,297</dd></div>
                  </dl>
                  <div className="mt-4 rounded-xl border border-warning/25 bg-warning-soft p-3 text-xs leading-5 text-warning">
                    Please confirm before this invoice is created and stock is updated.
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" type="button">Confirm invoice</button>
                    <button className="min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-semibold" type="button">Edit details</button>
                    <button className="min-h-11 rounded-xl px-4 text-sm font-semibold text-muted-foreground" type="button">Cancel</button>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex min-h-12 items-center rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
                Ask AI-BOS about your business…
                <span className="ml-auto grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Send className="size-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="Daily operations"
            title="Details stay connected from sale to settlement."
            description="Each area is focused enough for a quick task, while the underlying records stay aligned across the business."
            align="center"
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {operationFeatures.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <article className="scroll-mt-24 rounded-2xl border border-border bg-background p-5 sm:p-6" id={feature.id} key={feature.id}>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                        <FeatureIcon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold">{feature.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl border border-border bg-card px-4 py-3 sm:text-right">
                      <p className="text-base font-bold tabular-nums">{feature.metric}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{feature.metricLabel}</p>
                    </div>
                  </div>
                  <ul className="mt-5 grid gap-2 border-t border-border pt-5 sm:grid-cols-3">
                    {feature.points.map((point) => (
                      <li className="flex gap-2 text-xs leading-5 text-muted-foreground" key={point}>
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-background py-16 sm:py-20" id="analytics">
        <MarketingContainer>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="success">Analytics</Badge>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight">See the pattern, not just the total.</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Follow revenue, product movement, customer behaviour and payment health with focused filters and readable charts.</p>
                </div>
                <BarChart3 className="size-7 shrink-0 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-8 flex h-44 items-end gap-3 rounded-2xl bg-muted/60 p-4" aria-label="Illustrative monthly sales chart" role="img">
                {[42, 58, 49, 72, 64, 86, 78, 96].map((height, index) => (
                  <div className="flex flex-1 flex-col justify-end" key={height + index}>
                    <div className="rounded-t-md bg-primary/80" style={{ height: `${height}%` }} />
                    <span className="mt-2 text-center text-[9px] text-muted-foreground">W{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['Sales growth', '+12.4%'], ['Average order', '₹3,377'], ['Collected', '₹8,493']].map(([label, value]) => (
                  <div className="rounded-xl border border-border p-3" key={label}>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-bold tabular-nums">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <Badge variant="primary">AI-generated insights</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight">A short recommendation beside the numbers.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">AI-BOS highlights the finding, explains why it matters and proposes a sensible next action.</p>
              <div className="mt-7 space-y-3">
                {[
                  { icon: PackageSearch, title: "Stock risk", detail: "boAt earphones may sell out within five days.", action: "Review 24-unit reorder" },
                  { icon: IndianRupee, title: "Payment follow-up", detail: "Amit Patel’s ₹3,598 invoice is 15 days overdue.", action: "Prepare reminder" },
                  { icon: UserRoundCheck, title: "Customer trend", detail: "Five customers returned to purchase this month.", action: "View top customers" },
                ].map((insight) => {
                  const InsightIcon = insight.icon;

                  return (
                    <div className="rounded-xl border border-border bg-background p-4" key={insight.title}>
                      <div className="flex items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><InsightIcon className="size-4" aria-hidden="true" /></span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold">{insight.title}</h3>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{insight.detail}</p>
                          <p className="mt-2 text-xs font-semibold text-primary">{insight.action} →</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="Grow without losing control"
            title="Bring the team and customer conversations into the workflow."
            description="Premium capabilities add collaboration and messaging while keeping access and confirmation visible."
            align="center"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="scroll-mt-24 rounded-2xl border border-border bg-background p-6 sm:p-8" id="team-management">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary-soft text-secondary"><Users className="size-6" aria-hidden="true" /></span>
                <div><Badge variant="outline">Premium</Badge><h2 className="mt-2 text-xl font-bold">Team management</h2></div>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">Invite managers or staff, choose practical permissions and see whether an invitation is pending, active or deactivated.</p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[["Owner", "Full access"], ["Manager", "Operations"], ["Staff", "Daily tasks"]].map(([role, access]) => (
                  <div className="rounded-xl border border-border bg-card p-3" key={role}><p className="text-xs font-semibold">{role}</p><p className="mt-1 text-[10px] text-muted-foreground">{access}</p></div>
                ))}
              </div>
            </article>

            <article className="scroll-mt-24 rounded-2xl border border-border bg-background p-6 sm:p-8" id="whatsapp-integration">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-success-soft text-success"><MessageCircleMore className="size-6" aria-hidden="true" /></span>
                <div><Badge variant="outline">Premium</Badge><h2 className="mt-2 text-xl font-bold">WhatsApp integration</h2></div>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">Prepare invoice shares, payment reminders and order updates from the record the conversation belongs to. Every send is previewed and confirmed first.</p>
              <div className="mt-6 rounded-xl border border-success/20 bg-success-soft p-4">
                <p className="text-xs font-semibold text-foreground">Reminder preview</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Hello Amit, ₹3,598 for invoice SME-1038 is overdue. Please let us know if payment has already been made.</p>
              </div>
            </article>
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-background py-14">
        <MarketingContainer>
          <div className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
            {[
              { icon: ShieldCheck, title: "Confirmation first", detail: "Review financial and destructive actions before they run." },
              { icon: LockKeyhole, title: "Permission aware", detail: "Give each team role only the access needed for its work." },
              { icon: Sparkles, title: "AI with context", detail: "Answers use connected business records and show their working state." },
            ].map((item) => {
              const ItemIcon = item.icon;
              return <div className="flex items-start gap-3" key={item.title}><ItemIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-sm font-semibold">{item.title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p></div></div>;
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className={buttonStyles({ variant: "outline", className: "rounded-xl" })}>
              Find the right plan
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </MarketingContainer>
      </section>

      <MarketingCTA title="Put every part of the work on the same page." description="Start with customers and invoices, then turn on inventory, reminders, analytics and AI as your workflow grows." />
    </>
  );
}

