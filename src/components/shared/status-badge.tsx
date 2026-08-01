import { GenericStatusBadge } from "@/components/ui/status-badge";

export function StatusBadge({ status }: { status: string }) {
  return <GenericStatusBadge status={status} />;
}
