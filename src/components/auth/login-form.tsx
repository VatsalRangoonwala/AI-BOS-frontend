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

const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;
type LoginResult = "idle" | "invalid" | "locked" | "unverified" | "success";

export function LoginForm() {
  const [result, setResult] = useState<LoginResult>("idle");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginValues) {
    setResult("idle");
    await new Promise((resolve) => window.setTimeout(resolve, 750));

    const email = values.email.toLowerCase();
    if (email.startsWith("locked")) {
      setResult("locked");
    } else if (email.startsWith("unverified")) {
      setResult("unverified");
    } else if (email.startsWith("wrong") || values.password !== "Demo@123") {
      setResult("invalid");
    } else {
      setResult("success");
    }
  }

  function applyDemo(email: string, password = "Demo@123") {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setResult("idle");
  }

  if (result === "success") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="You’re signed in">
          The demo session is ready for Sharma Mobile & Electronics.
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
        <AuthStatusAlert variant="error" title="Email or password is incorrect">
          Check both fields and try again. Demo password: <strong>Demo@123</strong>.
        </AuthStatusAlert>
      ) : null}
      {result === "locked" ? (
        <AuthStatusAlert variant="warning" title="This account is temporarily locked">
          Too many unsuccessful attempts were recorded. Wait 15 minutes or contact support.
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

      <details className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
        <summary className="min-h-8 cursor-pointer font-semibold text-muted-foreground">Demo sign-in states</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <DemoButton label="Successful" onClick={() => applyDemo("owner@demo.ai-bos.in")} />
          <DemoButton label="Unverified" onClick={() => applyDemo("unverified@demo.ai-bos.in")} />
          <DemoButton label="Locked" onClick={() => applyDemo("locked@demo.ai-bos.in")} />
        </div>
        <p className="mt-2 text-muted-foreground">All states use the mock password Demo@123.</p>
      </details>
    </form>
  );
}

function DemoButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-9 rounded-lg border border-border bg-card px-2 font-semibold text-foreground hover:bg-muted">
      {label}
    </button>
  );
}
