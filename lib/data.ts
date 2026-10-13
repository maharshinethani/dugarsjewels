import { supabase } from '@/lib/supabase';
import type { Product, Category, Collection, WebsiteSettings, Currency, ProductCountryPrice } from '@/lib/types';

export async function getProducts(opts?: {
  category?: string;
  collectionSlug?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  limit?: number;
  status?: 'draft' | 'published';
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, collection:collection_id(*), product_images(*)')
    .order('created_at', { ascending: false });

  if (opts?.status) query = query.eq('status', opts.status);
  else query = query.eq('status', 'published');

  if (opts?.category) query = query.eq('category', opts.category);
  if (opts?.featured) query = query.eq('is_featured', true);
  if (opts?.bestseller) query = query.eq('is_bestseller', true);
  if (opts?.newArrival) query = query.eq('is_new_arrival', true);
  if (opts?.limit) query = query.limit(opts.limit);

  let { data, error } = await query;

  if (opts?.collectionSlug && data) {
    const { data: col } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', opts.collectionSlug)
      .maybeSingle();
    if (col) {
      data = data.filter((p) => p.collection_id === col.id);
    }
  }

  if (error) return [];
  return (data as Product[]) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collection:collection_id(*), product_images(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  return data as Product;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data as Category[]) || [];
}

export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data as Collection[]) || [];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Collection;
}

export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as WebsiteSettings;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .neq('id', product.id)
    .or(`category.eq.${product.category},collection_id.eq.${product.collection_id}`)
    .limit(limit);

  if (error || !data) return [];
  return (data as Product[]) || [];
}

// ============================================================
// CURRENCY FORMATTING
// ============================================================

export function formatPrice(
  price: number,
  currencyCode = 'USD',
  currencyInfo?: Currency
): string {
  if (!currencyInfo) {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', AED: 'AED ', SAR: 'SAR ',
      KWD: 'KWD ', QAR: 'QAR ', OMR: 'OMR ', BHD: 'BHD ', INR: '₹',
    };
    const symbol = symbols[currencyCode] || `${currencyCode} `;
    return `${symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  const decimals = currencyInfo.decimal_places;
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currencyInfo.symbol_position === 'after') {
    return `${formatted} ${currencyInfo.symbol}`;
  }
  return `${currencyInfo.symbol}${formatted}`;
}

export function getDisplayName(product: Product, locale: 'en' | 'ar'): string {
  if (locale === 'ar' && product.name_ar) return product.name_ar;
  return product.name_en;
}

export function getProductPrice(product: Product): { current: number; original: number | null; isOnSale: boolean } {
  const current = product.sale_price || product.price;
  const original = product.sale_price ? product.price : product.compare_price;
  return { current, original, isOnSale: !!product.sale_price };
}

// ============================================================
// CURRENCY CONVERSION
// ============================================================

export function convertPrice(
  basePrice: number,
  targetCurrencyCode: string,
  rates: Record<string, number>,
  currencyInfo?: Currency
): { amount: number; currencyCode: string; currencyInfo?: Currency } {
  const rate = rates[targetCurrencyCode] ?? 1;
  const converted = basePrice * rate;
  const decimals = currencyInfo?.decimal_places ?? 2;
  const rounded = Math.round(converted * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return { amount: rounded, currencyCode: targetCurrencyCode, currencyInfo };
}

export function getProductDisplayPrice(
  product: Product,
  selectedCurrencyCode: string,
  rates: Record<string, number>,
  currencies: Currency[],
  countryPrices?: ProductCountryPrice[]
): { current: number; original: number | null; isOnSale: boolean; displayCurrency: string } {
  const baseCurrent = product.sale_price || product.price;
  const baseOriginal = product.sale_price ? product.price : product.compare_price;
  const isOnSale = !!product.sale_price;

  // Mode B: check for country-specific price
  if (countryPrices && countryPrices.length > 0) {
    const cp = countryPrices.find((p) => p.currency_code === selectedCurrencyCode);
    if (cp) {
      const cpCurrent = cp.sale_price ?? cp.price;
      const cpOriginal = cp.sale_price ? cp.price : null;
      return { current: cpCurrent, original: cpOriginal, isOnSale: !!cp.sale_price, displayCurrency: selectedCurrencyCode };
    }
  }

  // Mode A: automatic conversion
  const targetCurrency = currencies.find((c) => c.code === selectedCurrencyCode);
  const converted = convertPrice(baseCurrent, selectedCurrencyCode, rates, targetCurrency);
  const originalConverted = baseOriginal
    ? convertPrice(baseOriginal, selectedCurrencyCode, rates, targetCurrency)
    : null;

  return {
    current: converted.amount,
    original: originalConverted?.amount ?? null,
    isOnSale,
    displayCurrency: selectedCurrencyCode,
  };
}

export function formatDisplayPrice(
  amount: number,
  currencyCode: string,
  currencies: Currency[]
): string {
  const info = currencies.find((c) => c.code === currencyCode);
  return formatPrice(amount, currencyCode, info);
}
