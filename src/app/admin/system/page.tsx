import type { Metadata } from "next";
import { SystemGrid } from "@/components/admin";
import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui";

export const metadata: Metadata = { title: "System health" };
export default function AdminSystemPage() { return <div className="app-page-enter space-y-6"><PageHeader eyebrow="Operational visibility" title="System health" description="Monitor the mock status and recent uptime of platform services."><Badge variant="success">All systems operational</Badge></PageHeader><SystemGrid /></div>; }
