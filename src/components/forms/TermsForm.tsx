'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { termsWithCompanySchema, type TermsWithCompanyInput } from '@/lib/validation';
import { useInvoiceState } from '@/lib/useURLState';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TermsForm() {
  const {
    terms,
    companyInfo,
    documentTitle,
    updateTerms,
    updateCompanyInfo,
    setDocumentTitle,
    setStep,
  } = useInvoiceState();

  const form = useForm<TermsWithCompanyInput>({
    resolver: zodResolver(termsWithCompanySchema),
    defaultValues: {
      bankName: terms?.bankName || 'ADCB',
      accountName:
        terms?.accountName || 'pixelate plus for parties & entertainments service EST',
      accountNumber: terms?.accountNumber || '14428635920001',
      iban: terms?.iban || 'AE390030014428635920001',
      swiftCode: terms?.swiftCode || '',
      additionalNotes:
        terms?.additionalNotes ||
        '• 50% in Advance and 50% after Installation\n• Bank or any transfer/payment charges on client\'s account.\n• Mail your confirmation/LPO to coordinator@alserhmedia.com with payment details to ensure booking. info@pixelateuae.com\n• Quote validity: 7 days subject to availability\n• Cancellation Policy: Cancellations must be made 7 days before the reserved date. A 25% fee applies for late cancellations.',
      documentTitle: documentTitle || '',
      name: companyInfo?.name || 'Pixelate Plus',
      tagline: companyInfo?.tagline || 'Creative Event Solutions',
      phone: companyInfo?.phone || '+971 55 557 0449',
      email: companyInfo?.email || 'info@pixelateuae.com',
      addressLine1: companyInfo?.addressLine1 || 'Lootah Building, Floor 1 (A104), JVC',
      addressLine2: companyInfo?.addressLine2 || 'Dubai, United Arab Emirates',
      trnNumber: companyInfo?.trnNumber || '105353650200003',
    },
  });

  const onSubmit = (data: TermsWithCompanyInput) => {
    updateTerms({
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      iban: data.iban,
      swiftCode: data.swiftCode,
      additionalNotes: data.additionalNotes,
    });
    updateCompanyInfo({
      name: data.name,
      tagline: data.tagline || '',
      phone: data.phone || '',
      email: data.email || '',
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      trnNumber: data.trnNumber || '',
    });
    setDocumentTitle(data.documentTitle);
    setStep(4); // Move to Preview
  };

  const handleBack = () => {
    setStep(2); // Go back to Service Details
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
        <CardDescription>
          Defaults applied; edit if needed before printing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Document Settings</h3>

              <FormField
                control={form.control}
                name="documentTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="INVOICE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Details</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pixelate Plus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="Creative Event Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+971 55 557 0449" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@pixelateuae.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Lootah Building, Floor 1 (A104), JVC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Dubai, United Arab Emirates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trnNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Registration Number (TRN)</FormLabel>
                    <FormControl>
                      <Input placeholder="105353650200003" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bank Details</h3>

              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="ADCB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Company account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="14428635920001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN *</FormLabel>
                    <FormControl>
                      <Input placeholder="AE390030014428635920001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="swiftCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swift Code / BIC</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Edit your invoice terms..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Defaults provided; adjust if needed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4 pt-4">
              <Button type="button" variant="outline" size="lg" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" size="lg">
                Next: Preview Invoice
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
