"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { PasswordInput, PasswordRequirements } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const resetSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters.").regex(/[A-Z]/, "Add an uppercase letter.").regex(/[a-z]/, "Add a lowercase letter.").regex(/\d/, "Add a number.").regex(/[^A-Za-z0-9]/, "Add a special character."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

import { useSearchParams } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<"form" | "success" | "expired">("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirmPassword: "" } });
  const password = useWatch({ control, name: "password" });

  async function onSubmit(values: ResetValues) {
    if (!token) {
      setErrorMessage("No reset token provided in the link. Please request a new password reset link.");
      return;
    }
    setErrorMessage(null);
    try {
      await apiClient.auth.resetPassword({
        token,
        newPassword: values.password,
      });
      setState("success");
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.code === "invalid_token" || err.status === 400)) {
        setState("expired");
      } else if (err instanceof ApiError) {
        setErrorMessage(err.message || "Failed to update password.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (state === "success") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="Password updated">
          Your other active sessions will be signed out for account safety.
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl">
          <Link href="/login">Sign in with new password<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </Button>
      </div>
    );
  }

  if (state === "expired") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="warning" title="This reset link has expired">
          Reset links can be used once and expire after 30 minutes.
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl"><Link href="/forgot-password">Request a new link<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        <button type="button" className="mx-auto block min-h-11 text-sm font-semibold text-primary hover:underline" onClick={() => setState("form")}>Preview valid link</button>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {errorMessage ? (
        <AuthStatusAlert variant="error" title="Reset password error">
          {errorMessage}
        </AuthStatusAlert>
      ) : null}
      <Field>
        <FieldLabel htmlFor="reset-password" required>New password</FieldLabel>
        <PasswordInput id="reset-password" autoComplete="new-password" placeholder="Create a new password" invalid={Boolean(errors.password)} aria-describedby={errors.password ? "reset-password-error" : "reset-password-help"} {...register("password")} />
        {errors.password ? <FieldError id="reset-password-error">{errors.password.message}</FieldError> : null}
        <div id="reset-password-help"><PasswordRequirements password={password ?? ""} /></div>
      </Field>
      <Field>
        <FieldLabel htmlFor="reset-confirm" required>Confirm password</FieldLabel>
        <PasswordInput id="reset-confirm" autoComplete="new-password" placeholder="Enter it again" invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "reset-confirm-error" : undefined} {...register("confirmPassword")} />
        {errors.confirmPassword ? <FieldError id="reset-confirm-error">{errors.confirmPassword.message}</FieldError> : null}
      </Field>
      <Button block size="lg" type="submit" className="rounded-xl" isLoading={isSubmitting} loadingText="Updating password…" trailingIcon={KeyRound}>
        Update password
      </Button>
      <button type="button" className="mx-auto block min-h-11 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline" onClick={() => setState("expired")}>
        Preview expired-link state
      </button>
    </form>
  );
}
