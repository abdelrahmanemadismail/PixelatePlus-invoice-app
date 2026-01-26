'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Edit, FilePlus } from 'lucide-react';
import { PrintLayout } from '@/components/PrintLayout';

export function InvoicePreview() {
  const { clientInfo, serviceDetails, terms, invoiceNumber, invoiceDate, validUntil, generateInvoiceNumber, setStep, reset } =
    useInvoiceStore();

  useEffect(() => {
    if (!invoiceNumber) {
      generateInvoiceNumber();
    }
  }, [invoiceNumber, generateInvoiceNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleEditSection = (step: number) => {
    setStep(step as 0 | 1 | 2 | 3);
  };

  const handleNewInvoice = () => {
    if (confirm('Are you sure you want to create a new invoice? All current data will be lost.')) {
      reset();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Action Buttons - Hidden on Print */}
      <Card className="p-6 no-print">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Invoice Preview</h2>
            <p className="text-muted-foreground">
              Review your invoice before printing
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleNewInvoice}>
              <FilePlus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
            <Button variant="outline" onClick={() => handleEditSection(0)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handlePrint} size="lg">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </Card>

      {/* Print Layout - This will be printed */}
      <PrintLayout
        clientInfo={clientInfo!}
        serviceDetails={serviceDetails!}
        terms={terms!}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        validUntil={validUntil}
        onEditSection={handleEditSection}
      />

      {/* Bottom Actions - Hidden on Print */}
      <div className="flex justify-between gap-4 no-print pb-8">
        <Button variant="outline" size="lg" onClick={() => handleEditSection(2)}>
          Back to Terms
        </Button>
        <Button onClick={handlePrint} size="lg">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
}
