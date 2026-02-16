import type {
  ClientInfo,
  ServiceDetails,
  TermsConditions,
  InvoiceStep,
  DocumentType,
} from '@/types/invoice';

export interface InvoiceState {
  documentType: DocumentType;
  currentStep: InvoiceStep;
  clientInfo: ClientInfo | null;
  serviceDetails: ServiceDetails | null;
  terms: TermsConditions | null;
  invoiceNumber: string;
  quotationNumber: string;
  invoiceDate: string;
  validUntil: string;
}

const VAT_PERCENTAGE = 0; // VAT Disabled as per request

/**
 * Generates unique ID for line items
 */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Calculates line item total
 */
export const calculateLineItemTotal = (
  unitPrice: number | undefined,
  quantity: number
): number => {
  if (unitPrice === undefined) return 0;
  return Math.round(unitPrice * quantity * 100) / 100;
};

/**
 * Calculates all totals for service details
 */
export const calculateTotals = (serviceDetails: ServiceDetails): ServiceDetails => {
  const subtotal = serviceDetails.lineItems.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const discount = serviceDetails.discount || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const vatAmount = Math.round(taxableAmount * (VAT_PERCENTAGE / 100) * 100) / 100;
  const netTotal = Math.round((taxableAmount + vatAmount) * 100) / 100;

  return {
    ...serviceDetails,
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount,
    netTotal,
  };
};

/**
 * Gets default initial state
 */
export const getDefaultState = (): InvoiceState => ({
  documentType: 'invoice',
  currentStep: 0,
  clientInfo: null,
  serviceDetails: {
    projectName: '',
    lineItems: [],
    subtotal: 0,
    discount: 0,
    vatAmount: 0,
    vatPercentage: VAT_PERCENTAGE,
    netTotal: 0,
  },
  terms: {
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
  invoiceNumber: '',
  quotationNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
});

/**
 * Safely parse JSON, return null if invalid
 */
const safeJsonParse = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

/**
 * Serialize state to URLSearchParams
 */
export const serializeToParams = (state: InvoiceState): URLSearchParams => {
  const params = new URLSearchParams();

  // Simple scalar values
  params.set('documentType', state.documentType);
  params.set('currentStep', state.currentStep.toString());
  params.set('invoiceNumber', state.invoiceNumber);
  params.set('quotationNumber', state.quotationNumber);
  params.set('invoiceDate', state.invoiceDate);
  params.set('validUntil', state.validUntil);

  // Complex objects as JSON strings
  if (state.clientInfo) {
    params.set('clientInfo', JSON.stringify(state.clientInfo));
  }
  if (state.serviceDetails) {
    params.set('serviceDetails', JSON.stringify(state.serviceDetails));
  }
  if (state.terms) {
    params.set('terms', JSON.stringify(state.terms));
  }

  return params;
};

/**
 * Deserialize URLSearchParams to state
 */
export const deserializeFromParams = (params: URLSearchParams): InvoiceState | null => {
  try {
    const defaultState = getDefaultState();

    // If no params at all, return null to signal fallback to localStorage
    if (!params.has('currentStep') && !params.has('documentType')) {
      return null;
    }

    const documentType = (params.get('documentType') as DocumentType) || defaultState.documentType;
    const currentStepStr = params.get('currentStep');
    const currentStep = currentStepStr !== null
      ? (parseInt(currentStepStr, 10) as InvoiceStep)
      : defaultState.currentStep;

    const state: InvoiceState = {
      documentType,
      currentStep,
      invoiceNumber: params.get('invoiceNumber') || defaultState.invoiceNumber,
      quotationNumber: params.get('quotationNumber') || defaultState.quotationNumber,
      invoiceDate: params.get('invoiceDate') || defaultState.invoiceDate,
      validUntil: params.get('validUntil') || defaultState.validUntil,
      clientInfo: safeJsonParse<ClientInfo>(params.get('clientInfo')) || defaultState.clientInfo,
      serviceDetails: safeJsonParse<ServiceDetails>(params.get('serviceDetails')) || defaultState.serviceDetails,
      terms: safeJsonParse<TermsConditions>(params.get('terms')) || defaultState.terms,
    };

    return state;
  } catch (error) {
    console.error('Error deserializing URL params:', error);
    return null;
  }
};

/**
 * Generate invoice number
 */
export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
