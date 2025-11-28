import React from 'react';
import { CURRENCIES, useCurrency, type CurrencyCode } from '../../context/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="card subtle">
      <div className="card-title">Currency</div>
      <select
        className="select"
        value={currency}
        onChange={e => setCurrency(e.target.value as CurrencyCode)}
        aria-label="Select currency"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
        ))}
      </select>
      <div className="hint">Applies across the app</div>
    </div>
  );
}
