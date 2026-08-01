"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CreditCard, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AuthStatusAlert } from "@/components/auth/auth-status-alert";
import { PasswordInput, PasswordRequirements } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const strongPassword = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/\d/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a special character.");

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(80),
    businessName: z.string().trim().min(2, "Enter your business name.").max(120),
    email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email address."),
    mobile: z.string().trim().refine((value) => /^(?:91)?[6-9]\d{9}$/.test(value.replace(/\D/g, "")), "Enter a valid 10-digit Indian mobile number."),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Confirm your password."),
    plan: z.enum(["free", "pro", "premium"]),
    billing: z.enum(["monthly", "yearly"]),
    terms: z.boolean().refine(Boolean, "You must agree to the terms and privacy policy."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegisterValues = z.infer<typeof registerSchema>;

export type RegistrationPlan = RegisterValues["plan"];
export type RegistrationBilling = RegisterValues["billing"];

const planDetails: Record<
  RegistrationPlan,
  { label: string; monthly: string; yearly: string; note: string }
> = {
  free: {
    label: "Free",
    monthly: "₹0 / month",
    yearly: "₹0 / year",
    note: "No card required",
  },
  pro: {
    label: "Pro",
    monthly: "₹999 billed monthly",
    yearly: "₹9,588 billed yearly",
    note: "Unlimited invoices and 200 AI actions",
  },
  premium: {
    label: "Premium",
    monthly: "₹1,999 billed monthly",
    yearly: "₹19,188 billed yearly",
    note: "Advanced analytics, team access and priority support",
  },
};

export function RegisterForm({
  plan = "free",
  billing = "monthly",
}: {
  plan?: RegistrationPlan;
  billing?: RegistrationBilling;
}) {
  const [accountExists, setAccountExists] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const selection = planDetails[plan];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      plan,
      billing,
      terms: false,
    },
  });

  const password = useWatch({ control, name: "password" });

  async function onSubmit(values: RegisterValues) {
    setAccountExists(false);
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    if (values.email.toLowerCase().startsWith("existing")) {
      setAccountExists(true);
      return;
    }

    setRegisteredEmail(values.email);
  }

  if (registeredEmail) {
    return (
      <div className="space-y-5">
        <AuthStatusAlert variant="success" title="Your account is ready to verify">
          A verification link was sent to <strong>{registeredEmail}</strong>. The demo does not send a real email.
          <span className="mt-2 block">
            {selection.label} with {billing} billing remains selected for setup.
          </span>
        </AuthStatusAlert>
        <Button asChild block size="lg" className="rounded-xl">
          <Link href={`/verify-email?plan=${plan}&billing=${billing}`}>
            Continue to verification
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("plan")} />
      <input type="hidden" {...register("billing")} />

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-soft/50 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <CreditCard className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <Badge variant="primary">Selected plan</Badge>
          <p className="mt-2 font-semibold">
            {selection.label} · {billing === "yearly" ? "Yearly" : "Monthly"}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {billing === "yearly" ? selection.yearly : selection.monthly} · {selection.note}
          </p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex min-h-9 shrink-0 items-center rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/10"
        >
          Change
        </Link>
      </div>

      {accountExists ? (
        <AuthStatusAlert variant="error" title="An account already uses this email">
          Sign in instead, or use the password reset flow if you cannot access it.
        </AuthStatusAlert>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="register-name" required>Full name</FieldLabel>
          <Input id="register-name" autoComplete="name" placeholder="Vikram Sharma" invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "register-name-error" : undefined} {...register("fullName")} />
          {errors.fullName ? <FieldError id="register-name-error">{errors.fullName.message}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="register-business" required>Business name</FieldLabel>
          <Input id="register-business" autoComplete="organization" placeholder="Sharma Mobile Store" invalid={Boolean(errors.businessName)} aria-describedby={errors.businessName ? "register-business-error" : undefined} {...register("businessName")} />
          {errors.businessName ? <FieldError id="register-business-error">{errors.businessName.message}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="register-email" required>Email</FieldLabel>
          <Input id="register-email" autoComplete="email" inputMode="email" type="email" placeholder="vikram@business.in" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} {...register("email")} />
          {errors.email ? <FieldError id="register-email-error">{errors.email.message}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="register-mobile" required>Mobile number</FieldLabel>
          <Input id="register-mobile" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? "register-mobile-error" : undefined} {...register("mobile")} />
          {errors.mobile ? <FieldError id="register-mobile-error">{errors.mobile.message}</FieldError> : null}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="register-password" required>Password</FieldLabel>
        <PasswordInput id="register-password" autoComplete="new-password" placeholder="Create a secure password" invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : "register-password-help"} {...register("password")} />
        {errors.password ? <FieldError id="register-password-error">{errors.password.message}</FieldError> : null}
        <div id="register-password-help"><PasswordRequirements password={password ?? ""} /></div>
      </Field>

      <Field>
        <FieldLabel htmlFor="register-confirm-password" required>Confirm password</FieldLabel>
        <PasswordInput id="register-confirm-password" autoComplete="new-password" placeholder="Enter the password again" invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined} {...register("confirmPassword")} />
        {errors.confirmPassword ? <FieldError id="register-confirm-password-error">{errors.confirmPassword.message}</FieldError> : null}
      </Field>

      <Field>
        <div className="flex items-start gap-3">
          <Checkbox id="register-terms" className="mt-0.5" invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? "register-terms-error" : undefined} {...register("terms")} />
          <label className="text-sm leading-6 text-muted-foreground" htmlFor="register-terms">
            I agree to the <Link className="font-semibold text-primary hover:underline" href="/terms">Terms and Conditions</Link> and <Link className="font-semibold text-primary hover:underline" href="/privacy">Privacy Policy</Link>.
          </label>
        </div>
        {errors.terms ? <FieldError id="register-terms-error">{errors.terms.message}</FieldError> : null}
      </Field>

      <Button block size="lg" type="submit" className="rounded-xl" isLoading={isSubmitting} loadingText="Creating account…" trailingIcon={UserPlus}>
        Create account
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        To preview the duplicate-account error, register with <strong>existing@demo.ai-bos.in</strong>.
      </p>
    </form>
  );
}
