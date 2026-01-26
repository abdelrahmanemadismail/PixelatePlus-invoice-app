'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineItemManager } from '@/components/LineItemManager';

export function ServiceDetailsForm() {
  const { serviceDetails, setStep } = useInvoiceStore();

  const handleNext = () => {
    if (!serviceDetails || serviceDetails.lineItems.length === 0) {
      alert('Please add at least one line item before continuing.');
      return;
    }
    setStep(3); // Move to Terms
  };

  const handleBack = () => {
    setStep(1); // Go back to Client Info
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
        <CardDescription>
          Add line items for services or products included in this invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LineItemManager />

        <div className="flex justify-between gap-4 pt-4">
          <Button type="button" variant="outline" size="lg" onClick={handleBack}>
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleNext}
            disabled={!serviceDetails || serviceDetails.lineItems.length === 0}
          >
            Next: Terms & Conditions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
