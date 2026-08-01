import type { Metadata } from "next";
import { ManagementTable } from "@/components/admin";
import { PageHeader } from "@/components/shared";

export const metadata: Metadata = { title: "Businesses" };
const businesses = [
  { id: "b1", name: "Sharma Mobile & Electronics", detail: "Vikram Sharma · Jaipur", role: "Mobile shop", plan: "Pro", status: "Active", date: "18 Sep 2025", meta: "2 team members" },
  { id: "b2", name: "Patel Fashion House", detail: "Meera Patel · Ahmedabad", role: "Garment store", plan: "Free", status: "Active", date: "1 Aug 2026", meta: "1 team member" },
  { id: "b3", name: "City Mobile Point", detail: "Rakesh Yadav · Lucknow", role: "Mobile shop", plan: "Pro", status: "Active", date: "31 Jul 2026", meta: "3 team members" },
  { id: "b4", name: "Metro Wholesale", detail: "Kabir Singh · Delhi", role: "Wholesaler", plan: "Premium", status: "Active", date: "29 Jul 2026", meta: "8 team members" },
  { id: "b5", name: "Old Town Electronics", detail: "Nitin Joshi · Pune", role: "Electronics store", plan: "Free", status: "Suspended", date: "4 Apr 2026", meta: "1 team member" },
];
export default function AdminBusinessesPage() { return <div className="app-page-enter space-y-6"><PageHeader eyebrow="Tenant operations" title="Businesses" description="Review business owners, categories, plan usage, team size and account status." /><ManagementTable rows={businesses} entityLabel="business" /></div>; }
