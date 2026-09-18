import type { Metadata } from "next";
import { connection } from "next/server";

import { AppShell } from "@/components/layout";
import { AuthGuard } from "@/components/providers/auth-guard";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await connection();

  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
