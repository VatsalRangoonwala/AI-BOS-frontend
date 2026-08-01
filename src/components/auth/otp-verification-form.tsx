"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter all six digits."),
});

type OtpValues = z.infer<typeof otpSchema>;

export function OtpVerificationForm() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({ resolver: zodResolver(otpSchema), defaultValues: { otp: "" } });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(interval);
  }, [countdown]);

  function updateDigits(nextDigits: string[]) {
    setDigits(nextDigits);
    setValue("otp", nextDigits.join(""), { shouldValidate: false });
    clearErrors("otp");
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    updateDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: 6 }, (_, index) => pasted[index] ?? "");
    updateDigits(next);
    inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  }

  async function onSubmit(values: OtpValues) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (values.otp !== "123456") {
      setError("otp", { type: "server", message: "That OTP is not valid. Use 123456 for this demo." });
      return;
    }
    setVerified(true);
  }

  function resendOtp() {
    if (countdown > 0) return;
    updateDigits(["", "", "", "", "", ""]);
    setCountdown(45);
    setResent(true);
    inputRefs.current[0]?.focus();
  }

  if (verified) {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="Mobile number verified">
          The demo OTP was accepted successfully.
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl"><Link href="/onboarding">Continue to business setup<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {resent ? <AuthStatusAlert variant="info" title="A fresh OTP was sent">The demo timer restarted. Use 123456 to continue.</AuthStatusAlert> : null}
      <div className="rounded-xl border border-border bg-muted/45 p-4 text-center">
        <ShieldCheck className="mx-auto size-6 text-primary" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold">Code sent to +91 98765 43210</p>
        <p className="mt-1 text-xs text-muted-foreground">Enter the six-digit code. You can paste it too.</p>
      </div>
      <input type="hidden" {...register("otp")} />
      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => { inputRefs.current[index] = node; }}
            aria-label={`OTP digit ${index + 1} of 6`}
            aria-invalid={Boolean(errors.otp) || undefined}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            className="size-11 rounded-xl border border-input bg-card text-center text-lg font-bold tabular-nums shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive sm:size-12"
            inputMode="numeric"
            maxLength={1}
            pattern="[0-9]*"
            value={digit}
            onChange={(event) => handleDigitChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
      {errors.otp ? <FieldError className="text-center">{errors.otp.message}</FieldError> : null}
      <Button block size="lg" type="submit" className="rounded-xl" isLoading={isSubmitting} loadingText="Verifying code…">
        Verify OTP
      </Button>
      <div className="text-center">
        <button type="button" onClick={resendOtp} disabled={countdown > 0} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary disabled:text-muted-foreground">
          <RefreshCw className="size-4" aria-hidden="true" />
          {countdown > 0 ? `Resend in 00:${String(countdown).padStart(2, "0")}` : "Resend OTP"}
        </button>
        <p className="text-xs text-muted-foreground">Demo code: <strong>123456</strong></p>
      </div>
    </form>
  );
}

