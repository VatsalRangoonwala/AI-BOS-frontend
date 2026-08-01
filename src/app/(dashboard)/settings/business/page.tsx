import type { Metadata } from "next";

import { BusinessForm } from "@/components/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { currentBusiness } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Business settings" };

export default function BusinessSettingsPage() {
  return <Card><CardHeader><CardTitle>Business details</CardTitle><p className="text-sm text-muted-foreground">These details appear across invoices, receipts and customer messages.</p></CardHeader><CardContent><BusinessForm defaults={{ name: currentBusiness.name, type: currentBusiness.type, mobile: currentBusiness.mobile, email: currentBusiness.email, address: `${currentBusiness.address.line1}, ${currentBusiness.address.line2 ?? ""}`.replace(/, $/, ""), city: currentBusiness.address.city, state: currentBusiness.address.state, pin: currentBusiness.address.pinCode, taxId: currentBusiness.taxIdentification, prefix: currentBusiness.preferences.invoicePrefix, currency: currentBusiness.preferences.defaultCurrency, year: currentBusiness.preferences.financialYear, paymentTerms: currentBusiness.preferences.defaultPaymentTermsDays }} /></CardContent></Card>;
}
