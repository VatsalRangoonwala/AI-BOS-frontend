import type { Metadata } from "next";

import { PreferencesPanel } from "@/components/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Preferences" };
export default function PreferencesPage() { return <Card><CardHeader><CardTitle>Workspace preferences</CardTitle><p className="text-sm text-muted-foreground">Adjust appearance, formats, defaults and how AI responds.</p></CardHeader><CardContent><PreferencesPanel /></CardContent></Card>; }
