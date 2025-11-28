import React from 'react';

interface BudgetFormProps {
  inputs: {
    currentSavings: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    targetSavings: number;
    monthlyAdditionalDeposit: number;
    annualInterestRate: number;
    startDate: string;
  };
  onInputChange: (field: string, value: number | string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

export default function BudgetForm({ inputs, onInputChange, onSubmit, error }: BudgetFormProps) {
  return (
    <div className="card">
      <h2 className="card-title">Budget inputs</h2>
      <p className="card-description">
        Tell us about your current savings, income and goals so we can project your progress.
      </p>
      <form onSubmit={onSubmit}>
        <div className="grid-2">
          <div className="field">
            <label>Current Savings</label>
            <input
              type="number"
              className="input"
              value={inputs.currentSavings}
              onChange={(e) => onInputChange('currentSavings', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Monthly Income</label>
            <input
              type="number"
              className="input"
              value={inputs.monthlyIncome}
              onChange={(e) => onInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Monthly Expenses</label>
            <input
              type="number"
              className="input"
              value={inputs.monthlyExpenses}
              onChange={(e) => onInputChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Target Savings</label>
            <input
              type="number"
              className="input"
              value={inputs.targetSavings}
              onChange={(e) => onInputChange('targetSavings', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Additional Monthly Deposit</label>
            <input
              type="number"
              className="input"
              value={inputs.monthlyAdditionalDeposit}
              onChange={(e) => onInputChange('monthlyAdditionalDeposit', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Annual Interest Rate (%)</label>
            <input
              type="number"
              className="input"
              value={inputs.annualInterestRate}
              onChange={(e) => onInputChange('annualInterestRate', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>Start Date</label>
            <input
              type="date"
              className="input"
              value={inputs.startDate}
              onChange={(e) => onInputChange('startDate', e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="actions" style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn primary">
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
}
