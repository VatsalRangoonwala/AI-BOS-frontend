import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/marketing/legal-document";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms that apply when creating an account or using the AI-BOS website and business workspace.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement and eligibility",
    content: (
      <>
        <p>These terms govern access to the AI-BOS website, applications and related services. By creating an account or using AI-BOS, you agree to these terms and our <Link href="/privacy">Privacy Policy</Link>.</p>
        <p>You must be legally able to enter this agreement and authorised to act for the business connected to the account. If you do not agree, do not use the service.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and team access",
    content: (
      <>
        <p>Provide accurate registration and business information, keep it current and protect login credentials. You are responsible for activity under your account unless you promptly report unauthorised access.</p>
        <p>The business owner controls invitations, roles and permissions for team members. Only grant access needed for a person’s work and remove access when it is no longer appropriate.</p>
      </>
    ),
  },
  {
    id: "service",
    title: "The AI-BOS service",
    content: (
      <>
        <p>AI-BOS provides tools for business records and workflows, including customers, products, inventory, invoices, orders, payments, analytics, notifications and AI-assisted tasks. Features and limits depend on the selected plan.</p>
        <p>AI-BOS is not payroll, manufacturing planning, legal, tax or professional accounting software. You remain responsible for checking records and meeting obligations that apply to your business.</p>
      </>
    ),
  },
  {
    id: "plans-and-billing",
    title: "Plans, billing and cancellation",
    content: (
      <>
        <p>Free and paid plans may include limits for invoices, AI actions, team members or features. Current limits and prices are shown before selection. Taxes may be added where applicable.</p>
        <p>Paid subscriptions renew on the selected monthly or yearly cycle unless cancelled. Razorpay or another disclosed provider may process payment; its payment terms also apply. Cancellation takes effect at the end of the paid period unless law or the checkout terms state otherwise.</p>
        <p>If payment fails, we may retry, request another payment method or limit paid features after reasonable notice. Billing history and payment status remain visible in the workspace.</p>
      </>
    ),
  },
  {
    id: "business-data",
    title: "Business data and your responsibilities",
    content: (
      <>
        <p>You retain ownership of customer, product, invoice and other content submitted to AI-BOS. You give us permission to host, process, display and transmit that content only as needed to provide, secure and support the service.</p>
        <p>You must have the right to enter and use personal or business information, maintain accurate records and configure access appropriately. Do not upload unlawful material, malicious code or information unrelated to legitimate business use.</p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features and recommendations",
    content: (
      <>
        <p>AI responses are generated from your prompt, available workspace context and automated models. They may be incomplete or incorrect. Review customer names, products, quantities, prices, dates and totals before acting.</p>
        <p>AI-BOS presents confirmation for supported financial or destructive actions, but that safeguard does not replace your review. Do not rely on AI output as legal, tax, accounting or financial advice.</p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You may not misuse AI-BOS, interfere with service operation, bypass access controls or usage limits, reverse engineer protected parts of the service, introduce harmful code, scrape at unreasonable volume or use the product to violate another person’s rights.</p>
        <p>You may not use messaging or reminder features for spam, harassment or unlawful communication. Account owners are responsible for obtaining any consent required before contacting customers.</p>
      </>
    ),
  },
  {
    id: "integrations",
    title: "Third-party integrations",
    content: (
      <>
        <p>Optional integrations may include WhatsApp Business, Razorpay, email delivery, barcode hardware, printers or cloud storage. Third-party services are governed by their own agreements and may change or stop independently of AI-BOS.</p>
        <p>You authorise the exchange of information needed for an integration you connect. Disconnect access you no longer use and protect credentials issued by the provider.</p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>AI-BOS and its software, interface, branding, documentation and original content are protected by intellectual-property laws. These terms grant a limited, non-exclusive, non-transferable right to use the service for authorised business purposes while your account is active.</p>
        <p>Feedback may be used to improve AI-BOS without an obligation to compensate you, provided we do not publicly identify you without permission.</p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and changes",
    content: (
      <>
        <p>We work to keep AI-BOS available and reliable, but maintenance, security events, provider failures or internet conditions may interrupt access. Offline and maintenance states will explain what is affected when practical.</p>
        <p>We may improve, replace or discontinue features. For a material reduction to a paid service, we will provide reasonable notice where practical and honour rights required by law.</p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    content: (
      <>
        <p>We may suspend or restrict access to protect the service, investigate suspected misuse, respond to legal requirements or address overdue payment. We will provide notice and a chance to resolve the issue where circumstances allow.</p>
        <p>You may stop using AI-BOS and request account closure. Before closure, export records you are required to keep. Terms that by nature should continue—including ownership, payment obligations, disclaimers and liability limits—survive termination.</p>
      </>
    ),
  },
  {
    id: "disclaimers-liability",
    title: "Disclaimers and liability",
    content: (
      <>
        <p>AI-BOS is provided on an “as available” basis to the extent permitted by law. We do not guarantee that every feature, AI response, integration or calculation will always be uninterrupted or error-free.</p>
        <p>To the extent permitted by law, AI-BOS is not liable for indirect, incidental or consequential loss, lost profits or loss caused by inaccurate input, unauthorised account access, third-party services or decisions made without reviewing generated output. Nothing in these terms excludes liability that cannot legally be excluded.</p>
      </>
    ),
  },
  {
    id: "law-and-changes",
    title: "Governing law and updates",
    content: (
      <>
        <p>These terms are governed by the laws of India. Before starting formal proceedings, both sides should try in good faith to resolve a dispute by written notice and reasonable discussion. Any mandatory consumer or statutory rights remain unaffected.</p>
        <p>We may update these terms to reflect product, provider or legal changes. Material updates will be communicated before they take effect where appropriate. Continued use after the effective date means the updated terms apply.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>Questions about these terms can be sent to <a href="mailto:legal@ai-bos.in">legal@ai-bos.in</a> or through our <Link href="/contact">contact page</Link>. Include enough detail to identify the account or issue, but do not send passwords, OTPs or payment credentials.</p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms and Conditions"
      summary="The rules and responsibilities that keep AI-BOS useful, secure and fair for business owners, team members and the people whose records they manage."
      effectiveDate="1 August 2026"
      sections={sections}
    />
  );
}

