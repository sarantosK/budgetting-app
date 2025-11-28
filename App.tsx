/**
 * App - Main component for the budgeting application
 * 
 * PURPOSE: This component serves as the entry point for the budgeting form,
 * allowing users to input their savings and expenses.
 * 
 * USAGE: Rendered in the main application file to display the budgeting form.
 * 
 * @returns The rendered component containing the budgeting form.
 */

// ============= Imports =============
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useBudgetCalculation } from './hooks/useBudgetCalculation';
import BudgetForm from './components/BudgetForm';
import ResultsDisplay from './components/ResultsDisplay';
import FutureBalanceGoalPage from './pages/FutureBalanceGoalPage';
import HomePage from './pages/HomePage';

// ============= Type Definitions =============
// Define any types or interfaces here if needed in the future

// ============= Constants =============
// Define any constants here if needed in the future

// ============= Helper Functions =============
// Add any helper functions here if needed in the future

// ============= Main Component =============
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
    </div>
  );
}

// ============= Exports =============
export default App;