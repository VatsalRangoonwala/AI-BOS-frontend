import type { Metadata } from "next";

import { ProfileForm } from "@/components/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { currentUser } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Profile settings" };

export default function ProfileSettingsPage() {
  return <Card><CardHeader><CardTitle>Personal profile</CardTitle><p className="text-sm text-muted-foreground">Keep your account and communication details current.</p></CardHeader><CardContent><ProfileForm defaults={{ fullName: currentUser.fullName, email: currentUser.email, mobile: currentUser.mobile, language: currentUser.preferredLanguage, timeZone: currentUser.timeZone }} /></CardContent></Card>;
}
