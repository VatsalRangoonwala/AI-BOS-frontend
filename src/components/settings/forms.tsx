"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Camera,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  Moon,
  Save,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTheme } from "@/components/providers/theme-provider";
import { useToast } from "@/components/providers/toast-provider";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  NativeSelect,
  Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email"),
  mobile: z
    .string()
    .regex(
      /^(\+91[ -]?)?[6-9]\d{9}$|^\+91 \d{5} \d{5}$/,
      "Enter a valid Indian mobile number",
    ),
  language: z.string(),
  timeZone: z.string(),
});

type ProfileValues = z.infer<typeof profileSchema>;

function FieldRow({
  label,
  error,
  children,
  description,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {description ? (
        <span className="text-xs leading-5 text-muted-foreground">{description}</span>
      ) : null}
      {error ? (
        <span className="text-xs font-medium text-danger" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function ProfileForm({
  defaults,
}: {
  defaults: {
    fullName: string;
    email: string;
    mobile: string;
    language: string;
    timeZone: string;
  };
}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    toast({
      title: "Profile updated",
      description: "Your mock profile changes have been saved.",
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="flex items-center gap-4 rounded-xl border border-border p-4">
        <span className="grid size-16 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          VS
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Profile photo</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG or JPG up to 2 MB</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast({
              title: "Upload ready",
              description: "A file picker would open in the connected product.",
              variant: "info",
            })
          }
        >
          <Camera className="size-4" />
          <span className="hidden sm:inline">Change photo</span>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldRow label="Full name" error={errors.fullName?.message}>
          <Input {...register("fullName")} aria-invalid={Boolean(errors.fullName)} />
        </FieldRow>
        <FieldRow label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
        </FieldRow>
        <FieldRow label="Mobile number" error={errors.mobile?.message}>
          <Input {...register("mobile")} aria-invalid={Boolean(errors.mobile)} />
        </FieldRow>
        <FieldRow label="Preferred language">
          <NativeSelect {...register("language")}>
            <option>English</option>
            <option>Hindi</option>
          </NativeSelect>
        </FieldRow>
        <FieldRow label="Time zone">
          <NativeSelect {...register("timeZone")}>
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
          </NativeSelect>
        </FieldRow>
      </div>
      <Button type="submit" isLoading={isSubmitting} loadingText="Saving profile…">
        <Save className="size-4" />
        Save changes
      </Button>
    </form>
  );
}

const businessSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  type: z.string().min(1),
  mobile: z.string().min(10, "Enter a valid phone number"),
  email: z.email("Enter a valid email"),
  address: z.string().min(5, "Enter the business address"),
  city: z.string().min(2),
  state: z.string().min(2),
  pin: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  taxId: z.string().optional(),
  prefix: z.string().min(2).max(8),
  currency: z.string(),
  year: z.string(),
  paymentTerms: z.number().min(0).max(90),
});

type BusinessValues = z.infer<typeof businessSchema>;

export function BusinessForm({ defaults }: { defaults: BusinessValues }) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: defaults,
  });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    toast({
      title: "Business settings saved",
      description: "New invoices will use the updated defaults.",
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-border p-4">
        <span className="grid size-16 place-items-center rounded-2xl bg-secondary-soft text-xl font-bold text-secondary">
          SM
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Business logo</p>
          <p className="mt-1 text-xs text-muted-foreground">Used on invoice previews and receipts</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast({ title: "Logo upload ready", variant: "info" })}
        >
          <Camera className="size-4" />
          Upload
        </Button>
      </div>

      <div>
        <h3 className="mb-4 font-semibold">Business identity</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Business name" error={errors.name?.message}>
            <Input {...register("name")} aria-invalid={Boolean(errors.name)} />
          </FieldRow>
          <FieldRow label="Business type">
            <NativeSelect {...register("type")}>
              <option value="mobile_shop">Mobile shop</option>
              <option value="electronics_store">Electronics store</option>
              <option value="grocery_store">Grocery store</option>
              <option value="garment_store">Garment store</option>
              <option value="wholesaler">Wholesaler</option>
              <option value="other_retail">Other retail</option>
            </NativeSelect>
          </FieldRow>
          <FieldRow label="Business mobile" error={errors.mobile?.message}>
            <Input {...register("mobile")} />
          </FieldRow>
          <FieldRow label="Business email" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </FieldRow>
          <div className="sm:col-span-2">
            <FieldRow label="Address" error={errors.address?.message}>
              <Textarea {...register("address")} rows={2} />
            </FieldRow>
          </div>
          <FieldRow label="City" error={errors.city?.message}>
            <Input {...register("city")} />
          </FieldRow>
          <FieldRow label="State" error={errors.state?.message}>
            <Input {...register("state")} />
          </FieldRow>
          <FieldRow label="PIN code" error={errors.pin?.message}>
            <Input inputMode="numeric" {...register("pin")} />
          </FieldRow>
          <FieldRow
            label="Tax identification"
            description="Optional; no compliance logic is applied."
          >
            <Input {...register("taxId")} />
          </FieldRow>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="mb-4 font-semibold">Invoice defaults</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Invoice prefix" error={errors.prefix?.message}>
            <Input {...register("prefix")} />
          </FieldRow>
          <FieldRow label="Currency">
            <NativeSelect {...register("currency")}>
              <option value="INR">INR — Indian Rupee</option>
            </NativeSelect>
          </FieldRow>
          <FieldRow label="Financial year">
            <NativeSelect {...register("year")}>
              <option>2026-27</option>
              <option>2025-26</option>
            </NativeSelect>
          </FieldRow>
          <FieldRow label="Default payment terms" error={errors.paymentTerms?.message}>
            <Input
              type="number"
              {...register("paymentTerms", { valueAsNumber: true })}
            />
          </FieldRow>
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} loadingText="Saving business…">
        <Save className="size-4" />
        Save business
      </Button>
    </form>
  );
}

type ToggleSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  premium?: boolean;
};

export function ToggleSettings({
  settings,
  saveLabel = "Save preferences",
}: {
  settings: ToggleSetting[];
  saveLabel?: string;
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(settings.map((setting) => [setting.id, setting.enabled])),
  );
  const { toast } = useToast();

  return (
    <div>
      <div className="divide-y divide-border">
        {settings.map((setting) => (
          <div key={setting.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{setting.title}</p>
                {setting.premium ? (
                  <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[0.62rem] font-semibold text-warning">
                    Premium
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values[setting.id]}
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  [setting.id]: !current[setting.id],
                }))
              }
              className={cn(
                "relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors",
                values[setting.id] ? "bg-primary" : "bg-border-strong",
              )}
            >
              <span
                className={cn(
                  "absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm transition-transform",
                  values[setting.id] ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
        ))}
      </div>
      <Button
        className="mt-6"
        onClick={() =>
          toast({
            title: saveLabel,
            description: "Your mock notification choices were updated.",
            variant: "success",
          })
        }
      >
        <Save className="size-4" />
        {saveLabel}
      </Button>
    </div>
  );
}

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Z]/, "Add at least one uppercase letter.")
      .regex(/[a-z]/, "Add at least one lowercase letter.")
      .regex(/\d/, "Add at least one number.")
      .regex(/[^A-Za-z0-9]/, "Add at least one symbol."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ["newPassword"],
    message: "Choose a password different from your current password.",
  });

type SecurityValues = z.infer<typeof securitySchema>;

export function SecurityPanel() {
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const submit = handleSubmit(async () => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 550));
    reset();
    setShow(false);
    toast({
      title: "Password updated",
      description: "Other sessions remain active until you revoke them.",
      variant: "success",
    });
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Use at least 8 characters with uppercase and lowercase letters, a number and a symbol.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="space-y-4">
            <FieldRow label="Current password" error={errors.currentPassword?.message}>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-11"
                  aria-invalid={Boolean(errors.currentPassword)}
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShow((value) => !value)}
                  className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={show ? "Hide passwords" : "Show passwords"}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </FieldRow>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow label="New password" error={errors.newPassword?.message}>
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.newPassword)}
                  {...register("newPassword")}
                />
              </FieldRow>
              <FieldRow
                label="Confirm new password"
                error={errors.confirmPassword?.message}
              >
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword")}
                />
              </FieldRow>
            </div>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Updating password…"
            >
              <LockKeyhole className="size-4" />
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
              <MonitorSmartphone className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                Chrome on Windows <span className="ml-1 text-xs text-success">Current</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Jaipur, India · Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
              <MonitorSmartphone className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Chrome on Android</p>
              <p className="mt-1 text-xs text-muted-foreground">Jaipur, India · 31 Jul, 8:42 PM</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast({ title: "Session revoked", variant: "success" })}
            >
              Revoke
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Other devices signed out", variant: "success" })}
          >
            <LogOut className="size-4" />
            Log out other devices
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-step verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
            <Bell className="mt-0.5 size-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Coming soon</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                An authenticator-app flow will be available when real authentication is connected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PreferencesPanel() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold">Theme</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "light", label: "Light", icon: Sun },
            { id: "dark", label: "Dark", icon: Moon },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id as "light" | "dark")}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left",
                theme === item.id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted",
              )}
            >
              <item.icon className="size-5 text-primary" />
              <span className="font-semibold">{item.label}</span>
              {theme === item.id ? <Check className="ml-auto size-4 text-primary" /> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldRow label="Language">
          <NativeSelect defaultValue="English">
            <option>English</option>
            <option>Hindi</option>
          </NativeSelect>
        </FieldRow>
        <FieldRow label="Date format">
          <NativeSelect defaultValue="DD MMM YYYY">
            <option>DD MMM YYYY</option>
            <option>DD/MM/YYYY</option>
          </NativeSelect>
        </FieldRow>
        <FieldRow label="Currency format">
          <NativeSelect defaultValue="₹1,23,456">
            <option>₹1,23,456</option>
            <option>INR 1,23,456</option>
          </NativeSelect>
        </FieldRow>
        <FieldRow label="Dashboard default">
          <NativeSelect defaultValue="Last 30 days">
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </NativeSelect>
        </FieldRow>
        <div className="sm:col-span-2">
          <FieldRow label="AI response preference">
            <NativeSelect defaultValue="Concise and practical">
              <option>Concise and practical</option>
              <option>Detailed with explanations</option>
              <option>Step-by-step guidance</option>
            </NativeSelect>
          </FieldRow>
        </div>
      </div>
      <Button onClick={() => toast({ title: "Preferences saved", variant: "success" })}>
        <Save className="size-4" />
        Save preferences
      </Button>
    </div>
  );
}
