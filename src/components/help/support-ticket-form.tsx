"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileUp, LifeBuoy, Send } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
  Textarea,
} from "@/components/ui";
import { currentUser } from "@/lib/mock-data";

const ticketSchema = z.object({
  subject: z.string().trim().min(5, "Enter a clear subject with at least 5 characters.").max(120, "Keep the subject under 120 characters."),
  category: z.enum(["billing", "account", "invoices", "inventory", "payments", "ai", "technical"]),
  priority: z.enum(["normal", "urgent"]),
  email: z.string().trim().email("Enter a valid reply email."),
  reference: z.string().trim().max(40, "Keep the reference under 40 characters."),
  description: z.string().trim().min(30, "Add at least 30 characters so support can investigate.").max(2000, "Keep the description under 2,000 characters."),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function SupportTicketForm() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "technical",
      priority: "normal",
      email: currentUser.email,
      reference: "",
      description: "",
    },
  });
  const description = useWatch({ control, name: "description" });

  const submit = handleSubmit(async (values) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 650));
    const ticketNumber = [...`${values.subject}${values.email}`].reduce(
      (total, character, index) => (total + character.charCodeAt(0) * (index + 17)) % 1_000_000,
      482_193,
    );
    const ticketId = `SUP-${String(ticketNumber).padStart(6, "0")}`;
    setSubmittedTicket(ticketId);
    toast({
      title: "Support request submitted",
      description: `${ticketId} was created for “${values.subject}”.`,
      variant: "success",
    });
    reset({
      subject: "",
      category: "technical",
      priority: "normal",
      email: values.email,
      reference: "",
      description: "",
    });
    setAttachmentName("");
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><LifeBuoy className="size-5" /></span>
          <div><CardTitle>Submit a support request</CardTitle><p className="mt-1 text-sm leading-6 text-muted-foreground">Include what happened, what you expected and any connected record number.</p></div>
        </div>
      </CardHeader>
      <CardContent>
        {submittedTicket ? (
          <div className="mb-5 flex gap-3 rounded-xl border border-success/25 bg-success-soft p-4" role="status">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <div><p className="text-sm font-semibold">Ticket {submittedTicket} is in the queue</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A mock confirmation was sent to your reply email. Normal-priority requests typically receive a response within one business day.</p></div>
          </div>
        ) : null}

        <form onSubmit={submit} noValidate className="grid gap-5">
          <Field>
            <FieldLabel htmlFor="support-subject" required>Subject</FieldLabel>
            <Input id="support-subject" placeholder="Payment recorded against the wrong invoice" invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "support-subject-error" : undefined} {...register("subject")} />
            {errors.subject ? <FieldError id="support-subject-error">{errors.subject.message}</FieldError> : null}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="support-category" required>Category</FieldLabel>
              <NativeSelect id="support-category" {...register("category")}>
                <option value="technical">Technical issue</option>
                <option value="billing">Billing & subscription</option>
                <option value="account">Account & access</option>
                <option value="invoices">Invoices & orders</option>
                <option value="inventory">Products & inventory</option>
                <option value="payments">Payments</option>
                <option value="ai">AI assistant</option>
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="support-priority" required>Priority</FieldLabel>
              <NativeSelect id="support-priority" {...register("priority")}>
                <option value="normal">Normal — business can continue</option>
                <option value="urgent">Urgent — core workflow blocked</option>
              </NativeSelect>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="support-email" required>Reply email</FieldLabel>
              <Input id="support-email" type="email" autoComplete="email" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "support-email-error" : undefined} {...register("email")} />
              {errors.email ? <FieldError id="support-email-error">{errors.email.message}</FieldError> : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="support-reference" optional>Record reference</FieldLabel>
              <Input id="support-reference" placeholder="e.g. SME-1042 or ORD-2042" invalid={Boolean(errors.reference)} aria-describedby={errors.reference ? "support-reference-error" : "support-reference-description"} {...register("reference")} />
              {errors.reference ? <FieldError id="support-reference-error">{errors.reference.message}</FieldError> : <FieldDescription id="support-reference-description">Invoice, order, payment or product ID.</FieldDescription>}
            </Field>
          </div>

          <Field>
            <div className="flex items-end justify-between gap-3"><FieldLabel htmlFor="support-description" required>Description</FieldLabel><span className="text-xs tabular-nums text-muted-foreground">{description.length}/2000</span></div>
            <Textarea id="support-description" rows={7} placeholder="Tell us the steps you took, what appeared on screen, and what you expected to happen…" invalid={Boolean(errors.description)} aria-describedby={errors.description ? "support-description-error" : "support-description-help"} {...register("description")} />
            {errors.description ? <FieldError id="support-description-error">{errors.description.message}</FieldError> : <FieldDescription id="support-description-help">Do not include passwords, OTPs, card numbers or bank credentials.</FieldDescription>}
          </Field>

          <Field>
            <FieldLabel htmlFor="support-attachment" optional>Screenshot</FieldLabel>
            <label htmlFor="support-attachment" className="flex min-h-24 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border-strong bg-muted/35 p-4 hover:border-primary/40 hover:bg-primary-soft/25">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-sm"><FileUp className="size-5" /></span>
              <span><span className="block text-sm font-semibold">{attachmentName || "Choose a PNG, JPG or PDF"}</span><span className="mt-1 block text-xs text-muted-foreground">Mock upload · maximum 10 MB in the production service</span></span>
              <input id="support-attachment" type="file" accept="image/png,image/jpeg,application/pdf" className="sr-only" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? "")} />
            </label>
          </Field>

          <Button type="submit" leadingIcon={Send} isLoading={isSubmitting} loadingText="Submitting request…" className="sm:justify-self-end">Submit request</Button>
        </form>
      </CardContent>
    </Card>
  );
}
