import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthInitializer } from "@/components/providers/auth-initializer";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

function metadataBase(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    return new URL(configuredUrl ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "AI-BOS — Run your business with clarity",
    template: "%s | AI-BOS",
  },
  description:
    "Manage sales, stock, customers, invoices and payments with one practical AI-assisted business workspace.",
  applicationName: "AI-BOS",
  keywords: ["business management", "inventory", "invoicing", "AI assistant", "small business"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "AI-BOS",
    title: "AI-BOS — Run your business with clarity",
    description:
      "Manage sales, stock, customers, invoices and payments with one practical AI-assisted business workspace.",
  },
  twitter: {
    card: "summary",
    title: "AI-BOS — Run your business with clarity",
    description:
      "Manage sales, stock, customers, invoices and payments with one practical AI-assisted business workspace.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1220" },
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthInitializer />
            <ToastProvider>
              <NuqsAdapter>
                <a className="skip-link" href="#main-content">
                  Skip to main content
                </a>
                {children}
              </NuqsAdapter>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
