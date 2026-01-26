import { z } from 'zod';

export const clientInfoSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  trnNumber: z.string().min(1, 'TRN Number is required'),
  contactPerson: z.string().optional(),
  email: z.union([z.email(), z.literal('')]).optional(),
  phone: z.string().optional(),
  billingAddress: z.string().optional(),
});

// Invoice metadata grouped separately, used together with client info in Step 1
export const invoiceMetaSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  quotationDate: z.date({
    message: "Quotation date is required",
  }),
  validUntil: z.date({
    message: "Valid until date is required",
  }),
});

export const clientInfoWithInvoiceSchema = clientInfoSchema.merge(invoiceMetaSchema);

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  subDescriptions: z.array(z.string()),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  total: z.number(),
});

export const serviceDetailsSchema = z.object({
  lineItems: z
    .array(lineItemSchema)
    .min(1, 'At least one line item is required'),
  subtotal: z.number(),
  vatAmount: z.number(),
  vatPercentage: z.number(),
  netTotal: z.number(),
});

export const termsSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountName: z.string().min(2, 'Account name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  iban: z.string().min(15, 'IBAN must be at least 15 characters'),
  swiftCode: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  date: z.string(),
  clientInfo: clientInfoSchema,
  serviceDetails: serviceDetailsSchema,
  terms: termsSchema,
});

// Helper types
export type ClientInfoInput = z.infer<typeof clientInfoSchema>;
export type InvoiceMetaInput = z.infer<typeof invoiceMetaSchema>;
export type ClientInfoWithInvoiceInput = z.infer<typeof clientInfoWithInvoiceSchema>;
export type LineItemInput = z.infer<typeof lineItemSchema>;
export type ServiceDetailsInput = z.infer<typeof serviceDetailsSchema>;
export type TermsInput = z.infer<typeof termsSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
