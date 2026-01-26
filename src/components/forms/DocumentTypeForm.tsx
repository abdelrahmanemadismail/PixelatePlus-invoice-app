'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { Card } from '@/components/ui/card';
import { FileText, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentType } from '@/types/invoice';

export function DocumentTypeForm() {
  const { documentType, setDocumentType, setStep } = useInvoiceStore();

  const handleSelect = (type: DocumentType) => {
    setDocumentType(type);
    setStep(1); // Move to Client Info
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Select Document Type</h2>
            <p className="text-muted-foreground">Choose the type of document you want to generate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Option */}
            <Card
                className={cn(
                    "cursor-pointer hover:border-primary hover:shadow-md transition-all p-8 flex flex-col items-center justify-center gap-6 h-64 border-2",
                    documentType === 'invoice' ? "border-primary bg-primary/5" : "border-border"
                )}
                onClick={() => handleSelect('invoice')}
            >
                <div className="p-4 rounded-full bg-primary/10">
                    <FileText className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Tax Invoice</h3>
                    <p className="text-sm text-muted-foreground">Generate a standard VAT invoice for billing clients.</p>
                </div>
            </Card>

            {/* Inquiry Option */}
            <Card
                className={cn(
                    "cursor-pointer hover:border-primary hover:shadow-md transition-all p-8 flex flex-col items-center justify-center gap-6 h-64 border-2",
                    documentType === 'inquiry' ? "border-primary bg-primary/5" : "border-border"
                )}
                onClick={() => handleSelect('inquiry')}
            >
                <div className="p-4 rounded-full bg-primary/10">
                    <FileQuestion className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Inquiry / Quotation</h3>
                    <p className="text-sm text-muted-foreground">Create a quotation or inquiry for potential work.</p>
                </div>
            </Card>
        </div>
    </div>
  );
}
