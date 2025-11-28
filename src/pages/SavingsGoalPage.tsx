import React, { useMemo, useRef, useState } from 'react';
import FormField from '../components/inputs/FormField';
import Card from '../components/shared/Card';
import Chart from '../components/shared/Chart';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency, exportSectionToPDF } from '../utils/helpers';
import CurrencyConverter from '../components/currency/CurrencyConverter';

type BreakdownRow = { label: string; contribution: number; interest: number; balance: number; date: Date };

export default function SavingsGoalPage() {
  const { currency, symbol } = useCurrency();
  const [current, setCurrent] = useState(0);
  const [income, setIncome] = useState(2500);
  const [expenses, setExpenses] = useState(1800);
  const [additional, setAdditional] = useState(200);
  const [annualRate, setAnnualRate] = useState(3);
  const [target, setTarget] = useState(10000);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ months: number; endDate: Date; totalContrib: number; totalInterest: number; chart: BreakdownRow[] } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    const e: string[] = [];
    if (target <= current) e.push('Target must be greater than current savings.');
    if (income < 0 || expenses < 0 || additional < 0) e.push('Amounts cannot be negative.');
    if (annualRate < 0) e.push('Interest rate cannot be negative.');
    setErrors(e);
    return e.length === 0;
  };

  const onCalculate = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 300)); // smooth loading
    const monthlyRate = annualRate / 100 / 12;
    const start = new Date(startDate);
    let balance = current;
    let months = 0;
    let totalContrib = 0;
    let totalInterest = 0;
    const rows: BreakdownRow[] = [];

    const monthlyContribution = Math.max(0, income - expenses + additional);

    // Simulate up to 50 years as a guard
    for (let i = 0; i < 600 && balance < target; i++) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + i + 1);
      const interest = (balance + monthlyContribution) * monthlyRate;
      balance += monthlyContribution + interest;
      totalContrib += monthlyContribution;
      totalInterest += interest;
      months++;
      rows.push({
        label: `${date.toLocaleString(undefined, { month: 'short' })} ${date.getFullYear()}`,
        contribution: monthlyContribution,
        interest,
        balance,
        date
      });
    }

    setResult({ months, endDate: rows[rows.length - 1]?.date || start, totalContrib, totalInterest, chart: rows });
    setLoading(false);
  };

  const canExport = !!result;

  const summary = useMemo(() => {
    if (!result) return null;
    return [
      { label: 'Months to goal', value: result.months },
      { label: 'End date', value: result.endDate.toDateString() },
      { label: 'Total contributions', value: formatCurrency(result.totalContrib, currency) },
      { label: 'Total interest', value: formatCurrency(result.totalInterest, currency) }
    ];
  }, [result, currency]);

  return (
    <div className="page">
      <Card>
        <div className="card-title">Future Savings Goal Calculator</div>
        <div className="grid-3">
          <FormField label="Current Savings" value={current} onChange={(v) => setCurrent(v as number)} postfix={symbol} />
          <FormField label="Monthly Income" value={income} onChange={(v) => setIncome(v as number)} postfix={symbol} />
          <FormField label="Monthly Expenses" value={expenses} onChange={(v) => setExpenses(v as number)} postfix={symbol} />
          <FormField label="Additional Deposit" value={additional} onChange={(v) => setAdditional(v as number)} postfix={symbol} />
          <FormField label="Interest Rate" value={annualRate} onChange={(v) => setAnnualRate(v as number)} postfix="%" tooltip="Annual percentage yield" />
          <FormField label="Target Goal" value={target} onChange={(v) => setTarget(v as number)} postfix={symbol} />
          <FormField label="Start Date" value={startDate} onChange={(v) => setStartDate(v as string)} type="date" />
        </div>

        {errors.length > 0 && (
          <div className="alert">
            {errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}

        <div className="actions">
          <button className="btn primary" onClick={onCalculate} disabled={loading}>
            {loading ? 'Calculating…' : 'Calculate'}
          </button>
          <button
            className="btn"
            disabled={!result}
            onClick={() => resultsRef.current && exportSectionToPDF(resultsRef.current, 'Savings Goal')}
          >
            Export PDF
          </button>
        </div>
      </Card>

      {result && (
        <div ref={resultsRef}>
          <Card>
            <div className="card-title">Month-by-Month</div>
            <Chart data={result.chart.map((r: any) => ({ label: r.label, value: r.balance }))} />
          </Card>
        </div>
      )}

      <CurrencyConverter />
    </div>
  );
}
