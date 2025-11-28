import React from 'react';
import type { CurrencyCode } from '../context/CurrencyContext';
import { CURRENCIES } from '../context/CurrencyContext';
import { formatCurrency as formatCurrencyCore, formatNumber as formatNumberCore, parseNumber as parseNumberCore } from './format';

// Currency formatting (compat layer; prefer using ./format directly)
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$', EUR: '€', JPY: '¥', GBP: '£', AUD: 'A$',
  CAD: 'C$', CHF: 'CHF', CNY: '¥', INR: '₹', MXN: 'MX$',
};

export function getSymbol(code: CurrencyCode) {
  return CURRENCIES.find(c => c.code === code)?.symbol || CURRENCY_SYMBOLS[code] || '';
}

// Reuse core implementation to avoid duplication
export function formatCurrency(amount: number, code: CurrencyCode) {
  return formatCurrencyCore(amount, code);
}

export function formatNumber(n: number, maxFractionDigits = 2) {
  return formatNumberCore(n, maxFractionDigits);
}

export function parseNumber(input: string): number {
  return parseNumberCore(input);
}

// PDF export
export async function exportSectionToPDF(node: HTMLElement, title = 'SarantosCulculator Export') {
  const w = window.open('', 'printWindow');
  if (!w) return;
  const styles = Array.from(document.styleSheets)
    .map((s: CSSStyleSheet) => (s.href ? `<link rel="stylesheet" href="${s.href}">` : ''))
    .join('\n');
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        ${styles}
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { padding: 24px; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        </style>
      </head>
      <body>${node.outerHTML}</body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    w.close();
  }, 300);
}

// Local storage hook
export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = React.useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
