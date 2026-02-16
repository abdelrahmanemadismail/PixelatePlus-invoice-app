'use client';

import { useEffect } from 'react';
import { useInvoiceState } from '@/lib/useURLState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Printer, Edit, FilePlus } from 'lucide-react';
import { PrintLayout } from '@/components/PrintLayout';
import { InvoiceStep } from '@/types/invoice';

export function InvoicePreview() {
  const {
    clientInfo,
    serviceDetails,
    terms,
    companyInfo,
    documentTitle,
    invoiceNumber,
    quotationNumber,
    invoiceDate,
    validUntil,
    documentType,
    generateInvoiceNumber,
    setStep,
    reset,
  } = useInvoiceState();

  useEffect(() => {
    if (!invoiceNumber) {
      generateInvoiceNumber();
    }
  }, [invoiceNumber, generateInvoiceNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleEditSection = (step: number) => {
    setStep(step as InvoiceStep);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Action Buttons - Hidden on Print */}
      <Card className="p-6 no-print">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Document Preview</h2>
            <p className="text-muted-foreground">
              Review your document before printing
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FilePlus className="w-4 h-4 mr-2" />
                  New Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Document?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to create a new document? All current data will be lost.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={reset}>Continue</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => handleEditSection(0)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handlePrint} size="lg">
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </Button>
          </div>
        </div>
      </Card>

      {/* Print Layout - This will be printed */}
      <PrintLayout
        documentType={documentType}
        clientInfo={clientInfo!}
        serviceDetails={serviceDetails!}
        terms={terms!}
        companyInfo={companyInfo}
        documentTitle={documentTitle}
        invoiceNumber={invoiceNumber}
        quotationNumber={quotationNumber}
        invoiceDate={invoiceDate}
        validUntil={validUntil}
        onEditSection={handleEditSection}
      />

      {/* Bottom Actions - Hidden on Print */}
      <div className="flex justify-between gap-4 no-print pb-8">
        <Button variant="outline" size="lg" onClick={() => handleEditSection(3)}>
          Back to Terms
        </Button>
        <Button onClick={handlePrint} size="lg">
          <Printer className="w-4 h-4 mr-2" />
          Print Document
        </Button>
      </div>
    </div>
  );
}
