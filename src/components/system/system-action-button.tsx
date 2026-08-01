"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui";

export function SystemActionButton({
  action,
  label,
  variant = "primary",
}: {
  action: "reload" | "back";
  label: string;
  variant?: "primary" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      leadingIcon={action === "reload" ? RefreshCw : ArrowLeft}
      onClick={() => {
        if (action === "reload") window.location.reload();
        else window.history.back();
      }}
    >
      {label}
    </Button>
  );
}
