'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { termsSchema, type TermsInput } from '@/lib/validation';
import { useInvoiceStore } from '@/store/invoiceStore';
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
  const { terms, updateTerms, setStep } = useInvoiceStore();

  const form = useForm<TermsInput>({
    resolver: zodResolver(termsSchema),
    defaultValues: terms || {
      bankName: 'ADCB',
      accountName: 'pixelate plus for parties & entertainments service EST',
      accountNumber: '14428635920001',
      iban: 'AE390030014428635920001',
      swiftCode: '',
      additionalNotes:
        '• 50% in Advance and 50% after Installation\n• Bank or any transfer/payment charges on client\'s account.\n• Mail your confirmation/LPO to coordinator@alserhmedia.com with payment details to ensure booking. info@pixelateuae.com\n• Quote validity: 7 days subject to availability\n• Cancellation Policy: Cancellations must be made 7 days before the reserved date. A 25% fee applies for late cancellations.',
    },
  });

  const onSubmit = (data: TermsInput) => {
    updateTerms(data);
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
