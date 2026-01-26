'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientInfoWithInvoiceSchema, type ClientInfoWithInvoiceInput } from '@/lib/validation';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ClientInfoForm() {
  const { clientInfo, invoiceNumber, invoiceDate, validUntil, setInvoiceNumber, setInvoiceDate, setValidUntil, updateClientInfo, setStep } = useInvoiceStore();

  const form = useForm<ClientInfoWithInvoiceInput>({
    resolver: zodResolver(clientInfoWithInvoiceSchema),
    defaultValues: {
      invoiceNumber: invoiceNumber || '',
      quotationDate: invoiceDate || '',
      validUntil: validUntil || '',
      ...(clientInfo || {
      companyName: '',
      trnNumber: '',
      contactPerson: '',
      email: '',
      phone: '',
      billingAddress: '',
      }),
    },
  });

  const onSubmit = (data: ClientInfoWithInvoiceInput) => {
    const { invoiceNumber: invNo, quotationDate, validUntil: until, ...client } = data;
    updateClientInfo(client);
    setInvoiceNumber(invNo);
    setInvoiceDate(quotationDate);
    setValidUntil(until);
    setStep(2); // Move to Service Details
  };


  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          Enter the client&apos;s company details and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Details</h3>
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice No. *</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-2026-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quotationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quotation Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Pixelate Plus LLC" {...field} />
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
                  <FormLabel>TRN Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456789012345"
                      maxLength={15}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+971 50 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Business Bay, Dubai, UAE"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" size="lg">
                Next: Service Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
