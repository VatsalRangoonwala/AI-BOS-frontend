import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Set up your business",
  description: "Configure your AI-BOS business workspace in five guided steps.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}

