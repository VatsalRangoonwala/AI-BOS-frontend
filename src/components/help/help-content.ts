export type HelpCategoryId =
  | "getting-started"
  | "sales-invoices"
  | "inventory-products"
  | "payments-customers"
  | "ai-automation"
  | "account-security";

export type HelpCategory = {
  id: HelpCategoryId;
  title: string;
  description: string;
  icon: "rocket" | "receipt" | "package" | "wallet" | "sparkles" | "shield";
};

export type HelpSection = {
  id: string;
  heading: string;
  body: string;
  steps?: string[];
  bullets?: string[];
  note?: string;
};

export type HelpArticleContent = {
  slug: string;
  categoryId: HelpCategoryId;
  title: string;
  summary: string;
  keywords: string[];
  readMinutes: number;
  updatedAt: string;
  featured?: boolean;
  sections: HelpSection[];
  relatedSlugs: string[];
};

export const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting started",
    description: "Set up your business workspace and learn the daily workflow.",
    icon: "rocket",
  },
  {
    id: "sales-invoices",
    title: "Sales & invoices",
    description: "Create orders, issue invoices and keep customer balances accurate.",
    icon: "receipt",
  },
  {
    id: "inventory-products",
    title: "Products & inventory",
    description: "Build your catalogue, track stock and resolve quantity differences.",
    icon: "package",
  },
  {
    id: "payments-customers",
    title: "Payments & customers",
    description: "Manage customer ledgers, collections and payment follow-ups.",
    icon: "wallet",
  },
  {
    id: "ai-automation",
    title: "AI assistant",
    description: "Ask business questions and safely review AI-suggested actions.",
    icon: "sparkles",
  },
  {
    id: "account-security",
    title: "Account & security",
    description: "Control team access, subscriptions and account protection.",
    icon: "shield",
  },
];

export const helpArticles: HelpArticleContent[] = [
  {
    slug: "set-up-your-business-workspace",
    categoryId: "getting-started",
    title: "Set up your business workspace",
    summary: "Add business details, invoice defaults and stock preferences before your first transaction.",
    keywords: ["setup", "business", "gst", "invoice prefix", "preferences"],
    readMinutes: 4,
    updatedAt: "2026-07-28T10:00:00.000Z",
    featured: true,
    sections: [
      {
        id: "before-you-start",
        heading: "Before you start",
        body: "Keep your business address, contact details and tax identification nearby. These details are reused on invoices and customer communications.",
        bullets: ["Business name and primary mobile number", "Billing address and PIN code", "GSTIN, if your business is registered", "Preferred invoice prefix and payment terms"],
      },
      {
        id: "complete-profile",
        heading: "Complete the business profile",
        body: "Open Settings, choose Business, and review every field that will appear on customer-facing documents.",
        steps: ["Open Settings from the sidebar.", "Select Business details.", "Add the business identity, address and tax information.", "Save and review the confirmation message."],
        note: "Changing an invoice prefix affects new invoices only. Existing invoice numbers stay unchanged.",
      },
      {
        id: "choose-defaults",
        heading: "Choose sensible defaults",
        body: "Set payment terms and a default low-stock threshold that match how your shop operates. You can override these values on individual products or invoices later.",
      },
    ],
    relatedSlugs: ["create-your-first-invoice", "build-your-product-catalogue", "invite-team-members-safely"],
  },
  {
    slug: "create-your-first-invoice",
    categoryId: "sales-invoices",
    title: "Create and send your first invoice",
    summary: "Turn customer and product records into a clear invoice with accurate totals and due dates.",
    keywords: ["invoice", "billing", "send", "pdf", "due date"],
    readMinutes: 5,
    updatedAt: "2026-07-31T09:20:00.000Z",
    featured: true,
    sections: [
      {
        id: "prepare-records",
        heading: "Prepare the customer and products",
        body: "Invoices connect to saved customers and catalogue items. Add missing records first so balances and inventory remain linked across reports.",
      },
      {
        id: "create-invoice",
        heading: "Create the invoice",
        body: "Use the Create invoice action from the dashboard or invoice list.",
        steps: ["Choose a customer.", "Add products, quantities and any line discount.", "Review tax, due date and the final balance.", "Save as a draft or issue the invoice."],
        note: "Always review stock availability before issuing a large invoice. Drafts do not represent a completed sale.",
      },
      {
        id: "after-issuing",
        heading: "After issuing",
        body: "Use the invoice detail page to review delivery status, record a payment or send a reminder. The customer ledger updates when connected transactions are recorded.",
      },
    ],
    relatedSlugs: ["record-and-match-a-payment", "send-a-payment-reminder", "set-up-your-business-workspace"],
  },
  {
    slug: "build-your-product-catalogue",
    categoryId: "inventory-products",
    title: "Build your product catalogue",
    summary: "Add SKUs, barcodes, prices and stock thresholds that make daily sales faster.",
    keywords: ["product", "sku", "barcode", "price", "catalogue"],
    readMinutes: 4,
    updatedAt: "2026-07-30T06:45:00.000Z",
    featured: true,
    sections: [
      {
        id: "identifiers",
        heading: "Use reliable identifiers",
        body: "Give every product a unique SKU. If the packaged item has a barcode, store it as well so a future scanner integration can identify the record.",
        bullets: ["Keep SKUs short and readable", "Avoid reusing a retired product’s barcode", "Use categories consistently", "Add a description staff can recognise"],
      },
      {
        id: "pricing-stock",
        heading: "Set pricing and opening stock",
        body: "Purchase price drives inventory valuation, while selling price appears in new transactions. Opening stock should match the physical quantity counted during setup.",
        note: "After a product is created, use a stock adjustment instead of editing the opening quantity. This preserves the audit trail.",
      },
      {
        id: "alerts",
        heading: "Configure stock alerts",
        body: "Choose a threshold that leaves enough time to reorder. Fast-moving or slow-to-source products usually need a higher threshold.",
      },
    ],
    relatedSlugs: ["understand-stock-adjustments", "work-without-a-stable-connection", "create-your-first-invoice"],
  },
  {
    slug: "understand-stock-adjustments",
    categoryId: "inventory-products",
    title: "Understand stock adjustments",
    summary: "Correct inventory safely while preserving who changed what, when and why.",
    keywords: ["inventory", "adjustment", "stock", "damage", "restock", "correction"],
    readMinutes: 4,
    updatedAt: "2026-08-01T04:10:00.000Z",
    sections: [
      {
        id: "when-to-adjust",
        heading: "When to adjust stock",
        body: "Use a manual adjustment for supplier deliveries, damaged items, returns or a verified physical-count difference. Completed sales create their own movements.",
      },
      {
        id: "record-movement",
        heading: "Record a movement",
        body: "Open Inventory and choose Adjust stock.",
        steps: ["Select the product.", "Choose whether stock is being added or removed.", "Enter the verified quantity and reason.", "Review the projected stock, then confirm."],
        note: "The system prevents a removal that would make stock negative. Recount the item if the available quantity looks wrong.",
      },
      {
        id: "audit-history",
        heading: "Review the audit history",
        body: "The adjustments page shows the previous quantity, change, resulting quantity and team member. Use this history when reconciling a physical count.",
      },
    ],
    relatedSlugs: ["build-your-product-catalogue", "invite-team-members-safely", "use-the-ai-business-assistant"],
  },
  {
    slug: "record-and-match-a-payment",
    categoryId: "payments-customers",
    title: "Record and match a customer payment",
    summary: "Apply money received to the correct invoice and keep the customer ledger balanced.",
    keywords: ["payment", "upi", "cash", "invoice", "ledger", "reference"],
    readMinutes: 4,
    updatedAt: "2026-07-29T11:15:00.000Z",
    featured: true,
    sections: [
      {
        id: "verify-payment",
        heading: "Verify the payment first",
        body: "Confirm the amount, payment date and bank or UPI reference before recording it. This helps prevent duplicate entries.",
      },
      {
        id: "record-payment",
        heading: "Record the payment",
        body: "Open Payments and choose Record payment.",
        steps: ["Choose the customer and unpaid invoice.", "Enter the amount received.", "Select the payment method and date.", "Add the transaction reference, then confirm."],
      },
      {
        id: "partial-payments",
        heading: "Handle partial payments",
        body: "If the amount is lower than the invoice balance, the invoice remains partially paid. The remaining amount stays visible in outstanding payments and reminders.",
      },
    ],
    relatedSlugs: ["send-a-payment-reminder", "create-your-first-invoice", "add-customers-and-opening-balances"],
  },
  {
    slug: "send-a-payment-reminder",
    categoryId: "payments-customers",
    title: "Send a useful payment reminder",
    summary: "Follow up on an outstanding invoice with the right amount, due date and tone.",
    keywords: ["reminder", "overdue", "payment", "whatsapp", "follow up"],
    readMinutes: 3,
    updatedAt: "2026-07-27T08:30:00.000Z",
    sections: [
      {
        id: "choose-invoice",
        heading: "Choose the correct invoice",
        body: "Start from Outstanding payments or the customer profile. Check recent payments before contacting the customer.",
      },
      {
        id: "review-message",
        heading: "Review the message",
        body: "A clear reminder includes the invoice number, due date, outstanding amount and a simple way to respond. Keep the tone polite and direct.",
        bullets: ["Avoid sending repeated reminders too close together", "Use the customer’s preferred channel", "Confirm any payment promise in the customer notes"],
      },
    ],
    relatedSlugs: ["record-and-match-a-payment", "add-customers-and-opening-balances", "create-your-first-invoice"],
  },
  {
    slug: "add-customers-and-opening-balances",
    categoryId: "payments-customers",
    title: "Add customers and opening balances",
    summary: "Start a customer ledger with clean contact details and the correct amount already due.",
    keywords: ["customer", "mobile", "opening balance", "ledger", "duplicate"],
    readMinutes: 4,
    updatedAt: "2026-07-26T07:10:00.000Z",
    sections: [
      {
        id: "avoid-duplicates",
        heading: "Avoid duplicate customer records",
        body: "Search by mobile number before adding a customer. AI-BOS warns when a number already matches another customer, but you should confirm the identity before saving.",
      },
      {
        id: "opening-balance",
        heading: "Enter an opening balance carefully",
        body: "Use the amount the customer owed before you began using AI-BOS. It becomes the first debit in their ledger.",
        note: "Do not include invoices you will enter separately, or the balance will be counted twice.",
      },
      {
        id: "review-profile",
        heading: "Review the customer profile",
        body: "The profile connects purchases, payments, invoices, orders and notes. Use the ledger tab when investigating a balance difference.",
      },
    ],
    relatedSlugs: ["record-and-match-a-payment", "send-a-payment-reminder", "create-your-first-invoice"],
  },
  {
    slug: "use-the-ai-business-assistant",
    categoryId: "ai-automation",
    title: "Use the AI business assistant safely",
    summary: "Ask useful questions, inspect sources and confirm suggested actions before they affect records.",
    keywords: ["ai", "assistant", "prompt", "confirm", "usage limit", "insight"],
    readMinutes: 5,
    updatedAt: "2026-08-01T05:00:00.000Z",
    featured: true,
    sections: [
      {
        id: "ask-clearly",
        heading: "Ask a specific business question",
        body: "Include a period, customer or product when relevant. For example, ask which low-stock products sold most in the last 30 days instead of asking only about inventory.",
      },
      {
        id: "review-results",
        heading: "Review the result",
        body: "Treat summaries as a starting point. Open connected records and verify important amounts before making a financial or stock decision.",
        bullets: ["Check the date range", "Open linked invoices or products", "Review calculated assumptions", "Ask a follow-up if a result is unclear"],
      },
      {
        id: "confirm-actions",
        heading: "Confirm actions deliberately",
        body: "The assistant can prepare actions such as a reminder or draft invoice, but important changes require confirmation. Read the preview before approving it.",
        note: "Never paste passwords, OTPs, card numbers or private credentials into the assistant.",
      },
    ],
    relatedSlugs: ["understand-stock-adjustments", "create-your-first-invoice", "change-your-subscription-plan"],
  },
  {
    slug: "invite-team-members-safely",
    categoryId: "account-security",
    title: "Invite team members safely",
    summary: "Give each person only the workspace access needed for their role.",
    keywords: ["team", "permission", "role", "invite", "security", "staff"],
    readMinutes: 4,
    updatedAt: "2026-07-25T12:00:00.000Z",
    sections: [
      {
        id: "choose-role",
        heading: "Choose the smallest useful role",
        body: "Managers may need reports and inventory controls, while counter staff may only need customers, orders and payments. Avoid owner-level access for routine work.",
      },
      {
        id: "send-invite",
        heading: "Send and verify the invitation",
        body: "Enter the team member’s work email, choose a role and review permissions before sending. Confirm their identity through a separate channel if they will handle sensitive records.",
      },
      {
        id: "review-access",
        heading: "Review access regularly",
        body: "Deactivate accounts promptly when someone leaves or changes responsibilities. Periodically review active sessions and team permissions in Settings.",
      },
    ],
    relatedSlugs: ["set-up-your-business-workspace", "use-the-ai-business-assistant", "understand-stock-adjustments"],
  },
  {
    slug: "change-your-subscription-plan",
    categoryId: "account-security",
    title: "Change your subscription plan",
    summary: "Compare limits, billing cycles and renewal details before upgrading or changing plans.",
    keywords: ["subscription", "plan", "billing", "upgrade", "renewal", "ai limit"],
    readMinutes: 3,
    updatedAt: "2026-07-24T09:00:00.000Z",
    sections: [
      {
        id: "compare-plans",
        heading: "Compare plan limits",
        body: "Open Subscription and compare invoice, AI and team-member allowances. Choose a plan for the workload you expect, not only today’s usage.",
      },
      {
        id: "billing-cycle",
        heading: "Review the billing cycle",
        body: "Annual billing usually lowers the effective monthly price but commits the business for longer. Review the payable amount and renewal date before checkout.",
      },
      {
        id: "after-payment",
        heading: "After payment",
        body: "Keep the confirmation and billing reference. New limits should appear on the subscription page after the payment is verified.",
      },
    ],
    relatedSlugs: ["use-the-ai-business-assistant", "invite-team-members-safely", "set-up-your-business-workspace"],
  },
  {
    slug: "work-without-a-stable-connection",
    categoryId: "getting-started",
    title: "Work without a stable connection",
    summary: "Protect in-progress work and recover safely when the internet drops.",
    keywords: ["offline", "internet", "connection", "draft", "retry"],
    readMinutes: 3,
    updatedAt: "2026-07-23T06:30:00.000Z",
    sections: [
      {
        id: "recognise-offline",
        heading: "Recognise an offline state",
        body: "When AI-BOS cannot reach the service, it shows an offline page instead of pretending a record was saved. Keep the tab open while reconnecting.",
      },
      {
        id: "protect-work",
        heading: "Protect in-progress work",
        body: "Copy long notes or descriptions before refreshing. Do not repeat payment or stock submissions until you can confirm whether the first attempt succeeded.",
      },
      {
        id: "reconnect",
        heading: "Reconnect and verify",
        body: "Check the device connection, retry the page, then review the relevant activity or audit history before entering the transaction again.",
      },
    ],
    relatedSlugs: ["understand-stock-adjustments", "record-and-match-a-payment", "create-your-first-invoice"],
  },
];

export function getHelpCategory(categoryId: HelpCategoryId) {
  return helpCategories.find((category) => category.id === categoryId);
}

export function getHelpArticle(slug: string) {
  return helpArticles.find((article) => article.slug === slug);
}
