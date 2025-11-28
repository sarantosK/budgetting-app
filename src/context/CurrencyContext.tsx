import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getRates, convertAmount } from '../services/CurrencyService';

export type CurrencyCode = 'USD'|'EUR'|'JPY'|'GBP'|'AUD'|'CAD'|'CHF'|'CNY'|'INR'|'MXN';

export const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
];

type Rates = Record<CurrencyCode, number>;

type CurrencyContextValue = {
  currency: CurrencyCode;
  symbol: string;
  setCurrency: (c: CurrencyCode) => void;
  rates: Rates | null;
  loadingRates: boolean;
  convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>(
    (localStorage.getItem('sc_currency') as CurrencyCode) || 'EUR'
  );
  const [rates, setRates] = useState<Rates | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  const symbol = useMemo(
    () => CURRENCIES.find(c => c.code === currency)?.symbol || '',
    [currency]
  );

  useEffect(() => {
    localStorage.setItem('sc_currency', currency);
  }, [currency]);

  useEffect(() => {
    let mounted = true;
    setLoadingRates(true);
    getRates()
      .then(r => {
        if (mounted) setRates(r as Rates);
      })
      .catch(() => {
        // In case getRates ever throws, keep last known rates or null
        if (mounted) setRates(prev => prev);
      })
      .finally(() => {
        if (mounted) setLoadingRates(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const convert = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
    if (!rates) return amount;
    return convertAmount(amount, from, to, rates);
  };

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency, rates, loadingRates, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
