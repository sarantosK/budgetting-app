import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import { CURRENCIES, convertCurrency, formatCurrency } from '../services/CurrencyService';

const FutureBalanceGoalPage: React.FC = () => {
  const { currentBalance, monthlyIncome } = useBalance();
  const [goalBalance, setGoalBalance] = useState<string>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [monthsNeeded, setMonthsNeeded] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>('');

  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    const goal = parseFloat(goalBalance);
    const expenses = parseFloat(monthlyExpenses);

    if (isNaN(goal) || isNaN(expenses) || goal <= 0 || expenses < 0) {
      setMonthsNeeded(null);
      setResultMessage('');
      return;
    }

    if (goal <= currentBalance) {
      setMonthsNeeded(0);
      setResultMessage('You have already reached or exceeded this goal.');
      return;
    }

    const monthlySavings = monthlyIncome - expenses;

    if (monthlySavings <= 0) {
      setMonthsNeeded(null);
      setResultMessage(
        "With the current inputs we can't reach this goal. Please adjust your expenses or goal."
      );
      return;
    }

    const remaining = goal - currentBalance;
    const months = Math.ceil(remaining / monthlySavings);
    setMonthsNeeded(months);
    setResultMessage('');
  }, [goalBalance, monthlyExpenses, currentBalance, monthlyIncome]);

  useEffect(() => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      const result = convertCurrency(amt, fromCurrency, toCurrency);
      setConvertedAmount(result);
    } else {
      setConvertedAmount(0);
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="page page-transition">
      <div className="page-header">
        <h1 className="page-title">Future Balance Goal</h1>
        <p className="page-subtitle">
          Estimate how long it will take to reach your target balance based on your income and
          expenses.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Goal Calculator</div>
        <p className="card-description">
          We use your current balance and monthly income from your main settings. Add your goal and
          expected expenses to see how many months you&apos;ll need.
        </p>

        <div className="grid-2">
          <div className="field">
            <label>Current Balance</label>
            <input
              className="input"
              value={`$${currentBalance.toFixed(2)}`}
              disabled
            />
            <span className="muted" style={{ fontSize: '0.8rem' }}>
              Comes from your main balance tracker
            </span>
          </div>

          <div className="field">
            <label>Monthly Income</label>
            <input
              className="input"
              value={`$${monthlyIncome.toFixed(2)}`}
              disabled
            />
            <span className="muted" style={{ fontSize: '0.8rem' }}>
              Comes from your income settings
            </span>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '1rem' }}>
          <div className="field">
            <label>Goal Balance</label>
            <div className="input-wrap">
              <input
                type="number"
                className="input"
                placeholder="Enter target balance"
                value={goalBalance}
                onChange={(e) => setGoalBalance(e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="postfix">$</span>
            </div>
          </div>

          <div className="field">
            <label>Monthly Expenses</label>
            <div className="input-wrap">
              <input
                type="number"
                className="input"
                placeholder="Enter monthly expenses"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="postfix">$</span>
            </div>
          </div>
        </div>

        {monthsNeeded !== null && !resultMessage && (
          <div className="summary-grid" style={{ marginTop: '1.5rem' }}>
            <div className="summary-item">
              <span className="summary-label">Months Needed</span>
              <span className="summary-value">{monthsNeeded}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Monthly Savings</span>
              <span className="summary-value">
                ${(monthlyIncome - parseFloat(monthlyExpenses || '0')).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {resultMessage && (
          <div
            className="alert"
            style={{ marginTop: '1.5rem' }}
          >
            {resultMessage}
          </div>
        )}
      </div>

      <div className="card subtle">
        <div className="card-title">Currency Converter</div>
        <p className="card-description">
          Quickly convert between major currencies with up-to-date exchange rates.
        </p>

        <div className="grid-3">
          <div className="field">
            <label>Amount</label>
            <input
              type="number"
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="field">
            <label>From Currency</label>
            <select
              className="select"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>To Currency</label>
            <select
              className="select"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="converter"
          style={{
            marginTop: '1.5rem',
            padding: '1.2rem 1.4rem',
            borderRadius: '0.9rem',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <div className="result" style={{ fontSize: '1.4rem', fontWeight: 600 }}>
            {formatCurrency(convertedAmount, toCurrency)}
          </div>
          <div className="muted" style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
            {formatCurrency(parseFloat(amount || '0'), fromCurrency)} ={' '}
            {formatCurrency(convertedAmount, toCurrency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureBalanceGoalPage;
