import type { Metadata } from "next";
import { connection } from "next/server";

import { AdminShell } from "@/components/admin";
import { AuthGuard } from "@/components/providers/auth-guard";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return <AuthGuard><AdminShell>{children}</AdminShell></AuthGuard>;
}
