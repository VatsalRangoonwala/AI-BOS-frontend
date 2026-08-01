import type { Metadata } from "next";
import { Clock3, LifeBuoy, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ContactForm } from "@/components/marketing/contact-form";
import {
  MarketingContainer,
  MarketingPageHero,
} from "@/components/marketing/marketing-primitives";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the AI-BOS team with product, setup, billing, partnership or support questions.",
};

export default function ContactPage() {
  return (
    <>
      <MarketingPageHero
        eyebrow="Contact AI-BOS"
        title="Tell us what you are trying to solve."
        description="Questions about setup, plans or a specific workflow are welcome. Give us the useful context and we will route your message to the right person."
      />

      <section className="bg-background py-14 sm:py-20">
        <MarketingContainer>
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <aside className="space-y-4" aria-label="Contact options">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <Badge variant="success">Typical reply within one business day</Badge>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">We will start with the details you send.</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Include the screen, task or outcome involved. For account-specific help, use the email associated with your workspace.
                </p>
                <div className="mt-6 space-y-5 border-t border-border pt-6">
                  <ContactMethod
                    icon={Mail}
                    title="Email"
                    detail="support@ai-bos.in"
                    href="mailto:support@ai-bos.in"
                  />
                  <ContactMethod
                    icon={Clock3}
                    title="Support hours"
                    detail="Monday–Saturday · 9:00 AM–6:00 PM IST"
                  />
                  <ContactMethod
                    icon={MessageSquareText}
                    title="Existing customers"
                    detail="Open Support in your workspace to include account context."
                    href="/support"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-primary-soft p-5">
                <div className="flex items-start gap-3">
                  <LifeBuoy className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-semibold">Need an answer right now?</h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      The help centre covers setup, customers, stock, invoices, payments and AI usage.
                    </p>
                    <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline" href="/help">
                      Visit the help centre
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                <p className="text-xs leading-5 text-muted-foreground">
                  Never send a password, OTP, full card number or other sensitive credential through this form.
                </p>
              </div>
            </aside>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="border-b border-border px-5 py-5 sm:px-8">
                <h2 className="text-xl font-bold tracking-tight">Send a message</h2>
                <p className="mt-1 text-sm text-muted-foreground">All fields are required so we can respond with useful context.</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </MarketingContainer>
      </section>
    </>
  );
}

function ContactMethod({
  icon: MethodIcon,
  title,
  detail,
  href,
}: {
  icon: typeof Mail;
  title: string;
  detail: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <MethodIcon className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span>
      </span>
    </>
  );

  return href ? (
    <Link className="flex items-start gap-3 rounded-lg hover:text-primary" href={href}>
      {content}
    </Link>
  ) : (
    <div className="flex items-start gap-3">{content}</div>
  );
}

