'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { Stepper } from '@/components/Stepper';
import { ClientInfoForm } from '@/components/forms/ClientInfoForm';
import { ServiceDetailsForm } from '@/components/forms/ServiceDetailsForm';
import { TermsForm } from '@/components/forms/TermsForm';
import { DocumentTypeForm } from '@/components/forms/DocumentTypeForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';
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
import { FilePlus } from 'lucide-react';

export default function Home() {
  const { currentStep, reset } = useInvoiceStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Invoice Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pixelate Plus - Creative Event Solutions
            </p>
          {currentStep > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="no-print">
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
          )}
          </div>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-8">
          <Stepper currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          {currentStep === 0 && <DocumentTypeForm />}
          {currentStep === 1 && <ClientInfoForm />}
          {currentStep === 2 && <ServiceDetailsForm />}
          {currentStep === 3 && <TermsForm />}
          {currentStep === 4 && <InvoicePreview />}
        </div>
      </div>
    </div>
  );
}

