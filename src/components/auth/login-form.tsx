"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api-client";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;
type LoginResult = "idle" | "invalid" | "locked" | "unverified" | "success";

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const targetRedirect =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  const [result, setResult] = useState<LoginResult>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginValues) {
    setResult("idle");
    setErrorMessage(null);

    try {
      await login({ email: values.email, password: values.password });
      setResult("success");
      router.push(targetRedirect);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setResult("invalid");
        } else if (err.status === 403) {
          setResult("locked");
          setErrorMessage(err.message || "Account is suspended or locked.");
        } else if (err.status === 429) {
          setResult("locked");
          setErrorMessage("Too many login attempts. Please wait a minute and try again.");
        } else {
          setResult("invalid");
          setErrorMessage(err.message || "Email or password is incorrect.");
        }
      } else {
        setResult("invalid");
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (result === "success") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="You’re signed in">
          Your session is active and ready.
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl">
          <Link href="/dashboard">
            Open dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <button type="button" className="mx-auto block min-h-11 text-sm font-semibold text-primary hover:underline" onClick={() => setResult("idle")}>
          Sign in with another account
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {result === "invalid" ? (
        <AuthStatusAlert variant="error" title="Sign in failed">
          {errorMessage || "Email or password is incorrect. Check both fields and try again."}
        </AuthStatusAlert>
      ) : null}
      {result === "locked" ? (
        <AuthStatusAlert variant="warning" title="Account issue">
          {errorMessage || "Too many unsuccessful attempts were recorded. Please try again later."}
        </AuthStatusAlert>
      ) : null}
      {result === "unverified" ? (
        <AuthStatusAlert variant="info" title="Verify your email before signing in">
          We sent a verification link to this address. <Link className="font-semibold text-primary hover:underline" href="/verify-email">Open verification</Link>.
        </AuthStatusAlert>
      ) : null}

      <Field>
        <FieldLabel htmlFor="login-email" required>Email</FieldLabel>
        <Input
          id="login-email"
          autoComplete="email"
          inputMode="email"
          placeholder="owner@business.in"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? <FieldError id="login-email-error">{errors.email.message}</FieldError> : null}
      </Field>

      <Field>
        <div className="flex items-center justify-between gap-4">
          <FieldLabel htmlFor="login-password" required>Password</FieldLabel>
          <Link className="text-xs font-semibold text-primary hover:underline" href="/forgot-password">Forgot password?</Link>
        </div>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          placeholder="Enter your password"
          invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? <FieldError id="login-password-error">{errors.password.message}</FieldError> : null}
      </Field>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
        <Checkbox {...register("remember")} />
        Remember me on this device
      </label>

      <Button block size="lg" type="submit" className="rounded-xl" isLoading={isSubmitting} loadingText="Signing in…" trailingIcon={LogIn}>
        Sign in
      </Button>
    </form>
  );
}
