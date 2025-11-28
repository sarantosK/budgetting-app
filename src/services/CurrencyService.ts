import type { CurrencyCode } from '../context/CurrencyContext';

type Rates = Record<CurrencyCode, number>;

const STORAGE_KEY = 'sc_rates_cache_v1';
const CACHE_MS = 1000 * 60 * 60; // 1 hour

const DEFAULT_BASE: CurrencyCode = 'EUR';
const FALLBACK_RATES_EUR: Rates = {
  USD: 1.08, EUR: 1, JPY: 170, GBP: 0.86, AUD: 1.62, CAD: 1.47, CHF: 0.95, CNY: 7.65, INR: 90.0, MXN: 19.5
};

export async function getRates(): Promise<Rates> {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const { ts, rates } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_MS) return rates;
    } catch {
      // Invalid cache data, continue to fetch
    }
  }
  try {
    const url = `https://api.exchangerate.host/latest?base=${DEFAULT_BASE}&symbols=USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,INR,MXN`;
    const res = await fetch(url);
    const data = await res.json();
    const rates: Rates = data.rates;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), rates }));
    return rates;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), rates: FALLBACK_RATES_EUR }));
    return FALLBACK_RATES_EUR;
  }
}

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode, rates: Rates): number {
  if (from === to) return amount;
  // Rates are relative to DEFAULT_BASE
  const fromInBase = amount / rates[from];
  return fromInBase * rates[to];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];

// Mock exchange rates relative to USD
// Can be replaced with real API calls later
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  JPY: 149.50,
  GBP: 0.79,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  HKD: 7.83,
  NZD: 1.67,
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency];
  
  return convertedAmount;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return `${currency?.symbol || currencyCode} ${amount.toFixed(2)}`;
};
