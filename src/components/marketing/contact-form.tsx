"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, RotateCcw, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  businessName: z
    .string()
    .trim()
    .min(2, "Enter your business name.")
    .max(120, "Business name must be 120 characters or fewer."),
  subject: z.string().min(1, "Choose a subject."),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more so we can help. Use at least 20 characters.")
    .max(1_000, "Message must be 1,000 characters or fewer."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  businessName: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  async function onSubmit(values: ContactFormValues) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSubmittedName(values.name);
    reset(defaultValues);
  }

  if (submittedName) {
    return (
      <div className="grid min-h-[34rem] place-items-center p-6 text-center sm:p-10" role="status" aria-live="polite">
        <div className="max-w-md">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-success-soft text-success">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-success">
            Message received · AIB-4827
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Thanks, {submittedName}.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Our support team will review your message and reply by email within one business day.
          </p>
          <Button
            className="mt-6 rounded-xl"
            leadingIcon={RotateCcw}
            variant="outline"
            onClick={() => setSubmittedName(null)}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="p-5 sm:p-8" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="contact-name" required>
            Name
          </FieldLabel>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Rahul Sharma"
            invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <FieldError id="contact-name-error">{errors.name.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email" required>
            Email
          </FieldLabel>
          <Input
            id="contact-email"
            autoComplete="email"
            inputMode="email"
            placeholder="rahul@business.in"
            type="email"
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <FieldError id="contact-email-error">{errors.email.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-business" required>
            Business name
          </FieldLabel>
          <Input
            id="contact-business"
            autoComplete="organization"
            placeholder="Sharma Mobile Store"
            invalid={Boolean(errors.businessName)}
            aria-describedby={errors.businessName ? "contact-business-error" : undefined}
            {...register("businessName")}
          />
          {errors.businessName ? (
            <FieldError id="contact-business-error">{errors.businessName.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-subject" required>
            Subject
          </FieldLabel>
          <NativeSelect
            id="contact-subject"
            invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            {...register("subject")}
          >
            <option value="">Choose a subject</option>
            <option value="product-question">Product question</option>
            <option value="setup-help">Setup help</option>
            <option value="billing-and-plans">Billing and plans</option>
            <option value="technical-support">Technical support</option>
            <option value="partnership">Partnership enquiry</option>
            <option value="other">Something else</option>
          </NativeSelect>
          {errors.subject ? (
            <FieldError id="contact-subject-error">{errors.subject.message}</FieldError>
          ) : null}
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="contact-message" required>
            Message
          </FieldLabel>
          <Textarea
            id="contact-message"
            className="min-h-36"
            placeholder="Tell us what you are trying to do and where you need help…"
            invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : "contact-message-help"}
            {...register("message")}
          />
          {errors.message ? (
            <FieldError id="contact-message-error">{errors.message.message}</FieldError>
          ) : (
            <p className="text-xs leading-5 text-muted-foreground" id="contact-message-help">
              Please do not include passwords, card details or other sensitive information.
            </p>
          )}
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse items-stretch gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          By submitting, you agree to our privacy policy.
        </p>
        <Button
          className="rounded-xl"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Sending message…"
          trailingIcon={Send}
        >
          Send message
        </Button>
      </div>
    </form>
  );
}

