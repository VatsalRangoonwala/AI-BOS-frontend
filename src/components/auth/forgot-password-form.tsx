"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const forgotSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  async function onSubmit(values: ForgotValues) {
    setFailed(false);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    if (values.email.toLowerCase().startsWith("error")) {
      setFailed(true);
      return;
    }
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="Check your inbox">
          If an AI-BOS account exists for <strong>{sentTo}</strong>, a reset link is on its way. This demo does not send real email.
        </AuthStatusAlert>
        <div className="rounded-xl border border-border bg-muted/45 p-4 text-xs leading-6 text-muted-foreground">
          The link expires after 30 minutes. Check spam or promotions before requesting another one.
        </div>
        <Button asChild block size="lg" variant="outline" className="rounded-xl">
          <Link href="/login"><ArrowLeft className="size-4" aria-hidden="true" />Back to sign in</Link>
        </Button>
        <button className="mx-auto block min-h-11 text-sm font-semibold text-primary hover:underline" onClick={() => setSentTo(null)} type="button">
          Try another email
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {failed ? (
        <AuthStatusAlert variant="error" title="We could not start the reset">
          A temporary mock error occurred. Try again, or use another email address.
        </AuthStatusAlert>
      ) : null}
      <Field>
        <FieldLabel htmlFor="forgot-email" required>Email</FieldLabel>
        <Input id="forgot-email" autoComplete="email" inputMode="email" type="email" placeholder="owner@business.in" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "forgot-email-error" : "forgot-email-help"} {...register("email")} />
        {errors.email ? <FieldError id="forgot-email-error">{errors.email.message}</FieldError> : <p className="text-xs leading-5 text-muted-foreground" id="forgot-email-help">Use the email you registered with AI-BOS.</p>}
      </Field>
      <Button block size="lg" type="submit" className="rounded-xl" isLoading={isSubmitting} loadingText="Sending reset link…" trailingIcon={MailCheck}>
        Send reset link
      </Button>
      <p className="text-center text-xs text-muted-foreground">Use <strong>error@demo.ai-bos.in</strong> to preview a temporary failure.</p>
    </form>
  );
}

