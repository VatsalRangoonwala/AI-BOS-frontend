import type { MetadataRoute } from "next";

function siteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    return new URL(configuredUrl ?? "http://localhost:3000").origin;
  } catch {
    return "http://localhost:3000";
  }
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/ai-assistant/",
        "/analytics/",
        "/assistant/",
        "/customers/",
        "/dashboard/",
        "/help/",
        "/inventory/",
        "/invoices/",
        "/login",
        "/notifications/",
        "/onboarding/",
        "/orders/",
        "/payments/",
        "/payment-reminders/",
        "/products/",
        "/register",
        "/settings/",
        "/subscription/",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
