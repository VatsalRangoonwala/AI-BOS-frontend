"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Pencil, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
});

type EmailValues = z.infer<typeof emailSchema>;
type VerificationState = "pending" | "expired" | "success";

export function VerifyEmailCard() {
  const [state, setState] = useState<VerificationState>("pending");
  const [email, setEmail] = useState("vikram@sharmamobile.in");
  const [changingEmail, setChangingEmail] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email } });

  async function resend() {
    setResending(true);
    setResent(false);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setState("pending");
    setResending(false);
    setResent(true);
  }

  async function changeEmail(values: EmailValues) {
    setEmail(values.email);
    setChangingEmail(false);
    setState("pending");
    setResent(true);
    reset({ email: values.email });
  }

  if (state === "success") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="Email verified successfully">
          <strong>{email}</strong> is now confirmed for your AI-BOS account.
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl">
          <Link href="/onboarding">Set up your business<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </Button>
        <StatePreview state={state} onChange={setState} />
      </div>
    );
  }

  if (state === "expired") {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="warning" title="This verification link has expired">
          Request a fresh link below. The new link will replace any older one.
        </AuthStatusAlert>
        <Button block size="lg" className="rounded-xl" onClick={resend} isLoading={resending} loadingText="Sending new link…" leadingIcon={RefreshCw}>
          Send a new verification link
        </Button>
        <button type="button" onClick={() => { setState("pending"); setChangingEmail(true); }} className="mx-auto flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <Pencil className="size-4" aria-hidden="true" />Change email address
        </button>
        <StatePreview state={state} onChange={setState} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {resent ? <AuthStatusAlert variant="success" title="A fresh link is on its way">The demo resend completed successfully.</AuthStatusAlert> : null}
      <div className="rounded-2xl border border-border bg-muted/40 p-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Mail className="size-6" aria-hidden="true" /></span>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-warning">Waiting for verification</p>
        <p className="mt-2 break-all text-sm font-semibold">{email}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">Open the link in your email. It expires after 24 hours and can be used once.</p>
      </div>

      {changingEmail ? (
        <form className="space-y-4 rounded-xl border border-border p-4" noValidate onSubmit={handleSubmit(changeEmail)}>
          <Field>
            <FieldLabel htmlFor="verification-email" required>New email address</FieldLabel>
            <Input id="verification-email" type="email" autoComplete="email" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "verification-email-error" : undefined} {...register("email")} />
            {errors.email ? <FieldError id="verification-email-error">{errors.email.message}</FieldError> : null}
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 rounded-xl">Update and resend</Button>
            <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setChangingEmail(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="rounded-xl" onClick={resend} isLoading={resending} loadingText="Resending…" leadingIcon={RefreshCw}>Resend email</Button>
          <Button variant="ghost" className="rounded-xl" onClick={() => setChangingEmail(true)} leadingIcon={Pencil}>Change email</Button>
        </div>
      )}

      <Button block size="lg" className="rounded-xl" onClick={() => setState("success")}>
        I opened the link · verify demo
      </Button>
      <StatePreview state={state} onChange={setState} />
    </div>
  );
}

function StatePreview({ state, onChange }: { state: VerificationState; onChange: (state: VerificationState) => void }) {
  return (
    <details className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
      <summary className="min-h-8 cursor-pointer font-semibold text-muted-foreground">Preview verification states</summary>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["pending", "expired", "success"] as const).map((option) => (
          <button type="button" key={option} onClick={() => onChange(option)} aria-pressed={state === option} className="min-h-9 rounded-lg border border-border bg-card px-2 font-semibold capitalize aria-pressed:border-primary aria-pressed:text-primary">
            {option}
          </button>
        ))}
      </div>
    </details>
  );
}
