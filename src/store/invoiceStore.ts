import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ClientInfo,
  ServiceDetails,
  TermsConditions,
  InvoiceStep,
  ValidationErrors,
  LineItem,
  DocumentType,
} from '@/types/invoice';

interface InvoiceStore {
  // State
  documentType: DocumentType;
  currentStep: InvoiceStep;
  clientInfo: ClientInfo | null;
  serviceDetails: ServiceDetails | null;
  terms: TermsConditions | null;
  errors: ValidationErrors;
  invoiceNumber: string;
  invoiceDate: string;
  validUntil: string;

  // Actions
  setDocumentType: (type: DocumentType) => void;
  setStep: (step: InvoiceStep) => void;
  updateClientInfo: (data: Partial<ClientInfo>) => void;
  updateServiceDetails: (data: Partial<ServiceDetails>) => void;
  updateTerms: (data: Partial<TermsConditions>) => void;
  addLineItem: (item: Omit<LineItem, 'id' | 'total'>) => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, data: Partial<Omit<LineItem, 'id'>>) => void;
  calculateTotals: () => void;
  setErrors: (errors: ValidationErrors) => void;
  clearErrors: () => void;
  reset: () => void;
  generateInvoiceNumber: () => void;
  setInvoiceNumber: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setValidUntil: (value: string) => void;
}

const VAT_PERCENTAGE = 5; // UAE standard

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateLineItemTotal = (unitPrice: number, quantity: number): number => {
  return Math.round(unitPrice * quantity * 100) / 100;
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      // Initial state
      documentType: 'invoice',
      currentStep: 0,
      clientInfo: null,
      serviceDetails: {
        lineItems: [],
        subtotal: 0,
        vatAmount: 0,
        vatPercentage: VAT_PERCENTAGE,
        netTotal: 0,
      },
      terms: {
          invoiceNumber: '',
          quotationDate: new Date().toISOString().split('T')[0],
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bankName: 'ADCB',
        accountName: 'pixelate plus for parties & entertainments service EST',
        accountNumber: '14428635920001',
        iban: 'AE390030014428635920001',
        swiftCode: '',
        additionalNotes: `• 50% in Advance and 50% after Installation
• Bank or any transfer/payment charges on client's account.
• Mail your confirmation/LPO to coordinator@alserhmedia.com with payment details to ensure booking. info@pixelateuae.com
• Quote validity: 7 days subject to availability
• Cancellation Policy: Cancellations must be made 7 days before the reserved date. A 25% fee applies for late cancellations.`,
      },
      errors: {},
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],

      // Actions
      setDocumentType: (type) => set({ documentType: type }),
      setStep: (step) => set({ currentStep: step }),

      updateClientInfo: (data) =>
        set((state) => ({
          clientInfo: state.clientInfo
            ? { ...state.clientInfo, ...data }
            : (data as ClientInfo),
        })),

      updateServiceDetails: (data) =>
        set((state) => ({
          serviceDetails: state.serviceDetails
            ? { ...state.serviceDetails, ...data }
            : (data as ServiceDetails),
        })),

      updateTerms: (data) =>
        set((state) => ({
          terms: state.terms ? { ...state.terms, ...data } : (data as TermsConditions),
        })),

      addLineItem: (item) => {
        const newItem: LineItem = {
          id: generateId(),
          ...item,
          total: calculateLineItemTotal(item.unitPrice, item.quantity),
        };

        set((state) => ({
          serviceDetails: {
            ...state.serviceDetails!,
            lineItems: [...state.serviceDetails!.lineItems, newItem],
          },
        }));

        get().calculateTotals();
      },

      removeLineItem: (id) => {
        set((state) => ({
          serviceDetails: {
            ...state.serviceDetails!,
            lineItems: state.serviceDetails!.lineItems.filter((item) => item.id !== id),
          },
        }));

        get().calculateTotals();
      },

      updateLineItem: (id, data) => {
        set((state) => {
          const updatedItems = state.serviceDetails!.lineItems.map((item) => {
            if (item.id === id) {
              const updatedItem = { ...item, ...data };
              return {
                ...updatedItem,
                total: calculateLineItemTotal(
                  updatedItem.unitPrice,
                  updatedItem.quantity
                ),
              };
            }
            return item;
          });

          return {
            serviceDetails: {
              ...state.serviceDetails!,
              lineItems: updatedItems,
            },
          };
        });

        get().calculateTotals();
      },

      calculateTotals: () => {
        const { serviceDetails } = get();
        if (!serviceDetails) return;

        const subtotal = serviceDetails.lineItems.reduce(
          (sum, item) => sum + item.total,
          0
        );
        const vatAmount = Math.round(subtotal * (VAT_PERCENTAGE / 100) * 100) / 100;
        const netTotal = Math.round((subtotal + vatAmount) * 100) / 100;

        set({
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
          serviceDetails: {
            ...serviceDetails,
            subtotal: Math.round(subtotal * 100) / 100,
            vatAmount,
            netTotal,
          },
        });
      },

      setErrors: (errors) => set({ errors }),

      clearErrors: () => set({ errors: {} }),

      reset: () =>
        set({
          documentType: 'invoice',
          currentStep: 0,
          clientInfo: null,
          serviceDetails: {
            lineItems: [],
            subtotal: 0,
            vatAmount: 0,
            vatPercentage: VAT_PERCENTAGE,
            netTotal: 0,
          },
          terms: {
              // invoiceNumber: '',
              // quotationDate: new Date().toISOString().split('T')[0],
              // validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            bankName: 'ADCB',
            accountName: 'pixelate plus for parties & entertainments service EST',
            accountNumber: '14428635920001',
            iban: 'AE390030014428635920001',
            swiftCode: '',
            additionalNotes: `• 50% in Advance and 50% after Installation
• Bank or any transfer/payment charges on client's account.
• Mail your confirmation/LPO to coordinator@alserhmedia.com with payment details to ensure booking. info@pixelateuae.com
• Quote validity: 7 days subject to availability
• Cancellation Policy: Cancellations must be made 7 days before the reserved date. A 25% fee applies for late cancellations.`,
          },
          errors: {},
          invoiceNumber: '',
          invoiceDate: new Date().toISOString().split('T')[0],
        }),

      generateInvoiceNumber: () => {
        const prefix = 'INV';
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        set({ invoiceNumber: `${prefix}-${timestamp}-${random}` });
      },
      setInvoiceNumber: (value) => set({ invoiceNumber: value }),
      setInvoiceDate: (value) => set({ invoiceDate: value }),
      setValidUntil: (value) => set({ validUntil: value }),
    }),
    {
      name: 'invoice-storage',
      version: 1,
    }
  )
);
