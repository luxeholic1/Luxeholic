// src/config/storeConfig.ts
//
// Luxeholic has three separate frontend domains, one per region (same pattern
// as Luxtronics), each calling its own WooCommerce backend subdomain:
//   luxeholic.in      (India frontend)      -> store.luxeholic.in (backend)
//   luxeholic.com.au  (Australia frontend)  -> store.luxeholic.com.au    (backend)
//   luxeholic.co.nz   (New Zealand frontend)-> store.luxeholic.co.nz    (backend)

export interface StoreConfig {
  currency: string;
  symbol: string;
  country: string;
  label: string;
  apiUrl: string;
}

const STORE_CONFIG: Record<string, StoreConfig> = {
  'luxeholic.in': {
    currency: 'INR',
    symbol: '₹',
    country: 'IN',
    label: 'India',
    apiUrl: 'https://store.luxeholic.in/wp-json/wc/v3',
  },
  'www.luxeholic.in': {
    currency: 'INR',
    symbol: '₹',
    country: 'IN',
    label: 'India',
    apiUrl: 'https://store.luxeholic.in/wp-json/wc/v3',
  },
  'luxeholic.com.au': {
    currency: 'AUD',
    symbol: 'A$',
    country: 'AU',
    label: 'Australia',
    apiUrl: 'https://store.luxeholic.com.au/wp-json/wc/v3',
  },
  'www.luxeholic.com.au': {
    currency: 'AUD',
    symbol: 'A$',
    country: 'AU',
    label: 'Australia',
    apiUrl: 'https://store.luxeholic.com.au/wp-json/wc/v3',
  },
  'luxeholic.co.nz': {
    currency: 'NZD',
    symbol: 'NZ$',
    country: 'NZ',
    label: 'New Zealand',
    apiUrl: 'https://store.luxeholic.co.nz/wp-json/wc/v3',
  },
  'www.luxeholic.co.nz': {
    currency: 'NZD',
    symbol: 'NZ$',
    country: 'NZ',
    label: 'New Zealand',
    apiUrl: 'https://store.luxeholic.co.nz/wp-json/wc/v3',
  },
};

// Fallback for localhost dev
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'luxeholic.in';

export const storeConfig: StoreConfig = STORE_CONFIG[hostname] ?? STORE_CONFIG['luxeholic.in'];

// Kept as a function for call sites that want to be explicit about reading
// at call-time rather than import-time — same value as `storeConfig` here
// since hostname doesn't change over a page's lifetime, but matches the
// calling convention used across the codebase.
export function getStoreConfig(): StoreConfig {
  return storeConfig;
}

// Export API_URL for backward compatibility
export const API_URL = storeConfig.apiUrl;
