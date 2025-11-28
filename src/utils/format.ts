import { CURRENCIES, type CurrencyCode } from '../context/CurrencyContext';

export function getSymbol(code: CurrencyCode) {
  return CURRENCIES.find(c => c.code === code)?.symbol || '';
}

export function formatCurrency(amount: number, code: CurrencyCode) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${getSymbol(code)}${formatNumber(amount)}`;
  }
}

export function formatNumber(n: number, maxFractionDigits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: maxFractionDigits }).format(n);
}

export function parseNumber(input: string): number {
  if (!input) return 0;
  // Remove everything except digits, minus, and dot/comma
  const normalized = input.replace(/[^\d,.-]/g, '').replace(',', '.');
  const val = parseFloat(normalized);
  return isNaN(val) ? 0 : val;
}
