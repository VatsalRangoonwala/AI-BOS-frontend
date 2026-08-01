"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { Input, type InputProps } from "@/components/ui/input";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={`pr-12 ${className ?? ""}`}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
    );
  },
);

const requirements = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3" aria-label="Password requirements" aria-live="polite">
      <p className="text-xs font-semibold text-foreground">Password must include</p>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {requirements.map((requirement) => {
          const met = requirement.test(password);

          return (
            <li className={`flex items-center gap-2 text-[11px] ${met ? "text-success" : "text-muted-foreground"}`} key={requirement.label}>
              <span className={`size-1.5 rounded-full ${met ? "bg-success" : "bg-border-strong"}`} aria-hidden="true" />
              <span>{requirement.label}</span>
              <span className="sr-only">{met ? "met" : "not met"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const passwordSchema = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecial: /[^A-Za-z0-9]/,
} as const;

