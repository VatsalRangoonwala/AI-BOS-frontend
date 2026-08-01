import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/marketing/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how AI-BOS collects, uses, protects and manages account, business and usage information.",
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Scope and responsibilities",
    content: (
      <>
        <p>This policy explains how AI-BOS handles personal information when you visit our website, create an account, use the AI-BOS business workspace or contact support.</p>
        <p>For account and website information, AI-BOS decides why and how the information is processed. For customer, invoice, order and similar records entered by a business, that business controls the information and AI-BOS processes it to provide the service.</p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Information we collect",
    content: (
      <>
        <p>We collect information that you provide directly and limited technical information generated through use of the service.</p>
        <ul>
          <li><strong>Account details:</strong> name, email address, mobile number, password credentials in protected form, language, time zone and verification status.</li>
          <li><strong>Business details:</strong> business name and type, address, logo, invoice preferences and optional tax identification information.</li>
          <li><strong>Operational records:</strong> customer contacts, products, stock changes, invoices, orders, payments, reminders, notes and team permissions entered into a workspace.</li>
          <li><strong>Usage information:</strong> device and browser information, login activity, feature usage, diagnostic events and approximate location inferred from network information.</li>
          <li><strong>Support and billing:</strong> messages sent to us, subscription plan, billing history and payment status. Payment providers handle full card or bank credentials; AI-BOS does not need to store them.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    content: (
      <>
        <p>We use information to provide, secure and improve AI-BOS. This includes creating your workspace, keeping connected records consistent, authenticating users, processing subscriptions, responding to support and sending service notices.</p>
        <p>We also use aggregated or de-identified information to understand reliability and feature adoption. We do not sell personal information or customer business records.</p>
      </>
    ),
  },
  {
    id: "ai-features",
    title: "AI assistant and automated features",
    content: (
      <>
        <p>When you use the AI assistant, we process your prompt and the relevant business context required to answer it—for example, invoice totals when you ask about outstanding payments. Tool activity and feedback may be retained to show conversation history, investigate errors and improve response quality.</p>
        <p>AI-BOS does not use private customer invoices, payment records or contact lists to train public AI models. Avoid entering passwords, OTPs, full payment credentials or information that is not needed for the request.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "When information is shared",
    content: (
      <>
        <p>We share information only where needed to operate the service, follow your instructions, comply with law or protect users. Service providers may support hosting, storage, email delivery, analytics, customer support, AI processing and subscription payments.</p>
        <p>Providers are given only the information needed for their function and are expected to protect it. If you connect an integration such as WhatsApp Business, Razorpay or cloud storage, information is also handled under that provider’s terms and privacy practices.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    content: (
      <>
        <p>We retain information while an account is active and as needed to provide the service, maintain billing and security records, resolve disputes and meet legal obligations. Retention periods vary by the type and purpose of information.</p>
        <p>When a workspace is deleted, active service copies are removed or de-identified within a reasonable period. Limited backup, fraud-prevention, billing or legal records may remain until their retention period ends.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    content: (
      <>
        <p>We use administrative, technical and organisational safeguards designed to protect information from unauthorised access, alteration, disclosure or loss. Controls include access restriction, protected transmission, session management, monitoring and recovery practices.</p>
        <p>No system is completely secure. Account owners should use a unique password, limit team permissions, review active sessions and report suspicious activity promptly.</p>
      </>
    ),
  },
  {
    id: "choices-and-rights",
    title: "Your choices and rights",
    content: (
      <>
        <p>Depending on applicable law, you may request access, correction, export or deletion of personal information, object to certain processing or withdraw consent where consent is the basis for processing.</p>
        <p>Workspace settings let account owners update profile and business details, manage notification channels, remove team access and request cancellation. For information held by a business using AI-BOS, contact that business first because it controls the record.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: (
      <>
        <p>AI-BOS may use cookies or similar browser storage to keep you signed in, remember preferences such as theme, protect sessions and understand service performance. Essential storage is required for core operation; optional analytics choices will be presented where required.</p>
      </>
    ),
  },
  {
    id: "children-and-transfers",
    title: "Children and data transfers",
    content: (
      <>
        <p>AI-BOS is intended for businesses and is not directed to children. Users must be legally able to operate or act for the business account they create.</p>
        <p>Service providers may process information in locations outside your state or country. Where required, we use contractual and organisational safeguards for those transfers.</p>
      </>
    ),
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    content: (
      <>
        <p>We may update this policy as AI-BOS, applicable law or our providers change. Material updates will be highlighted in the product or sent to the account email before they take effect where appropriate.</p>
        <p>For a privacy question or request, email <a href="mailto:privacy@ai-bos.in">privacy@ai-bos.in</a> or use the <Link href="/contact">contact form</Link>. Include the account email and the nature of your request, but do not send passwords or payment credentials.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      summary="A plain-language explanation of the information AI-BOS needs, how it is used and the choices available to account owners, team members and customers."
      effectiveDate="1 August 2026"
      sections={sections}
    />
  );
}

