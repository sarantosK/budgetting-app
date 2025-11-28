import React from 'react';
import { useBudgetCalculation } from './hooks/useBudgetCalculation';
import BudgetForm from './components/BudgetForm';
import ResultsDisplay from './components/ResultsDisplay';
import CurrencyConverter from './components/CurrencyConverter';

function App() {
  const { inputs, result, error, handleInputChange, handleSubmit } = useBudgetCalculation({
    currentSavings: 2000,
    monthlyIncome: 3500,
    monthlyExpenses: 2700,
    targetSavings: 10000,
    monthlyAdditionalDeposit: 200,
    annualInterestRate: 1.2,
    startDate: '',
  });

  return (
    <div className="page page-transition">
      <div className="card">
        <BudgetForm
          inputs={inputs}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error={error}
        />
        {result && <ResultsDisplay result={result} />}
      </div>
      <CurrencyConverter />
    </div>
  );
}

export default App;
