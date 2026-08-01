import { AnalyticsRangeProvider } from "@/components/analytics/analytics-range-provider";

export default function AnalyticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AnalyticsRangeProvider>{children}</AnalyticsRangeProvider>;
}
