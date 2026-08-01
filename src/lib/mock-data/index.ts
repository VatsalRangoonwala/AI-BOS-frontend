export * from "./account";
export * from "./commerce";
export * from "./customers";
export * from "./insights";
export * from "./products";

import {
  currentBusiness,
  currentSubscription,
  currentUser,
  teamMembers,
} from "./account";
import { invoices, orders, paymentReminders, payments } from "./commerce";
import { customerLedgerEntries, customers } from "./customers";
import {
  aiConversations,
  analyticsSummary,
  dashboardMetrics,
  notifications,
} from "./insights";
import { inventoryAdjustments, products } from "./products";

export const mockData = {
  currentUser,
  currentBusiness,
  teamMembers,
  currentSubscription,
  customers,
  customerLedgerEntries,
  products,
  inventoryAdjustments,
  invoices,
  orders,
  payments,
  paymentReminders,
  notifications,
  analyticsSummary,
  dashboardMetrics,
  aiConversations,
} as const;

