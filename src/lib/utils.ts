import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface INRFormatOptions {
  compact?: boolean;
  showPaise?: boolean;
}

export function formatINR(
  value: number,
  { compact = false, showPaise = false }: INRFormatOptions = {},
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    currencyDisplay: "symbol",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : compact ? 1 : 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export const formatCurrency = formatINR;

export type DateInput = Date | string | number;

export function formatDate(
  value: DateInput | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
    ...options,
  }).format(date);
}

export function formatDateTime(value: DateInput | null | undefined) {
  return formatDate(value, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string, maximum = 2) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("en-IN")
    .slice(0, Math.max(1, maximum));

  return initials || "?";
}

export function formatIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(-10);

  if (digits.length !== 10) {
    return value;
  }

  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

