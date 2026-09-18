"use client";

import React from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ProfileForm } from "@/components/settings/forms";
import { Loader2 } from "lucide-react";

export function ProfileSettingsView() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const defaults = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    language: "English",
    timeZone: "Asia/Kolkata",
  };

  return <ProfileForm defaults={defaults} />;
}
