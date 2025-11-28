import { useState, useCallback, useEffect } from 'react';
import { simulateSavings, SimulationResult } from '../lib/calc';

interface BudgetInputs {
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  targetSavings: number;
  monthlyAdditionalDeposit: number;
  annualInterestRate: number;
  startDate: string;
}

export function useBudgetCalculation(initialInputs: BudgetInputs) {
  const [inputs, setInputs] = useState(initialInputs);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((field: string, value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const res = simulateSavings(inputs);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    }
  }, [inputs]);

  useEffect(() => {
    const timeout = setTimeout(() => calculate(), 200);
    return () => clearTimeout(timeout);
  }, [calculate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  return {
    inputs,
    result,
    error,
    handleInputChange,
    handleSubmit,
  };
}
