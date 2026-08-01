"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

import { Icon } from "@/components/icon";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/components/ui/utils";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ReactNode;
};

type ToastRecord = Required<Pick<ToastInput, "title" | "variant" | "duration">> &
  Omit<ToastInput, "title" | "variant" | "duration"> & {
    id: string;
  };

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastVariant, string> = {
  default: "border-border bg-card text-card-foreground",
  success: "border-success/25 bg-card text-card-foreground",
  error: "border-destructive/25 bg-card text-card-foreground",
  warning: "border-warning/25 bg-card text-card-foreground",
  info: "border-info/25 bg-card text-card-foreground",
};

const toastIcons: Record<ToastVariant, { icon: LucideIcon; className: string }> = {
  default: { icon: CircleAlert, className: "bg-muted text-muted-foreground" },
  success: { icon: CheckCircle2, className: "bg-success-soft text-success" },
  error: { icon: CircleAlert, className: "bg-danger-soft text-destructive" },
  warning: { icon: AlertTriangle, className: "bg-warning-soft text-warning" },
  info: { icon: Info, className: "bg-info-soft text-info" },
};

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    if (item.duration <= 0) return;

    const timeout = window.setTimeout(() => onDismiss(item.id), item.duration);
    return () => window.clearTimeout(timeout);
  }, [item.duration, item.id, onDismiss]);

  const icon = toastIcons[item.variant];

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg sm:w-[24rem]",
        toastStyles[item.variant],
      )}
      role={item.variant === "error" ? "alert" : "status"}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
          icon.className,
        )}
      >
        <Icon icon={icon.icon} size="sm" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {item.description}
          </p>
        ) : null}
        {item.action ? <div className="mt-3">{item.action}</div> : null}
      </div>
      <IconButton
        className="-mt-1 -mr-1"
        icon={X}
        label={`Dismiss ${item.title} notification`}
        onClick={() => onDismiss(item.id)}
        size="sm"
        variant="ghost"
      />
    </div>
  );
}

export type ToastProviderProps = {
  children: ReactNode;
  maxToasts?: number;
};

export function ToastProvider({ children, maxToasts = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const sequence = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 5000,
      action,
    }: ToastInput) => {
      sequence.current += 1;
      const id = `toast-${sequence.current}`;
      const item: ToastRecord = {
        id,
        title,
        description,
        variant,
        duration,
        action,
      };

      setToasts((current) => [item, ...current].slice(0, Math.max(1, maxToasts)));
      return id;
    },
    [maxToasts],
  );

  const value = useMemo(
    () => ({ toast, dismiss, dismissAll }),
    [dismiss, dismissAll, toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-4 top-4 z-[200] flex flex-col items-end gap-3 sm:right-4 sm:left-auto"
      >
        {toasts.map((item) => (
          <ToastItem item={item} key={item.id} onDismiss={dismiss} />
        ))}
      </section>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
