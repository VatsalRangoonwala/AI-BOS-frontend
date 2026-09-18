import type { Metadata } from "next";

import { ProfileSettingsView } from "@/components/settings/profile-settings-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Profile settings" };

export default function ProfileSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep your account and communication details current.
        </p>
      </CardHeader>
      <CardContent>
        <ProfileSettingsView />
      </CardContent>
    </Card>
  );
}
