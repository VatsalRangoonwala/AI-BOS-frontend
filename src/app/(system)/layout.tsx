import { StandaloneFrame } from "@/components/system";

export default function SystemLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StandaloneFrame>{children}</StandaloneFrame>;
}
