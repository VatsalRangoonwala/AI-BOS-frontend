import type { Metadata } from "next";
import { ManagementTable } from "@/components/admin";
import { PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Platform users" };
const users = [
  { id: "u1", name: "Vikram Sharma", detail: "vikram@sharmamobile.in", role: "Business owner", plan: "Pro", status: "Active", date: "18 Sep 2025" },
  { id: "u2", name: "Meera Patel", detail: "meera@patelfashion.in", role: "Business owner", plan: "Free", status: "Active", date: "1 Aug 2026" },
  { id: "u3", name: "Rakesh Yadav", detail: "rakesh@citymobile.in", role: "Business owner", plan: "Pro", status: "Active", date: "31 Jul 2026" },
  { id: "u4", name: "Kabir Singh", detail: "kabir@metrowholesale.in", role: "Business owner", plan: "Premium", status: "Active", date: "29 Jul 2026" },
  { id: "u5", name: "Nitin Joshi", detail: "nitin@example.com", role: "Staff", plan: "Pro", status: "Suspended", date: "12 Jul 2026" },
  { id: "u6", name: "Sonal Gupta", detail: "sonal@freshbasket.in", role: "Business owner", plan: "Free", status: "Pending", date: "1 Aug 2026" },
];
export default function AdminUsersPage() { return <div className="app-page-enter space-y-6"><PageHeader eyebrow="Identity and access" title="Platform users" description="Search accounts, review roles and subscription context, or suspend access." /><ManagementTable rows={users} /></div>; }
