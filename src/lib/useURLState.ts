'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type {
  ClientInfo,
  ServiceDetails,
  TermsConditions,
  InvoiceStep,
  LineItem,
  DocumentType,
} from '@/types/invoice';
import {
  type InvoiceState,
  serializeToParams,
  deserializeFromParams,
  getDefaultState,
  generateId,
  calculateLineItemTotal,
  calculateTotals as calculateTotalsUtil,
  generateInvoiceNumber as generateInvoiceNumberUtil,
} from './urlState';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from './localStorageSync';

interface InvoiceActions {
  setDocumentType: (type: DocumentType) => void;
  setStep: (step: InvoiceStep) => void;
  updateClientInfo: (data: Partial<ClientInfo>) => void;
  updateServiceDetails: (data: Partial<ServiceDetails>) => void;
  updateTerms: (data: Partial<TermsConditions>) => void;
  addLineItem: (item: Omit<LineItem, 'id' | 'total'>) => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, data: Partial<Omit<LineItem, 'id'>>) => void;
  setDiscount: (amount: number) => void;
  reset: () => void;
  generateInvoiceNumber: () => void;
  setInvoiceNumber: (value: string) => void;
  setQuotationNumber: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setValidUntil: (value: string) => void;
}

export type UseInvoiceStateReturn = InvoiceState & InvoiceActions;

/**
 * Main hook for managing invoice state via URL parameters
 * Replaces Zustand store with URL-based state management
 */
export const useInvoiceState = (): UseInvoiceStateReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL or localStorage or defaults
  // This runs once on mount and updates when searchParams reference changes
  const getInitialState = useCallback((): InvoiceState => {
    // Try URL first
    const urlState = deserializeFromParams(searchParams);
    if (urlState) return urlState;

    // Try localStorage backup
    const localState = loadFromLocalStorage();
    if (localState) return localState;

    // Fall back to defaults
    return getDefaultState();
  }, [searchParams]);

  const [state, setStateInternal] = useState<InvoiceState>(getInitialState);

  // Sync state to URL and localStorage
  const syncStateToURL = useCallback(
    (newState: InvoiceState, createHistoryEntry: boolean = false) => {
      const params = serializeToParams(newState);
      const url = `?${params.toString()}`;

      if (createHistoryEntry) {
        router.push(url);
      } else {
        router.replace(url);
      }

      // Save to localStorage as backup
      saveToLocalStorage(newState);
    },
    [router]
  );

  // Update state helper
  const setState = useCallback(
    (updater: (prev: InvoiceState) => InvoiceState, createHistoryEntry: boolean = false) => {
      setStateInternal((prev) => {
        const newState = updater(prev);
        syncStateToURL(newState, createHistoryEntry);
        return newState;
      });
    },
    [syncStateToURL]
  );

  // Sync from URL when searchParams change (e.g., browser back/forward)
  // This effect is intentional to sync external URL state with React state
  useEffect(() => {
    const urlState = deserializeFromParams(searchParams);
    if (urlState) {
      // Use functional update to avoid dependency on state
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStateInternal((currentState) => {
        // Only update if the URL state is different from current state
        if (JSON.stringify(currentState) !== JSON.stringify(urlState)) {
          saveToLocalStorage(urlState);
          return urlState;
        }
        return currentState;
      });
    }
  }, [searchParams]);

  // Actions
  const setDocumentType = useCallback(
    (type: DocumentType) => {
      setState((prev) => ({ ...prev, documentType: type }), false);
    },
    [setState]
  );

  const setStep = useCallback(
    (step: InvoiceStep) => {
      setState((prev) => ({ ...prev, currentStep: step }), false); // No history entry for step navigation
    },
    [setState]
  );

  const updateClientInfo = useCallback(
    (data: Partial<ClientInfo>) => {
      setState((prev) => ({
        ...prev,
        clientInfo: prev.clientInfo
          ? { ...prev.clientInfo, ...data }
          : (data as ClientInfo),
      }), false);
    },
    [setState]
  );

  const updateServiceDetails = useCallback(
    (data: Partial<ServiceDetails>) => {
      setState((prev) => {
        const newServiceDetails = prev.serviceDetails
          ? { ...prev.serviceDetails, ...data }
          : (data as ServiceDetails);
        
        // Recalculate totals if line items are updated
        const updatedServiceDetails = calculateTotalsUtil(newServiceDetails);
        
        return {
          ...prev,
          serviceDetails: updatedServiceDetails,
        };
      }, false);
    },
    [setState]
  );

  const updateTerms = useCallback(
    (data: Partial<TermsConditions>) => {
      setState((prev) => ({
        ...prev,
        terms: prev.terms ? { ...prev.terms, ...data } : (data as TermsConditions),
      }), false);
    },
    [setState]
  );

  const addLineItem = useCallback(
    (item: Omit<LineItem, 'id' | 'total'>) => {
      setState((prev) => {
        if (!prev.serviceDetails) return prev;

        const newItem: LineItem = {
          id: generateId(),
          ...item,
          total: calculateLineItemTotal(item.unitPrice, item.quantity),
        };

        const updatedServiceDetails = {
          ...prev.serviceDetails,
          lineItems: [...prev.serviceDetails.lineItems, newItem],
        };

        return {
          ...prev,
          serviceDetails: calculateTotalsUtil(updatedServiceDetails),
        };
      }, false);
    },
    [setState]
  );

  const removeLineItem = useCallback(
    (id: string) => {
      setState((prev) => {
        if (!prev.serviceDetails) return prev;

        const updatedServiceDetails = {
          ...prev.serviceDetails,
          lineItems: prev.serviceDetails.lineItems.filter((item) => item.id !== id),
        };

        return {
          ...prev,
          serviceDetails: calculateTotalsUtil(updatedServiceDetails),
        };
      }, false);
    },
    [setState]
  );

  const updateLineItem = useCallback(
    (id: string, data: Partial<Omit<LineItem, 'id'>>) => {
      setState((prev) => {
        if (!prev.serviceDetails) return prev;

        const updatedItems = prev.serviceDetails.lineItems.map((item) => {
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

        const updatedServiceDetails = {
          ...prev.serviceDetails,
          lineItems: updatedItems,
        };

        return {
          ...prev,
          serviceDetails: calculateTotalsUtil(updatedServiceDetails),
        };
      }, false);
    },
    [setState]
  );

  const setDiscount = useCallback(
    (amount: number) => {
      setState((prev) => {
        if (!prev.serviceDetails) return prev;

        const updatedServiceDetails = {
          ...prev.serviceDetails,
          discount: amount,
        };

        return {
          ...prev,
          serviceDetails: calculateTotalsUtil(updatedServiceDetails),
        };
      }, false);
    },
    [setState]
  );

  const reset = useCallback(() => {
    const defaultState = getDefaultState();
    setStateInternal(defaultState);
    syncStateToURL(defaultState, true); // Create history entry for reset
    clearLocalStorage();
  }, [syncStateToURL]);

  const generateInvoiceNumber = useCallback(() => {
    setState((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumberUtil(),
    }), false);
  }, [setState]);

  const setInvoiceNumber = useCallback(
    (value: string) => {
      setState((prev) => ({ ...prev, invoiceNumber: value }), false);
    },
    [setState]
  );

  const setQuotationNumber = useCallback(
    (value: string) => {
      setState((prev) => ({ ...prev, quotationNumber: value }), false);
    },
    [setState]
  );

  const setInvoiceDate = useCallback(
    (value: string) => {
      setState((prev) => ({ ...prev, invoiceDate: value }), false);
    },
    [setState]
  );

  const setValidUntil = useCallback(
    (value: string) => {
      setState((prev) => ({ ...prev, validUntil: value }), false);
    },
    [setState]
  );

  return {
    ...state,
    setDocumentType,
    setStep,
    updateClientInfo,
    updateServiceDetails,
    updateTerms,
    addLineItem,
    removeLineItem,
    updateLineItem,
    setDiscount,
    reset,
    generateInvoiceNumber,
    setInvoiceNumber,
    setQuotationNumber,
    setInvoiceDate,
    setValidUntil,
  };
};
