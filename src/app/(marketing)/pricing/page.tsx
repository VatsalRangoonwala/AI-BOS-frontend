import type { Metadata } from "next";
import { Check, CreditCard, LockKeyhole, Minus, ShieldCheck } from "lucide-react";

import { FAQList, type FAQItem } from "@/components/marketing/faq-list";
import {
  MarketingCTA,
  MarketingContainer,
  MarketingPageHero,
  SectionHeading,
} from "@/components/marketing/marketing-primitives";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare AI-BOS Free, Pro and Premium plans for invoicing, inventory, analytics, AI assistance, payment reminders and team access.",
};

const comparison = [
  { feature: "Users", free: "1", pro: "Up to 3", premium: "Up to 10" },
  { feature: "Invoices", free: "25 / month", pro: "Unlimited", premium: "Unlimited" },
  { feature: "AI actions", free: "20 / month", pro: "200 / month", premium: "Higher usage" },
  { feature: "Customer and product records", free: true, pro: true, premium: true },
  { feature: "Advanced inventory", free: false, pro: true, premium: true },
  { feature: "Payment reminders", free: false, pro: true, premium: true },
  { feature: "AI-generated reports", free: false, pro: true, premium: true },
  { feature: "Advanced analytics", free: false, pro: false, premium: true },
  { feature: "Team roles and permissions", free: false, pro: false, premium: true },
  { feature: "WhatsApp integration", free: false, pro: false, premium: true },
  { feature: "Support", free: "Help centre", pro: "Standard", premium: "Priority" },
] as const;

const pricingFaqs: FAQItem[] = [
  {
    question: "Can I try AI-BOS without a card?",
    answer:
      "Yes. The Free plan does not require payment details. Add a card or choose another Razorpay-supported method only when you decide to upgrade.",
  },
  {
    question: "What happens when I reach an AI usage limit?",
    answer:
      "Your business records and regular screens continue to work. The assistant shows the remaining allowance and a clear limit state, and your usage resets at the start of the next billing period unless you upgrade.",
  },
  {
    question: "Can I switch between monthly and yearly billing?",
    answer:
      "Yes. Plan changes show the new billing amount before confirmation. A yearly plan provides the lower effective monthly rate and is charged once for the full year.",
  },
  {
    question: "Can I cancel a paid plan?",
    answer:
      "You can request cancellation from Subscription settings. Access to paid features continues until the end of the current paid period, then the workspace moves to the available Free limits.",
  },
  {
    question: "Are taxes included in the displayed prices?",
    answer:
      "Displayed plan prices are before applicable taxes. The checkout summary shows the plan amount, tax and final total before you approve payment.",
  },
  {
    question: "Will you connect to my Razorpay merchant account?",
    answer:
      "Razorpay is used to process your AI-BOS subscription. A separate business-payment integration, where available, is configured from workspace integrations and is not required to use the product.",
  },
];

export default function PricingPage() {
  return (
    <>
      <MarketingPageHero
        eyebrow="Clear, scalable pricing"
        title="Pay for the control your business needs today."
        description="Begin with reliable records for free. Add unlimited invoicing, stronger inventory, automation and team access as the work becomes more demanding."
      />

      <section className="bg-background py-14 sm:py-20">
        <MarketingContainer>
          <PricingPlans />
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            Prices are in INR and exclude applicable taxes. Plan limits shown are for the demo product specification and can be reviewed before checkout.
          </p>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <MarketingContainer>
          <SectionHeading
            eyebrow="Feature comparison"
            title="See exactly what changes with each plan."
            description="Core business records stay available on every plan. Upgrades increase volume and add automation, analytics and collaboration."
          />

          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-border md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of AI-BOS Free, Pro and Premium features</caption>
              <thead className="bg-muted/70">
                <tr>
                  <th className="px-5 py-4 font-semibold" scope="col">Feature</th>
                  <th className="w-[18%] px-5 py-4 text-center font-semibold" scope="col">Free</th>
                  <th className="w-[18%] bg-primary-soft px-5 py-4 text-center font-semibold text-primary" scope="col">Pro</th>
                  <th className="w-[18%] px-5 py-4 text-center font-semibold" scope="col">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <th className="px-5 py-4 font-medium" scope="row">{row.feature}</th>
                    <ComparisonValue value={row.free} />
                    <ComparisonValue className="bg-primary-soft/35" value={row.pro} />
                    <ComparisonValue value={row.premium} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 md:hidden">
            {(["free", "pro", "premium"] as const).map((plan) => (
              <article className={`rounded-2xl border bg-background p-5 ${plan === "pro" ? "border-primary" : "border-border"}`} key={plan}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold capitalize">{plan}</h3>
                  {plan === "pro" ? <Badge variant="primary">Most popular</Badge> : null}
                </div>
                <dl className="mt-5 divide-y divide-border">
                  {comparison.map((row) => (
                    <div className="flex items-center justify-between gap-4 py-3 text-sm" key={row.feature}>
                      <dt className="text-muted-foreground">{row.feature}</dt>
                      <dd className="shrink-0 text-right font-medium"><InlineValue value={row[plan]} /></dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </MarketingContainer>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Badge variant="success">
                <ShieldCheck className="size-3" aria-hidden="true" />
                Secure checkout flow
              </Badge>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.04em]">
                Review the full amount before you pay.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                The subscription checkout shows your selected plan, billing frequency, price, tax and final total. Payment is then handled through a Razorpay-style secure payment step.
              </p>
              <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" />Clear renewal date</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" />No hidden plan fee</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" />Billing history in-app</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden="true" />Payment status confirmation</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><CreditCard className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-semibold">Razorpay checkout</p><p className="text-xs text-muted-foreground">Payment provider placeholder</p></div></div>
                <LockKeyhole className="size-4 text-success" aria-label="Secure" />
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Pro · yearly</dt><dd className="font-medium tabular-nums">₹9,588</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Tax</dt><dd className="font-medium">Calculated at checkout</dd></div>
                <div className="flex justify-between gap-4 border-t border-border pt-4 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">Shown before payment</dd></div>
              </dl>
              <div className="mt-5 rounded-xl bg-muted p-3 text-center text-xs leading-5 text-muted-foreground">
                This frontend preview does not collect or transmit payment details.
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <MarketingContainer className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading eyebrow="Pricing FAQ" title="Know what you pay for before you choose." description="Straight answers about limits, billing, upgrades and payment handling." />
          <FAQList items={pricingFaqs} />
        </MarketingContainer>
      </section>

      <MarketingCTA title="Start on Free. Upgrade because it earns its place." description="Build a reliable operating habit first, then choose the plan that matches your invoice volume, automation and team." />
    </>
  );
}

function ComparisonValue({ value, className = "" }: { value: string | boolean; className?: string }) {
  return (
    <td className={`px-5 py-4 text-center ${className}`}>
      <InlineValue value={value} />
    </td>
  );
}

function InlineValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") return <span>{value}</span>;

  return value ? (
    <><Check className="mx-auto size-4 text-success" aria-hidden="true" /><span className="sr-only">Included</span></>
  ) : (
    <><Minus className="mx-auto size-4 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Not included</span></>
  );
}

