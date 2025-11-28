import React, { useMemo, useState } from 'react';
import { CURRENCIES, type CurrencyCode, useCurrency } from '../../context/CurrencyContext';
import { formatNumber, parseNumber } from '../../utils/format';

export default function CurrencyConverter() {
  const { convert, loadingRates, rates } = useCurrency();
  const [amount, setAmount] = useState<string>('1000');
  const [from, setFrom] = useState<CurrencyCode>('EUR');
  const [to, setTo] = useState<CurrencyCode>('USD');

  const numericAmount = useMemo(() => parseNumber(amount), [amount]);

  const result = useMemo(() => {
    if (!numericAmount) return 0;
    return convert(numericAmount, from, to);
  }, [numericAmount, from, to, convert]);

  return (
    <div className="card converter">
      <div className="card-title">Currency Converter</div>
      <div className="grid-3">
        <div className="field">
          <label>Amount</label>
          <input className="input" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label>From</label>
          <select className="select" value={from} onChange={e => setFrom(e.target.value as CurrencyCode)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
        <div className="field">
          <label>To</label>
          <select className="select" value={to} onChange={e => setTo(e.target.value as CurrencyCode)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
      </div>
      <div className="result">
        {loadingRates && <span className="hint">Loading latest rates… </span>}
        {!loadingRates && !rates && (
          <span className="hint">Rates unavailable — showing original amount.</span>
        )}
        <span>
          Converted: <strong>{to}</strong> {formatNumber(result)}
        </span>
      </div>
    </div>
  );
}
