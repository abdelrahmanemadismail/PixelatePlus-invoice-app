import type { InvoiceState } from './urlState';

const STORAGE_KEY = 'invoice-storage-backup';
const STORAGE_VERSION = 1;

interface StorageWrapper {
  version: number;
  state: InvoiceState;
}

/**
 * Save state to localStorage as backup
 */
export const saveToLocalStorage = (state: InvoiceState): void => {
  try {
    const wrapper: StorageWrapper = {
      version: STORAGE_VERSION,
      state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load state from localStorage backup
 */
export const loadFromLocalStorage = (): InvoiceState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const wrapper: StorageWrapper = JSON.parse(stored);

    // Version check - if version mismatch, ignore stored data
    if (wrapper.version !== STORAGE_VERSION) {
      console.warn('localStorage version mismatch, ignoring stored data');
      clearLocalStorage();
      return null;
    }

    return wrapper.state;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Clear localStorage backup
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
