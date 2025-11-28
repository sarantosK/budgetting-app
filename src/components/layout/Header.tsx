import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export default function Header() {
  const { currency, symbol, loadingRates } = useCurrency();

  return (
    <header className="header">
      <div className="header-left">
        <div className="app-name">Sarantos Calculations</div>
        <div className="divider" />
        <div className="header-subtitle">Financial planning tools</div>
      </div>
      <div className="header-right">
        <div className="chip">
          <span
            className="dot"
            style={{ background: loadingRates ? '#f59e0b' : '#16a34a' }}
          />
          Rates: {loadingRates ? 'Updating…' : 'Live'}
        </div>
        <div className="chip">
          Currency: {currency} ({symbol})
        </div>
      </div>
    </header>
  );
}
