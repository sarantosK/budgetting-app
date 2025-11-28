import React from 'react';
import Card from '../components/shared/Card';
import CurrencyConverter from '../components/currency/CurrencyConverter';

export default function CurrentBalancePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Current Balance</h1>
        <p className="page-subtitle">
          Track your current balance and explore live currency conversions.
        </p>
      </div>

      <Card>
        <div className="card-title">Current Balance Tracker</div>
        <p className="card-description">
          Integrate your transaction history or manual inputs here to keep your balance up to date.
        </p>
        <div className="muted" style={{ fontSize: 13 }}>
          This section is ready to host your detailed balance tracker.
        </div>
      </Card>

      <Card>
        <div className="card-title">Currency Converter</div>
        <p className="card-description">
          Convert your balance between currencies using the latest available rates.
        </p>
        <CurrencyConverter />
      </Card>
    </div>
  );
}