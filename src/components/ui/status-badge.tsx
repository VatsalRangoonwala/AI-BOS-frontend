import type { HTMLAttributes } from "react";

import {
  Badge,
  type BadgeProps,
  type BadgeVariant,
} from "@/components/ui/badge";

export type StatusTone = Exclude<BadgeVariant, "outline">;

export type StatusBadgeProps = Omit<BadgeProps, "children" | "variant"> & {
  label: string;
  tone?: StatusTone;
};

export function StatusBadge({
  label,
  tone = "neutral",
  dot = true,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge dot={dot} variant={tone} {...props}>
      {label}
    </Badge>
  );
}

export type StatusMeta = {
  label: string;
  tone: StatusTone;
};

function normalizeStatus(status: string) {
  return status.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

function humanizeStatus(status: string) {
  return normalizeStatus(status)
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

const genericStatuses: Record<string, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  completed: { label: "Completed", tone: "success" },
  confirmed: { label: "Confirmed", tone: "info" },
  connected: { label: "Connected", tone: "success" },
  delivered: { label: "Delivered", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  failed: { label: "Failed", tone: "danger" },
  inactive: { label: "Inactive", tone: "neutral" },
  "in-stock": { label: "In stock", tone: "success" },
  "low-stock": { label: "Low stock", tone: "warning" },
  "needs-review": { label: "Needs review", tone: "warning" },
  "not-connected": { label: "Not connected", tone: "neutral" },
  "not-sent": { label: "Not sent", tone: "neutral" },
  "out-of-stock": { label: "Out of stock", tone: "danger" },
  outstanding: { label: "Outstanding", tone: "warning" },
  overdue: { label: "Overdue", tone: "danger" },
  paid: { label: "Paid", tone: "success" },
  "partially-paid": { label: "Partially paid", tone: "warning" },
  pending: { label: "Pending", tone: "warning" },
  processing: { label: "Processing", tone: "primary" },
  read: { label: "Read", tone: "neutral" },
  refunded: { label: "Refunded", tone: "info" },
  scheduled: { label: "Scheduled", tone: "info" },
  sent: { label: "Sent", tone: "info" },
  unpaid: { label: "Unpaid", tone: "warning" },
  viewed: { label: "Viewed", tone: "info" },
};

export function getStatusMeta(
  status: string,
  statuses: Record<string, StatusMeta> = genericStatuses,
): StatusMeta {
  const normalized = normalizeStatus(status);
  return statuses[normalized] ?? { label: humanizeStatus(status), tone: "neutral" };
}

type NamedStatusBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  status: string;
  label?: string;
  dot?: boolean;
};

const paymentStatuses: Record<string, StatusMeta> = {
  completed: { label: "Completed", tone: "success" },
  paid: { label: "Paid", tone: "success" },
  "partially-paid": { label: "Partially paid", tone: "warning" },
  pending: { label: "Pending", tone: "warning" },
  unpaid: { label: "Unpaid", tone: "warning" },
  outstanding: { label: "Outstanding", tone: "warning" },
  overdue: { label: "Overdue", tone: "danger" },
  failed: { label: "Failed", tone: "danger" },
  refunded: { label: "Refunded", tone: "info" },
};

const orderStatuses: Record<string, StatusMeta> = {
  draft: { label: "Draft", tone: "neutral" },
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  processing: { label: "Processing", tone: "primary" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const invoiceStatuses: Record<string, StatusMeta> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "info" },
  "partially-paid": { label: "Partially paid", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  overdue: { label: "Overdue", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const stockStatuses: Record<string, StatusMeta> = {
  "in-stock": { label: "In stock", tone: "success" },
  "low-stock": { label: "Low stock", tone: "warning" },
  "out-of-stock": { label: "Out of stock", tone: "danger" },
};

const deliveryStatuses: Record<string, StatusMeta> = {
  "not-sent": { label: "Not sent", tone: "neutral" },
  sent: { label: "Sent", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  viewed: { label: "Viewed", tone: "info" },
  failed: { label: "Failed", tone: "danger" },
};

function NamedStatusBadge({
  status,
  label,
  dot,
  statuses,
  ...props
}: NamedStatusBadgeProps & { statuses: Record<string, StatusMeta> }) {
  const meta = getStatusMeta(status, statuses);
  return (
    <StatusBadge
      dot={dot}
      label={label ?? meta.label}
      tone={meta.tone}
      {...props}
    />
  );
}

export function PaymentStatusBadge(props: NamedStatusBadgeProps) {
  return <NamedStatusBadge statuses={paymentStatuses} {...props} />;
}

export function OrderStatusBadge(props: NamedStatusBadgeProps) {
  return <NamedStatusBadge statuses={orderStatuses} {...props} />;
}

export function InvoiceStatusBadge(props: NamedStatusBadgeProps) {
  return <NamedStatusBadge statuses={invoiceStatuses} {...props} />;
}

export function StockStatusBadge(props: NamedStatusBadgeProps) {
  return <NamedStatusBadge statuses={stockStatuses} {...props} />;
}

export function InvoiceDeliveryStatusBadge(props: NamedStatusBadgeProps) {
  return <NamedStatusBadge statuses={deliveryStatuses} {...props} />;
}

export function GenericStatusBadge({ status, label, dot, ...props }: NamedStatusBadgeProps) {
  const meta = getStatusMeta(status);
  return <StatusBadge dot={dot} label={label ?? meta.label} tone={meta.tone} {...props} />;
}
