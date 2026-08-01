"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  Building2,
  Check,
  CheckCircle2,
  CircleUserRound,
  FileText,
  Gauge,
  IndianRupee,
  Package,
  PartyPopper,
  Plus,
  Rocket,
  Settings2,
  Sparkles,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const onboardingSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name.").max(120),
  businessType: z.enum(["mobile_shop", "electronics_store", "grocery_store", "garment_store", "wholesaler", "other_retail"]),
  ownerName: z.string().trim().min(2, "Enter the owner’s full name.").max(80),
  mobile: z.string().trim().refine((value) => /^(?:91)?[6-9]\d{9}$/.test(value.replace(/\D/g, "")), "Enter a valid 10-digit Indian mobile number."),
  email: z.string().trim().min(1, "Enter the business email.").email("Enter a valid email address."),
  address: z.string().trim().min(5, "Enter the shop or business address.").max(160),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().min(1, "Choose a state."),
  pinCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code."),
  currency: z.literal("INR"),
  invoicePrefix: z.string().trim().min(2, "Use at least 2 characters.").max(8, "Use 8 characters or fewer.").regex(/^[A-Za-z0-9-]+$/, "Use only letters, numbers or a hyphen."),
  financialYear: z.string().min(1, "Choose a financial year."),
  lowStockThreshold: z.number().int().min(1, "Threshold must be at least 1.").max(999, "Threshold must be below 1,000."),
  enablePaymentReminders: z.boolean(),
  enableStockAlerts: z.boolean(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;
type StepNumber = 1 | 2 | 3 | 4 | 5;

const steps: Array<{ number: StepNumber; title: string; shortTitle: string; icon: LucideIcon }> = [
  { number: 1, title: "Welcome to AI-BOS", shortTitle: "Welcome", icon: Sparkles },
  { number: 2, title: "Tell us about your business", shortTitle: "Business", icon: Building2 },
  { number: 3, title: "Choose your defaults", shortTitle: "Preferences", icon: Settings2 },
  { number: 4, title: "Add a useful starting point", shortTitle: "First records", icon: Plus },
  { number: 5, title: "Your workspace is ready", shortTitle: "Complete", icon: PartyPopper },
];

const businessDetailFields: Array<keyof OnboardingValues> = [
  "businessName", "businessType", "ownerName", "mobile", "email", "address", "city", "state", "pinCode",
];
const preferenceFields: Array<keyof OnboardingValues> = [
  "currency", "invoicePrefix", "financialYear", "lowStockThreshold", "enablePaymentReminders", "enableStockAlerts",
];

export function OnboardingWizard() {
  const [step, setStep] = useState<StepNumber>(1);
  const [furthestStep, setFurthestStep] = useState<StepNumber>(1);
  const [productAdded, setProductAdded] = useState(false);
  const [customerAdded, setCustomerAdded] = useState(false);
  const [initialSetupSkipped, setInitialSetupSkipped] = useState(false);
  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
    defaultValues: {
      businessName: "Sharma Mobile & Electronics",
      businessType: "mobile_shop",
      ownerName: "Vikram Sharma",
      mobile: "+91 98765 43210",
      email: "vikram@sharmamobile.in",
      address: "Shop 18, Laxmi Market, Near Rajiv Chowk",
      city: "Jaipur",
      state: "Rajasthan",
      pinCode: "302001",
      currency: "INR",
      invoicePrefix: "SME",
      financialYear: "2026-27",
      lowStockThreshold: 8,
      enablePaymentReminders: true,
      enableStockAlerts: true,
    },
  });

  const setupReady = productAdded || customerAdded || initialSetupSkipped;
  const currentStep = steps[step - 1];

  async function advance() {
    let valid = true;
    if (step === 2) valid = await trigger(businessDetailFields, { shouldFocus: true });
    if (step === 3) valid = await trigger(preferenceFields, { shouldFocus: true });
    if (step === 4 && !setupReady) return;
    if (!valid || step === 5) return;

    const nextStep = (step + 1) as StepNumber;
    setStep(nextStep);
    setFurthestStep((current) => Math.max(current, nextStep) as StepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (step === 1) return;
    setStep((step - 1) as StepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(nextStep: StepNumber) {
    if (nextStep > furthestStep) return;
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addProduct() {
    setProductAdded(true);
    setInitialSetupSkipped(false);
  }

  function addCustomer() {
    setCustomerAdded(true);
    setInitialSetupSkipped(false);
  }

  function skipInitialSetup() {
    setProductAdded(false);
    setCustomerAdded(false);
    setInitialSetupSkipped(true);
  }

  return (
    <div>
      <div className="mb-7 grid gap-4 lg:grid-cols-[15rem_1fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step {step} of {steps.length}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] sm:text-3xl" aria-live="polite">{currentStep.title}</h1>
        </div>
        <Progress value={step} max={steps.length} label="Business setup progress" showValue valueLabel={`${step} of ${steps.length} steps`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav className="rounded-2xl border border-border bg-card p-3 shadow-card lg:sticky lg:top-6 lg:self-start" aria-label="Onboarding steps">
          <ol className="grid grid-cols-5 gap-1 lg:grid-cols-1">
            {steps.map((item) => {
              const StepIcon = item.icon;
              const current = item.number === step;
              const complete = item.number < furthestStep || step === 5;
              const enabled = item.number <= furthestStep;

              return (
                <li key={item.number}>
                  <button
                    type="button"
                    onClick={() => goToStep(item.number)}
                    disabled={!enabled}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-2 text-left transition-colors lg:justify-start lg:px-3",
                      current && "bg-primary-soft text-primary",
                      !current && enabled && "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !enabled && "cursor-not-allowed text-border-strong",
                    )}
                  >
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg border", current ? "border-primary/20 bg-card" : complete ? "border-success/20 bg-success-soft text-success" : "border-border bg-background")}>
                      {complete && !current ? <Check className="size-4" aria-hidden="true" /> : <StepIcon className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="hidden min-w-0 lg:block"><span className="block text-[10px] font-semibold uppercase tracking-wider opacity-65">Step {item.number}</span><span className="mt-0.5 block truncate text-xs font-semibold">{item.shortTitle}</span></span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <form
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          onSubmit={(event) => {
            event.preventDefault();
            void advance();
          }}
        >
          <div className="min-h-[30rem] p-5 sm:p-8 lg:p-10">
            {step === 1 ? <WelcomeStep /> : null}
            {step === 2 ? <BusinessDetailsStep register={register} errors={errors} /> : null}
            {step === 3 ? <PreferencesStep register={register} errors={errors} /> : null}
            {step === 4 ? (
              <InitialSetupStep
                productAdded={productAdded}
                customerAdded={customerAdded}
                skipped={initialSetupSkipped}
                onAddProduct={addProduct}
                onAddCustomer={addCustomer}
                onSkip={skipInitialSetup}
              />
            ) : null}
            {step === 5 ? (
              <CompletionStep
                values={getValues()}
                productAdded={productAdded}
                customerAdded={customerAdded}
                skipped={initialSetupSkipped}
              />
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            {step > 1 ? (
              <Button type="button" variant="ghost" className="rounded-xl" leadingIcon={ArrowLeft} onClick={goBack}>Back</Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            {step < 5 ? (
              <div className="sm:text-right">
                {step === 4 && !setupReady ? <p className="mb-2 text-xs text-warning">Add a first record or choose “Skip for now” to continue.</p> : null}
                <Button type="submit" size="lg" className="w-full rounded-xl sm:w-auto" disabled={step === 4 && !setupReady} trailingIcon={ArrowRight}>
                  {step === 1 ? "Start setup" : step === 4 ? "Finish setup" : "Continue"}
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="rounded-xl"><Link href="/dashboard">Open dashboard<ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="grid h-full gap-9 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Rocket className="size-7" aria-hidden="true" /></span>
        <h2 className="mt-6 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Let’s build a useful workspace—not a complicated one.</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">AI-BOS helps you manage the daily flow from customer and product to order, invoice and payment. These five short steps set sensible defaults for that work.</p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-2">About 3 minutes</span>
          <span className="rounded-full bg-muted px-3 py-2">Change settings later</span>
          <span className="rounded-full bg-muted px-3 py-2">No payment needed</span>
        </div>
      </div>
      <div className="grid gap-3">
        {[
          { icon: Users, title: "Know every customer balance", detail: "Invoices, payments and notes stay connected." },
          { icon: Package, title: "See stock before it becomes urgent", detail: "Set a default alert threshold for your products." },
          { icon: Sparkles, title: "Ask questions in everyday language", detail: "AI uses the business records in your workspace." },
        ].map((item) => {
          const ItemIcon = item.icon;
          return <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4" key={item.title}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary-soft text-secondary"><ItemIcon className="size-5" aria-hidden="true" /></span><div><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p></div></div>;
        })}
      </div>
    </div>
  );
}

function BusinessDetailsStep({ register, errors }: StepFormProps) {
  return (
    <div>
      <StepIntro icon={Store} title="Business details" description="These details identify your workspace and appear where relevant on business records." />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field><FieldLabel htmlFor="onboarding-business-name" required>Business name</FieldLabel><Input id="onboarding-business-name" autoComplete="organization" invalid={Boolean(errors.businessName)} aria-describedby={errors.businessName ? "onboarding-business-name-error" : undefined} {...register("businessName")} />{errors.businessName ? <FieldError id="onboarding-business-name-error">{errors.businessName.message}</FieldError> : null}</Field>
        <Field><FieldLabel htmlFor="onboarding-business-type" required>Business type</FieldLabel><NativeSelect id="onboarding-business-type" invalid={Boolean(errors.businessType)} {...register("businessType")}><option value="mobile_shop">Mobile shop</option><option value="electronics_store">Electronics store</option><option value="grocery_store">Grocery store</option><option value="garment_store">Garment store</option><option value="wholesaler">Wholesaler</option><option value="other_retail">Other retail business</option></NativeSelect></Field>
        <Field><FieldLabel htmlFor="onboarding-owner-name" required>Owner name</FieldLabel><Input id="onboarding-owner-name" autoComplete="name" invalid={Boolean(errors.ownerName)} aria-describedby={errors.ownerName ? "onboarding-owner-name-error" : undefined} {...register("ownerName")} />{errors.ownerName ? <FieldError id="onboarding-owner-name-error">{errors.ownerName.message}</FieldError> : null}</Field>
        <Field><FieldLabel htmlFor="onboarding-mobile" required>Mobile number</FieldLabel><Input id="onboarding-mobile" autoComplete="tel" inputMode="tel" invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? "onboarding-mobile-error" : undefined} {...register("mobile")} />{errors.mobile ? <FieldError id="onboarding-mobile-error">{errors.mobile.message}</FieldError> : null}</Field>
        <Field className="sm:col-span-2"><FieldLabel htmlFor="onboarding-email" required>Business email</FieldLabel><Input id="onboarding-email" autoComplete="email" inputMode="email" type="email" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "onboarding-email-error" : undefined} {...register("email")} />{errors.email ? <FieldError id="onboarding-email-error">{errors.email.message}</FieldError> : null}</Field>
        <Field className="sm:col-span-2"><FieldLabel htmlFor="onboarding-address" required>Address</FieldLabel><Input id="onboarding-address" autoComplete="street-address" invalid={Boolean(errors.address)} aria-describedby={errors.address ? "onboarding-address-error" : undefined} {...register("address")} />{errors.address ? <FieldError id="onboarding-address-error">{errors.address.message}</FieldError> : null}</Field>
        <Field><FieldLabel htmlFor="onboarding-city" required>City</FieldLabel><Input id="onboarding-city" autoComplete="address-level2" invalid={Boolean(errors.city)} aria-describedby={errors.city ? "onboarding-city-error" : undefined} {...register("city")} />{errors.city ? <FieldError id="onboarding-city-error">{errors.city.message}</FieldError> : null}</Field>
        <Field><FieldLabel htmlFor="onboarding-state" required>State</FieldLabel><NativeSelect id="onboarding-state" autoComplete="address-level1" invalid={Boolean(errors.state)} aria-describedby={errors.state ? "onboarding-state-error" : undefined} {...register("state")}><option value="">Choose state</option><option>Rajasthan</option><option>Delhi</option><option>Gujarat</option><option>Maharashtra</option><option>Karnataka</option><option>Tamil Nadu</option><option>Uttar Pradesh</option><option>West Bengal</option><option value="Other">Other state or union territory</option></NativeSelect>{errors.state ? <FieldError id="onboarding-state-error">{errors.state.message}</FieldError> : null}</Field>
        <Field><FieldLabel htmlFor="onboarding-pin" required>PIN code</FieldLabel><Input id="onboarding-pin" autoComplete="postal-code" inputMode="numeric" maxLength={6} invalid={Boolean(errors.pinCode)} aria-describedby={errors.pinCode ? "onboarding-pin-error" : undefined} {...register("pinCode")} />{errors.pinCode ? <FieldError id="onboarding-pin-error">{errors.pinCode.message}</FieldError> : null}</Field>
      </div>
    </div>
  );
}

function PreferencesStep({ register, errors }: StepFormProps) {
  return (
    <div>
      <StepIntro icon={Settings2} title="Business preferences" description="Choose the defaults AI-BOS will use when you create records. Every setting can be changed later." />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field><FieldLabel htmlFor="onboarding-currency" required>Default currency</FieldLabel><NativeSelect id="onboarding-currency" {...register("currency")}><option value="INR">INR — Indian Rupee (₹)</option></NativeSelect></Field>
        <Field><FieldLabel htmlFor="onboarding-prefix" required>Invoice prefix</FieldLabel><Input id="onboarding-prefix" className="uppercase" maxLength={8} invalid={Boolean(errors.invoicePrefix)} aria-describedby={errors.invoicePrefix ? "onboarding-prefix-error" : "onboarding-prefix-help"} {...register("invoicePrefix")} />{errors.invoicePrefix ? <FieldError id="onboarding-prefix-error">{errors.invoicePrefix.message}</FieldError> : <p className="text-xs text-muted-foreground" id="onboarding-prefix-help">Example: SME-1042</p>}</Field>
        <Field><FieldLabel htmlFor="onboarding-year" required>Financial year</FieldLabel><NativeSelect id="onboarding-year" invalid={Boolean(errors.financialYear)} {...register("financialYear")}><option value="2026-27">2026–27 (April to March)</option><option value="2025-26">2025–26 (April to March)</option><option value="calendar">Calendar year</option></NativeSelect></Field>
        <Field><FieldLabel htmlFor="onboarding-threshold" required>Default low-stock threshold</FieldLabel><Input id="onboarding-threshold" min={1} max={999} type="number" inputMode="numeric" invalid={Boolean(errors.lowStockThreshold)} aria-describedby={errors.lowStockThreshold ? "onboarding-threshold-error" : "onboarding-threshold-help"} {...register("lowStockThreshold", { valueAsNumber: true })} />{errors.lowStockThreshold ? <FieldError id="onboarding-threshold-error">{errors.lowStockThreshold.message}</FieldError> : <p className="text-xs text-muted-foreground" id="onboarding-threshold-help">Used for new products unless you set a product-specific value.</p>}</Field>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <PreferenceToggle id="onboarding-reminders" icon={IndianRupee} title="Payment reminders" description="Notify you when balances are due or overdue." registration={register("enablePaymentReminders")} />
        <PreferenceToggle id="onboarding-alerts" icon={BellRing} title="Stock alerts" description="Notify you when a product reaches its threshold." registration={register("enableStockAlerts")} />
      </div>
    </div>
  );
}

function InitialSetupStep({ productAdded, customerAdded, skipped, onAddProduct, onAddCustomer, onSkip }: { productAdded: boolean; customerAdded: boolean; skipped: boolean; onAddProduct: () => void; onAddCustomer: () => void; onSkip: () => void }) {
  return (
    <div>
      <StepIntro icon={Plus} title="Add a useful starting point" description="A first product or customer makes the dashboard more useful immediately. These demo actions add realistic sample records." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SetupCard icon={Package} title="Add first product" description="boAt Rockerz 255 Pro+ Earphones · ₹1,499 · opening stock 20" complete={productAdded} onClick={onAddProduct} action="Add sample product" />
        <SetupCard icon={UserPlus} title="Add first customer" description="Rahul Sharma · +91 98765 21043 · opening balance ₹0" complete={customerAdded} onClick={onAddCustomer} action="Add sample customer" />
      </div>
      <div className={cn("mt-5 rounded-2xl border p-5", skipped ? "border-primary bg-primary-soft" : "border-border bg-background")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-semibold">Skip and explore the dashboard</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">You can add your own products and customers from Quick Create at any time.</p></div>
          <Button type="button" variant={skipped ? "soft" : "outline"} className="rounded-xl" onClick={onSkip}>{skipped ? <><Check className="size-4" aria-hidden="true" />Selected</> : "Skip for now"}</Button>
        </div>
      </div>
      {(productAdded || customerAdded) ? <div className="mt-5 rounded-xl border border-success/20 bg-success-soft p-4 text-sm text-success" role="status">Sample records added to this onboarding preview. Continue when you are ready.</div> : null}
    </div>
  );
}

function CompletionStep({ values, productAdded, customerAdded, skipped }: { values: OnboardingValues; productAdded: boolean; customerAdded: boolean; skipped: boolean }) {
  const businessTypeLabel = { mobile_shop: "Mobile shop", electronics_store: "Electronics store", grocery_store: "Grocery store", garment_store: "Garment store", wholesaler: "Wholesaler", other_retail: "Other retail business" }[values.businessType];
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success-soft text-success"><PartyPopper className="size-8" aria-hidden="true" /></span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-success">Setup complete</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{values.businessName} is ready to work.</h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">Your {businessTypeLabel.toLowerCase()} workspace now has the defaults needed for customers, stock, invoices, payments and AI-assisted insights.</p>
      </div>
      <div className="mx-auto mt-8 grid max-w-3xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-background p-5">
          <h3 className="text-sm font-semibold">Setup checklist</h3>
          <ul className="mt-4 space-y-3">
            {[
              "Account email verified",
              `Business profile completed for ${values.city}, ${values.state}`,
              `Invoice prefix set to ${values.invoicePrefix.toUpperCase()}`,
              `Low-stock threshold set to ${values.lowStockThreshold} units`,
              productAdded ? "First product added" : customerAdded ? "First customer added" : skipped ? "Initial records skipped for now" : "Initial setup reviewed",
            ].map((item) => <li className="flex items-start gap-3 text-sm" key={item}><span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3" aria-hidden="true" /></span>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-primary/15 bg-primary-soft p-5">
          <Gauge className="size-6 text-primary" aria-hidden="true" />
          <h3 className="mt-4 text-sm font-semibold">Your first dashboard</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Start with Quick Create, review inventory alerts or ask AI-BOS what to set up next.</p>
          <div className="mt-5 space-y-2 text-xs font-medium">
            <div className="flex items-center gap-2"><FileText className="size-4 text-primary" aria-hidden="true" />Create an invoice</div>
            <div className="flex items-center gap-2"><CircleUserRound className="size-4 text-primary" aria-hidden="true" />Add a real customer</div>
            <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" aria-hidden="true" />Ask for setup guidance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type StepFormProps = { register: UseFormRegister<OnboardingValues>; errors: FieldErrors<OnboardingValues> };

function StepIntro({ icon: StepIcon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><StepIcon className="size-5" aria-hidden="true" /></span><div><h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div></div>;
}

function PreferenceToggle({ id, icon: ToggleIcon, title, description, registration }: { id: string; icon: LucideIcon; title: string; description: string; registration: ReturnType<UseFormRegister<OnboardingValues>> }) {
  return <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background p-4" htmlFor={id}><Checkbox id={id} className="mt-0.5" {...registration} /><ToggleIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><span><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span></span></label>;
}

function SetupCard({ icon: SetupIcon, title, description, action, complete, onClick }: { icon: LucideIcon; title: string; description: string; action: string; complete: boolean; onClick: () => void }) {
  return <article className={cn("rounded-2xl border p-5", complete ? "border-success/30 bg-success-soft" : "border-border bg-background")}><span className={cn("grid size-11 place-items-center rounded-xl", complete ? "bg-card text-success" : "bg-primary-soft text-primary")}>{complete ? <CheckCircle2 className="size-5" aria-hidden="true" /> : <SetupIcon className="size-5" aria-hidden="true" />}</span><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">{description}</p><Button type="button" variant={complete ? "soft" : "outline"} block className="mt-5 rounded-xl" onClick={onClick} disabled={complete}>{complete ? "Added" : action}</Button></article>;
}

