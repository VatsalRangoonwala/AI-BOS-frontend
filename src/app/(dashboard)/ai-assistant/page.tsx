import type { Metadata } from "next";

import { AIWorkspace } from "@/components/ai";
import { aiConversations, analyticsSummary, currentBusiness, currentSubscription } from "@/lib/mock-data";

export const metadata: Metadata = { title: "AI Assistant" };

export default function AIAssistantPage() {
  return (
    <AIWorkspace
      conversations={aiConversations}
      business={currentBusiness}
      subscription={currentSubscription}
      monthlySales={analyticsSummary.grossSales}
      outstanding={analyticsSummary.outstandingAmount}
      lowStock={analyticsSummary.lowStockCount + analyticsSummary.outOfStockCount}
    />
  );
}
