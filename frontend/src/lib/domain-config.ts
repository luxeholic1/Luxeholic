// Domain to country mapping for multidomain setup.
// luxeholic.in / luxeholic.com.au / luxeholic.co.nz are the three frontend
// domains; store.luxeholic.in / store.luxeholic.com.au / store.luxeholic.co.nz are backend
// WooCommerce subdomains only — a browser never visits those directly, so
// they don't belong in this hostname-detection map.
export const DOMAIN_CONFIG = {
  'luxeholic.in': 'IN',
  'www.luxeholic.in': 'IN',
  'luxeholic.com.au': 'AU',
  'www.luxeholic.com.au': 'AU',
  'luxeholic.co.nz': 'NZ',
  'www.luxeholic.co.nz': 'NZ',

  // Development domains
  'localhost': 'IN', // Default for development
  '127.0.0.1': 'IN',
  'localhost:5173': 'IN',
  'localhost:5174': 'IN', // Current dev port
  'localhost:3000': 'IN',
  '127.0.0.1:5173': 'IN',
  '127.0.0.1:5174': 'IN',
  '127.0.0.1:3000': 'IN',
};

// Inline domain suffix map — avoids circular import with CurrencyContext
const COUNTRY_DOMAIN_MAP: Record<string, string> = {
  US: '.com', GB: '.co.uk', IN: '.in', DE: '.de', FR: '.fr',
  JP: '.jp', AU: '.com.au', NZ: '.co.nz', CA: '.ca',
  AE: '.ae', SG: '.sg', BR: '.br', KR: '.kr',
};

export function getCountryFromDomain(hostname: string): string | null {
  // Remove port for localhost
  const cleanHostname = hostname.replace(/:\d+$/, '');

  // Direct match
  if (DOMAIN_CONFIG[cleanHostname as keyof typeof DOMAIN_CONFIG]) {
    return DOMAIN_CONFIG[cleanHostname as keyof typeof DOMAIN_CONFIG];
  }

  // Check for subdomain (like au.luxeholic.com)
  const parts = cleanHostname.split('.');
  if (parts.length > 2) {
    const subdomain = parts[0];
    const domain = parts.slice(1).join('.');
    const fullDomain = `${subdomain}.${domain}`;

    if (DOMAIN_CONFIG[fullDomain as keyof typeof DOMAIN_CONFIG]) {
      return DOMAIN_CONFIG[fullDomain as keyof typeof DOMAIN_CONFIG];
    }
  }

  return null;
}

export function getDomainFromCountry(countryCode: string): string {
  return COUNTRY_DOMAIN_MAP[countryCode] || '.com';
}

export function getFullDomain(countryCode: string): string {
  const domain = getDomainFromCountry(countryCode);
  return `luxeholic${domain}`;
}
