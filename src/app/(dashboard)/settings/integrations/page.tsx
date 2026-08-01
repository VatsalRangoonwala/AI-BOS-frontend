import type { Metadata } from "next";

import { IntegrationsGrid } from "@/components/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Integrations" };
export default function IntegrationsPage() { return <Card><CardHeader><CardTitle>Connected tools</CardTitle><p className="text-sm text-muted-foreground">Extend AI-BOS with communication, payment and retail hardware services.</p></CardHeader><CardContent><IntegrationsGrid /></CardContent></Card>; }
