export type ISODateString = string;
export type CurrencyCode = "INR";

export type UserRole = "owner" | "admin" | "member";
export type UserStatus = "active" | "invited" | "locked" | "suspended";
export type BusinessType =
  | "mobile_shop"
  | "electronics_store"
  | "grocery_store"
  | "garment_store"
  | "wholesaler"
  | "other_retail";
export type TeamMemberRole = "business_owner" | "manager" | "staff";
export type TeamMemberStatus = "active" | "pending" | "deactivated";
export type TeamPermission =
  | "manage_business"
  | "manage_team"
  | "manage_customers"
  | "manage_products"
  | "manage_inventory"
  | "manage_invoices"
  | "manage_orders"
  | "record_payments"
  | "view_analytics";

export type CustomerStatus = "active" | "inactive";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type UnitType =
  | "piece"
  | "box"
  | "pack"
  | "kilogram"
  | "gram"
  | "litre"
  | "metre";
export type InventoryAdjustmentType =
  | "opening_stock"
  | "purchase"
  | "sale"
  | "customer_return"
  | "supplier_return"
  | "damage"
  | "correction";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";
export type InvoiceDeliveryStatus =
  | "not_sent"
  | "sent"
  | "delivered"
  | "viewed"
  | "failed";
export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";
export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "refunded"
  | "failed";
export type PaymentTransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded";
export type PaymentMethod =
  | "cash"
  | "upi"
  | "card"
  | "bank_transfer"
  | "other";
export type ReminderChannel = "email" | "sms" | "whatsapp";
export type ReminderStatus =
  | "draft"
  | "scheduled"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled";

export type NotificationType =
  | "low_stock_alert"
  | "payment_received"
  | "payment_overdue"
  | "invoice_viewed"
  | "order_updated"
  | "subscription_alert"
  | "team_activity"
  | "ai_recommendation";
export type NotificationCategory =
  | "inventory"
  | "payments"
  | "orders"
  | "system";

export type PlanName = "free" | "pro" | "premium";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "expired";

export type AIMessageRole = "user" | "assistant" | "system" | "tool";
export type AIMessageStatus =
  | "sending"
  | "thinking"
  | "tool_running"
  | "confirmation_required"
  | "success"
  | "failed"
  | "usage_limit_reached"
  | "offline";
export type AIFeedback = "up" | "down" | null;
export type AIActionType =
  | "confirm"
  | "edit"
  | "cancel"
  | "navigate"
  | "regenerate"
  | "copy";
export type AIResultType =
  | "invoice"
  | "analytics"
  | "inventory"
  | "customer"
  | "payment"
  | "order";

export interface PostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: "India";
}

export interface User {
  id: string;
  businessId: string;
  fullName: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  preferredLanguage: "English" | "Hindi";
  timeZone: "Asia/Kolkata";
  emailVerifiedAt: ISODateString | null;
  lastLoginAt: ISODateString | null;
  createdAt: ISODateString;
}

export interface BusinessPreferences {
  defaultCurrency: CurrencyCode;
  invoicePrefix: string;
  financialYear: string;
  lowStockThreshold: number;
  paymentRemindersEnabled: boolean;
  stockAlertsEnabled: boolean;
  defaultPaymentTermsDays: number;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  email: string;
  mobile: string;
  logoUrl?: string;
  address: PostalAddress;
  taxIdentification?: string;
  preferences: BusinessPreferences;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface TeamMember {
  id: string;
  userId: string | null;
  businessId: string;
  fullName: string;
  email: string;
  mobile?: string;
  avatarUrl?: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  permissions: TeamPermission[];
  invitedAt?: ISODateString;
  joinedAt?: ISODateString;
  lastActiveAt?: ISODateString;
}

export interface Customer {
  id: string;
  businessId: string;
  fullName: string;
  mobile: string;
  email?: string;
  address?: PostalAddress;
  city: string;
  notes?: string;
  openingBalance: number;
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
  status: CustomerStatus;
  createdAt: ISODateString;
  lastTransactionAt: ISODateString | null;
}

export interface CustomerLedgerEntry {
  id: string;
  businessId: string;
  customerId: string;
  date: ISODateString;
  transactionType: "opening_balance" | "invoice" | "payment" | "credit_note";
  description: string;
  referenceId?: string;
  referenceNumber?: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  description: string;
  imageUrl?: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  unit: UnitType;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface InventoryAdjustment {
  id: string;
  businessId: string;
  productId: string;
  date: ISODateString;
  type: InventoryAdjustmentType;
  previousQuantity: number;
  changedQuantity: number;
  newQuantity: number;
  reason: string;
  notes?: string;
  changedBy: string;
  relatedInvoiceId?: string;
  relatedOrderId?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  customerId: string;
  orderId?: string;
  billingAddress?: PostalAddress;
  invoiceDate: ISODateString;
  dueDate: ISODateString;
  reference?: string;
  notes?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  deliveryStatus: InvoiceDeliveryStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  businessId: string;
  orderNumber: string;
  customerId: string;
  invoiceId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  orderDate: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Payment {
  id: string;
  businessId: string;
  customerId: string;
  invoiceId: string;
  amount: number;
  paymentDate: ISODateString;
  method: PaymentMethod;
  status: PaymentTransactionStatus;
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
  createdAt: ISODateString;
}

export interface PaymentReminder {
  id: string;
  businessId: string;
  customerId: string;
  invoiceId: string;
  outstandingAmount: number;
  dueDate: ISODateString;
  channel: ReminderChannel;
  status: ReminderStatus;
  lastSentAt: ISODateString | null;
  scheduledFor: ISODateString | null;
  message: string;
  createdAt: ISODateString;
}

export interface Notification {
  id: string;
  businessId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  description: string;
  href?: string;
  entityId?: string;
  isRead: boolean;
  readAt: ISODateString | null;
  createdAt: ISODateString;
}

export interface UsageQuota {
  used: number;
  limit: number | null;
  periodStart: ISODateString;
  periodEnd: ISODateString;
}

export interface Subscription {
  id: string;
  businessId: string;
  plan: PlanName;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  price: number;
  currency: CurrencyCode;
  startedAt: ISODateString;
  currentPeriodStart: ISODateString;
  currentPeriodEnd: ISODateString;
  renewalDate: ISODateString | null;
  cancelAtPeriodEnd: boolean;
  aiUsage: UsageQuota;
  invoiceUsage: UsageQuota;
  teamMemberUsage: UsageQuota;
  features: string[];
  paymentMethod: {
    provider: "Razorpay";
    type: "card" | "upi" | "netbanking";
    displayName: string;
    lastFour?: string;
  } | null;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
  previousValue?: number;
}

export interface RankedMetric {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AnalyticsSummary {
  businessId: string;
  period: {
    label: string;
    startDate: ISODateString;
    endDate: ISODateString;
  };
  grossSales: number;
  collectedAmount: number;
  outstandingAmount: number;
  averageOrderValue: number;
  salesGrowthPercentage: number;
  totalOrders: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  newCustomers: number;
  returningCustomers: number;
  revenueTrend: AnalyticsDataPoint[];
  topProducts: RankedMetric[];
  topCustomers: RankedMetric[];
  paymentMethodTotals: Partial<Record<PaymentMethod, number>>;
  aiInsights: string[];
}

export interface AIAction {
  id: string;
  label: string;
  type: AIActionType;
  href?: string;
  requiresConfirmation?: boolean;
}

export interface AIResultCard {
  type: AIResultType;
  title: string;
  summary: string;
  relatedEntityId?: string;
  fields: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIMessageRole;
  content: string;
  status: AIMessageStatus;
  timestamp: ISODateString;
  actions?: AIAction[];
  resultCard?: AIResultCard;
  feedback: AIFeedback;
  errorMessage?: string;
}

export interface AIConversation {
  id: string;
  businessId: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  archivedAt: ISODateString | null;
}
