import type { Metadata } from "next";

import { NotificationCenter } from "@/components/notifications";
import { PageHeader } from "@/components/shared";
import { Card } from "@/components/ui";
import { notifications } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  const unread = notifications.filter((item) => !item.isRead).length;
  return (
    <div className="app-page-enter space-y-6">
      <PageHeader eyebrow={`${unread} unread`} title="Notification centre" description="Stay on top of stock, payments, orders, account activity and AI recommendations." />
      <Card className="overflow-hidden"><NotificationCenter initialNotifications={notifications} /></Card>
    </div>
  );
}
