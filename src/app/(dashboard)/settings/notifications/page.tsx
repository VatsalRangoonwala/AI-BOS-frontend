import type { Metadata } from "next";

import { ToggleSettings } from "@/components/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Notification settings" };

const settings = [
  { id: "email", title: "Email notifications", description: "Important invoices, account updates and reports.", enabled: true },
  { id: "sms", title: "SMS notifications", description: "Urgent payment and security alerts.", enabled: false },
  { id: "whatsapp", title: "WhatsApp notifications", description: "Customer reminders and order messages.", enabled: false, premium: true },
  { id: "payments", title: "Payment reminders", description: "Notify you before and after customer due dates.", enabled: true },
  { id: "stock", title: "Stock alerts", description: "Low-stock and out-of-stock warnings.", enabled: true },
  { id: "orders", title: "Order updates", description: "Changes to open and completed orders.", enabled: true },
  { id: "weekly", title: "Weekly business report", description: "A concise Monday summary of sales and cash flow.", enabled: true },
];

export default function NotificationSettingsPage() {
  return <Card><CardHeader><CardTitle>Notification preferences</CardTitle><p className="text-sm text-muted-foreground">Choose which business events should reach you and your team.</p></CardHeader><CardContent><ToggleSettings settings={settings} /></CardContent></Card>;
}
