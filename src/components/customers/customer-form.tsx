"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Save, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
  Textarea,
  buttonStyles,
} from "@/components/ui";
import { customers } from "@/lib/mock-data";
import { formatIndianPhone } from "@/lib/utils";
import type { Customer } from "@/types";

const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the customer’s full name."),
  mobile: z.string().trim().refine((value) => /^[6-9]\d{9}$/.test(value.replace(/\D/g, "").slice(-10)), "Enter a valid 10-digit Indian mobile number."),
  email: z.string().trim().email("Enter a valid email address.").or(z.literal("")),
  address: z.string().trim().min(5, "Enter a complete street address."),
  city: z.string().trim().min(2, "Enter a city."),
  notes: z.string().trim().max(500, "Keep notes under 500 characters."),
  openingBalance: z.number().min(0, "Opening balance cannot be negative."),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerForm({ customer }: { customer?: Customer }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = Boolean(customer);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: customer?.fullName ?? "",
      mobile: customer?.mobile ?? "",
      email: customer?.email ?? "",
      address: customer?.address?.line1 ?? "",
      city: customer?.city ?? "",
      notes: customer?.notes ?? "",
      openingBalance: customer?.openingBalance ?? 0,
    },
  });

  const mobile = useWatch({ control, name: "mobile" });
  const duplicate = useMemo(() => {
    const digits = mobile.replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) return undefined;
    return customers.find((candidate) => candidate.id !== customer?.id && candidate.mobile.replace(/\D/g, "").slice(-10) === digits);
  }, [customer?.id, mobile]);

  const submit = handleSubmit(async (values) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 550));
    toast({
      title: isEditing ? "Customer updated" : "Customer added",
      description: `${values.fullName} is ready to use in invoices and orders.`,
      variant: "success",
    });
    router.push(customer ? `/customers/${customer.id}` : "/customers");
  });

  const inputDescription = (name: keyof CustomerFormValues) => errors[name] ? `${name}-error` : undefined;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><UserRoundPlus className="size-5" aria-hidden="true" /></span>
            <div><CardTitle>Customer details</CardTitle><p className="mt-1 text-sm text-muted-foreground">Contact and address information used across the workspace.</p></div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="fullName" required>Full name</FieldLabel>
            <Input id="fullName" autoComplete="name" placeholder="Rahul Sharma" invalid={Boolean(errors.fullName)} aria-describedby={inputDescription("fullName")} {...register("fullName")} />
            {errors.fullName ? <FieldError id="fullName-error">{errors.fullName.message}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="mobile" required>Mobile number</FieldLabel>
            <Input id="mobile" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? "mobile-error" : duplicate ? "mobile-warning" : "mobile-help"} {...register("mobile", { onBlur: (event) => { event.target.value = formatIndianPhone(event.target.value); } })} />
            {errors.mobile ? <FieldError id="mobile-error">{errors.mobile.message}</FieldError> : duplicate ? (
              <FieldDescription id="mobile-warning" role="status" className="flex items-start gap-1.5 text-warning"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />This number already belongs to {duplicate.fullName}. Review before saving.</FieldDescription>
            ) : <FieldDescription id="mobile-help">Use the customer’s WhatsApp-enabled number where possible.</FieldDescription>}
          </Field>
          <Field>
            <FieldLabel htmlFor="email" optional>Email</FieldLabel>
            <Input id="email" type="email" autoComplete="email" placeholder="rahul@example.com" invalid={Boolean(errors.email)} aria-describedby={inputDescription("email")} {...register("email")} />
            {errors.email ? <FieldError id="email-error">{errors.email.message}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="city" required>City</FieldLabel>
            <Input id="city" autoComplete="address-level2" placeholder="Jaipur" invalid={Boolean(errors.city)} aria-describedby={inputDescription("city")} {...register("city")} />
            {errors.city ? <FieldError id="city-error">{errors.city.message}</FieldError> : null}
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="address" required>Address</FieldLabel>
            <Input id="address" autoComplete="street-address" placeholder="House or shop number, street and area" invalid={Boolean(errors.address)} aria-describedby={inputDescription("address")} {...register("address")} />
            {errors.address ? <FieldError id="address-error">{errors.address.message}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="openingBalance">Opening balance</FieldLabel>
            <Input id="openingBalance" type="number" min="0" step="1" inputMode="decimal" invalid={Boolean(errors.openingBalance)} aria-describedby={errors.openingBalance ? "openingBalance-error" : "openingBalance-help"} {...register("openingBalance", { valueAsNumber: true })} />
            {errors.openingBalance ? <FieldError id="openingBalance-error">{errors.openingBalance.message}</FieldError> : <FieldDescription id="openingBalance-help">Amount already owed when adding this customer.</FieldDescription>}
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="notes" optional>Notes</FieldLabel>
            <Textarea id="notes" placeholder="Preferences, delivery instructions or follow-up context" invalid={Boolean(errors.notes)} aria-describedby={inputDescription("notes")} {...register("notes")} />
            {errors.notes ? <FieldError id="notes-error">{errors.notes.message}</FieldError> : null}
          </Field>
        </CardContent>
      </Card>

      <div className="sticky bottom-24 z-20 flex flex-col-reverse gap-2 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end lg:bottom-3">
        <Link href={customer ? `/customers/${customer.id}` : "/customers"} className={buttonStyles({ variant: "outline" })}>Cancel</Link>
        <Button type="submit" leadingIcon={Save} isLoading={isSubmitting} loadingText={isEditing ? "Saving changes…" : "Adding customer…"}>{isEditing ? "Save changes" : "Add customer"}</Button>
      </div>
    </form>
  );
}
