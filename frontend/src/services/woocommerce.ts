/**
 * WooCommerce API Service
 * Calls WooCommerce REST API directly using consumer key/secret in query params.
 * No backend proxy needed - WooCommerce REST API supports public access.
 */

import { getStoreConfig } from '../config/storeConfig';

// Get WooCommerce credentials for the current store, based on which frontend
// domain the visitor is on (luxeholic.in / luxeholic.com.au / luxeholic.co.nz).
function getWooConfig() {
  const country = getStoreConfig().country;

  let url = import.meta.env.VITE_WOOCOMMERCE_URL_INDIA || '';
  let key = import.meta.env.VITE_WOOCOMMERCE_KEY_INDIA || '';
  let secret = import.meta.env.VITE_WOOCOMMERCE_SECRET_INDIA || '';

  if (country === 'AU') {
    url = import.meta.env.VITE_WOOCOMMERCE_URL_AUSTRALIA || url;
    key = import.meta.env.VITE_WOOCOMMERCE_KEY_AUSTRALIA || key;
    secret = import.meta.env.VITE_WOOCOMMERCE_SECRET_AUSTRALIA || secret;
  } else if (country === 'NZ') {
    url = import.meta.env.VITE_WOOCOMMERCE_URL_NEWZEALAND || url;
    key = import.meta.env.VITE_WOOCOMMERCE_KEY_NEWZEALAND || key;
    secret = import.meta.env.VITE_WOOCOMMERCE_SECRET_NEWZEALAND || secret;
  }

  return { url, key, secret };
}

// Read at call time via a getter, not a module-load-time constant, so a
// region correction from the async IP lookup is picked up on the next call.
function getApiBase() {
  const { url } = getWooConfig();
  return `${url}/wp-json/wc/v3`;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  rating_count: number;
  average_rating: string;
  stock_status: string;
}

/**
 * Fetch products directly from WooCommerce REST API
 */
export async function fetchWooProducts(
  page = 1,
  perPage = 12,
  category?: string,
  search?: string
): Promise<{ products: WooProduct[]; total: number }> {
  const { key, secret } = getWooConfig();
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    orderby: 'date',
    order: 'desc',
    status: 'publish',
    consumer_key: key,
    consumer_secret: secret,
  });

  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const response = await fetch(`${getApiBase()}/products?${params}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to fetch products: ${response.statusText}`);
  }

  const products: WooProduct[] = await response.json();
  const total = parseInt(response.headers.get('X-WP-Total') || '0');

  return { products, total };
}

/**
 * Fetch single product by ID directly from WooCommerce REST API
 */
export async function fetchWooProduct(productId: number): Promise<WooProduct> {
  const { key, secret } = getWooConfig();
  const params = new URLSearchParams({
    consumer_key: key,
    consumer_secret: secret,
  });

  const response = await fetch(`${getApiBase()}/products/${productId}?${params}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch WooCommerce categories directly from REST API
 */
export async function fetchWooCategories() {
  const { key, secret } = getWooConfig();
  const params = new URLSearchParams({
    per_page: '100',
    hide_empty: 'true',
    consumer_key: key,
    consumer_secret: secret,
  });

  const response = await fetch(`${getApiBase()}/products/categories?${params}`);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}
