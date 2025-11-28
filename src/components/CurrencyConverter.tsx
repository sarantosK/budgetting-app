import React, { useCallback, useEffect, useMemo, useState } from 'react';

const SUPPORTED_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'SEK',
  'NOK',
  'BRL',
  'INR',
] as const;

type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];
type RatesDictionary = Record<string, number>;

const API_ENDPOINT = 'https://api.exchangerate.host/latest';

const formatAmount = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR');
  const [rates, setRates] = useState<RatesDictionary>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRates = useCallback(
    async (signal?: AbortSignal) => {
      setStatus('loading');
      setErrorMessage(null);

      try {
        const response = await fetch(`${API_ENDPOINT}?base=${fromCurrency}`, { signal });

        if (!response.ok) {
          throw new Error(`Live rate request failed (${response.status})`);
        }

        const data = await response.json();
        const nextRates: RatesDictionary = data?.rates ?? {};

        setRates(nextRates);
        setLastUpdated(data?.date ?? null);
        setStatus('idle');
      } catch (err) {
        const aborted =
          (signal && signal.aborted) ||
          (err instanceof DOMException && err.name === 'AbortError');

        if (aborted) return;

        setRates({});
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Live currency data is temporarily unavailable.'
        );
      }
    },
    [fromCurrency]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchRates(controller.signal);
    return () => controller.abort();
  }, [fetchRates]);

  const parsedAmount = useMemo(() => {
    if (amount.trim() === '') return 0;
    const numericValue = Number(amount);
    return Number.isFinite(numericValue) ? numericValue : NaN;
  }, [amount]);

  const conversionRate = rates[toCurrency] ?? null;
  const convertedAmount = useMemo(() => {
    if (!conversionRate || Number.isNaN(parsedAmount)) return null;
    return parsedAmount * conversionRate;
  }, [conversionRate, parsedAmount]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isLoading = status === 'loading';

  return (
    <section className="card currency-converter">
      <header className="card-header">
        <h2>Real-time Currency Converter</h2>
        {lastUpdated && (
          <small aria-live="polite">
            Rates updated {new Date(lastUpdated).toLocaleDateString()}
          </small>
        )}
      </header>

      <div className="converter-grid">
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label>
          From
          <select
            value={fromCurrency}
            onChange={(event) => setFromCurrency(event.target.value as CurrencyCode)}
            disabled={isLoading}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <label>
          To
          <select
            value={toCurrency}
            onChange={(event) => setToCurrency(event.target.value as CurrencyCode)}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="currency-actions">
        <button type="button" onClick={handleSwap}>
          Swap
        </button>
        <button type="button" onClick={() => fetchRates()} disabled={isLoading}>
          {isLoading ? 'Fetching latest…' : 'Refresh live rates'}
        </button>
      </div>

      {status === 'error' && <p className="error">{errorMessage}</p>}
      {convertedAmount !== null && (
        <p className="conversion-result">
          {formatAmount(parsedAmount)} {fromCurrency} ={' '}
          <strong>{formatAmount(convertedAmount)}</strong> {toCurrency}
        </p>
      )}
      {status === 'loading' && <p>Fetching latest exchange rates…</p>}
    </section>
  );
};

export default CurrencyConverter;