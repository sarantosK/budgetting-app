import React from 'react';
import Chart from './shared/Chart';
import type { SimulationResult } from '../lib/calc';

interface ResultsDisplayProps {
  result: SimulationResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const chartData = result.monthlyBreakdown.map((m) => ({
    label: `M${m.monthIndex}`,
    value: m.balance
  }));

  return (
    <>
      <div className="card">
        <h2 className="card-title">Results Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Months Needed</span>
            <span className="value">
              {result.monthsNeeded === 'Impossible' ? '∞' : result.monthsNeeded}
            </span>
          </div>
          {result.endDate && (
            <div className="summary-item">
              <span className="label">Target Date</span>
              <span className="value">{result.endDate}</span>
            </div>
          )}
          <div className="summary-item">
            <span className="label">Total Contributions</span>
            <span className="value">${result.totalContributions.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Interest</span>
            <span className="value">${result.totalInterestEarned.toFixed(2)}</span>
          </div>
        </div>
        <p className="muted" style={{ marginTop: '1rem' }}>{result.summary}</p>
      </div>

      <div className="card">
        <h2 className="card-title">Balance Projection</h2>
        <Chart data={chartData} height={300} />
      </div>
    </>
  );
}
