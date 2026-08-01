import type { Metadata } from "next";
import { SecurityPanel } from "@/components/settings";

export const metadata: Metadata = { title: "Security settings" };
export default function SecuritySettingsPage() { return <SecurityPanel />; }
