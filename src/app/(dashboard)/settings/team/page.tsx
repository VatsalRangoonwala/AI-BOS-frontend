import type { Metadata } from "next";
import { TeamSettingsView } from "@/components/settings/team-settings-view";

export const metadata: Metadata = { title: "Team settings" };

export default function TeamSettingsPage() {
  return <TeamSettingsView />;
}
