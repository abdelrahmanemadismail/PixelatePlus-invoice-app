export interface ClientInfo {
  companyName: string;
  trnNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
}

export interface LineItem {
  id: string;
  description: string;
  subDescriptions: string[];
  unitPrice?: number;
  quantity: number;
  total: number;
}

export interface ServiceDetails {
  projectName: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  vatAmount: number;
  vatPercentage: number; // UAE standard: 5
  netTotal: number;
}

export interface TermsConditions {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  additionalNotes?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientInfo: ClientInfo | null;
  serviceDetails: ServiceDetails | null;
  terms: TermsConditions | null;
  companyInfo: CompanyInfo;
  documentTitle: string;
  documentType: DocumentType;
}

export type DocumentType = 'invoice' | 'inquiry';

export type InvoiceStep = 0 | 1 | 2 | 3 | 4;

export interface ValidationErrors {
  [key: string]: string[];
}
