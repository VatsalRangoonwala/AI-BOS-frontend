import type { Metadata } from "next";

import { BusinessSettingsView } from "@/components/settings/business-settings-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Business settings" };

export default function BusinessSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business details</CardTitle>
        <p className="text-sm text-muted-foreground">
          These details appear across invoices, receipts and customer messages.
        </p>
      </CardHeader>
      <CardContent>
        <BusinessSettingsView />
      </CardContent>
    </Card>
  );
}
