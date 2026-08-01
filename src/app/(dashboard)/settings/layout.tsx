import { PageHeader } from "@/components/shared";
import { SettingsNav } from "@/components/settings";
import { Card } from "@/components/ui";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-page-enter space-y-6"><PageHeader eyebrow="Workspace configuration" title="Settings" description="Manage your profile, business defaults, team and integrations." /><div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]"><Card className="h-fit overflow-hidden"><SettingsNav /></Card><div className="min-w-0">{children}</div></div></div>;
}
