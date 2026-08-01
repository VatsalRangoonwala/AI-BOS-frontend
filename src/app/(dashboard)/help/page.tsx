import { LifeBuoy } from "lucide-react";
import type { Metadata } from "next";

import { HelpCenter } from "@/components/help";
import { PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Help centre" };

export default function HelpPage() {
  return (
    <div className="app-page-enter space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Guides & answers"
        title="Help centre"
        description="Find clear, task-focused guidance for running your business in AI-BOS."
        actions={[{ label: "Contact support", href: "/support", icon: LifeBuoy, variant: "outline" }]}
      />
      <HelpCenter />
    </div>
  );
}
