"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { apiClient, type BusinessData } from "@/lib/api-client";
import { BusinessForm } from "@/components/settings/forms";
import { Loader2 } from "lucide-react";

export function BusinessSettingsView() {
  const activeBusinessId = useAuthStore((s) => s.activeBusinessId);
  const activeBusiness = useAuthStore((s) => s.activeBusiness);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.resolve().then(async () => {
      if (!activeBusinessId) {
        if (mounted) setLoading(false);
        return;
      }

      if (mounted) setLoading(true);
      try {
        const data = await apiClient.businesses.get(activeBusinessId);
        if (mounted) {
          setBusiness(data);
        }
      } catch (err) {
        console.error("Failed to load business details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [activeBusinessId]);

  if (loading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm">Loading business profile…</p>
        </div>
      </div>
    );
  }

  const name = business?.name || activeBusiness?.businessName || "";
  const defaults = {
    name,
    type: "retail",
    mobile: business?.phone || "",
    email: "",
    address: business?.address || "",
    city: "",
    state: "",
    pin: "",
    taxId: "",
    prefix: business?.invoicePrefix || "INV-",
    currency: business?.currency || "INR",
    year: "2026–2027",
    paymentTerms: 15,
  };

  return (
    <BusinessForm
      defaults={defaults}
      businessId={activeBusinessId || undefined}
      onSave={() => {
        void refreshProfile();
      }}
    />
  );
}
