import type { CurrencyCode } from '../context/CurrencyContext';

type Rates = Record<CurrencyCode, number>;

const STORAGE_KEY = 'sc_rates_cache_v1';
const CACHE_MS = 1000 * 60 * 60; // 1 hour
const DEFAULT_BASE: CurrencyCode = 'EUR';
const FALLBACK_RATES: Rates = {
  USD: 1.08, EUR: 1, JPY: 170, GBP: 0.86, AUD: 1.62, 
  CAD: 1.47, CHF: 0.95, CNY: 7.65, INR: 90.0, MXN: 19.5
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
    // Always fall back to built-in static rates if network fails
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), rates: FALLBACK_RATES }));
    return FALLBACK_RATES;
  }
}

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode, rates: Rates): number {
  if (from === to) return amount;
  const fromInBase = amount / rates[from];
  return fromInBase * rates[to];
}
