import { BookOpen, Mail, MessageCircleMore } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SupportTicketForm, SupportTickets } from "@/components/help";
import { Breadcrumbs, PageHeader } from "@/components/shared";
import { Card, CardContent, buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Help", href: "/help" }, { label: "Support" }]} />
        <PageHeader
          eyebrow="Customer support"
          title="How can we help?"
          description="Send enough context for the support team to investigate without asking you to repeat the basics."
          actions={[{ label: "Browse help articles", href: "/help", icon: BookOpen, variant: "outline" }]}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <SupportTicketForm />
        <div className="space-y-5">
          <Card className="border-primary/20 bg-primary-soft/40">
            <CardContent className="p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><MessageCircleMore className="size-5" /></span>
              <h2 className="mt-4 font-semibold">Response expectations</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Urgent requests are prioritised when a core sales, payment or inventory workflow is blocked. Normal requests typically receive a reply within one business day.</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="size-4" />Replies go to the email in your request.</div>
            </CardContent>
          </Card>
          <SupportTickets />
          <Link href="/help" className={buttonStyles({ variant: "outline", className: "w-full" })}>Search help before opening another ticket</Link>
        </div>
      </div>
    </div>
  );
}
