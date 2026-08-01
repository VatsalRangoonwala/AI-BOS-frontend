import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  ReceiptIndianRupee,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

import { orders } from "@/lib/mock-data/commerce";
import { notifications } from "@/lib/mock-data/insights";
import { products } from "@/lib/mock-data/products";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

// Drafts are still being prepared, while completed/cancelled orders need no
// operational follow-up. Active orders are those currently in fulfilment.
export const activeOrderStatuses = ["pending", "confirmed", "processing"] as const;

export const navigationCounts = {
  lowStockAlerts: products.filter((product) => product.stockStatus !== "in_stock").length,
  activeOrders: orders.filter((order) =>
    (activeOrderStatuses as readonly string[]).includes(order.status),
  ).length,
  unreadNotifications: notifications.filter((notification) => !notification.isRead).length,
} as const;

function badgeFor(count: number) {
  return count > 0 ? String(count) : undefined;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Inventory", href: "/inventory", icon: Boxes, badge: badgeFor(navigationCounts.lowStockAlerts) },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Orders", href: "/orders", icon: ShoppingBag, badge: badgeFor(navigationCounts.activeOrders) },
  { label: "Payments", href: "/payments", icon: ReceiptIndianRupee },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: badgeFor(navigationCounts.unreadNotifications) },
  { label: "Subscription", href: "/subscription", icon: CreditCard },
  { label: "Settings", href: "/settings/profile", icon: Settings },
];

export const secondaryNavigation: NavigationItem[] = [
  { label: "Help centre", href: "/help", icon: CircleHelp },
  { label: "Business settings", href: "/settings/business", icon: Building2 },
];

export const quickCreateItems = [
  { label: "Create invoice", href: "/invoices/new", icon: FileText, description: "Make and share a new invoice" },
  { label: "Add product", href: "/products/new", icon: Package, description: "Add an item to your catalogue" },
  { label: "Add customer", href: "/customers/new", icon: Users, description: "Save a new customer profile" },
  { label: "Create order", href: "/orders/new", icon: ShoppingBag, description: "Record a customer order" },
  { label: "Record payment", href: "/payments/record", icon: ReceiptIndianRupee, description: "Log a received payment" },
];

export const marketingNavigation = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
