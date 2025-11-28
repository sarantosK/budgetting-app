import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
}

const HomePage: React.FC = () => {
  const { setCurrentBalance, setMonthlyIncome } = useBalance();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  useEffect(() => {
    setCurrentBalance(balance);
    setMonthlyIncome(totalIncome);
  }, [balance, totalIncome, setCurrentBalance, setMonthlyIncome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all transactions?')) {
      setTransactions([]);
    }
  };

  return (
    <div className="page page-transition">
      <div className="page-header">
        <h1 className="page-title">Sarantos Calculations</h1>
        <p className="page-subtitle">
          Record your income and expenses and keep a clear overview of your finances.
        </p>
      </div>

      {/* Add transaction */}
      <div className="card">
        <div className="card-title">Add transaction</div>
        <p className="card-description">
          Quickly log new income or expenses. We&apos;ll update your balance and summaries for you.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="field">
              <label>Description</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Grocery shopping"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Amount ($)</label>
              <input
                type="number"
                className="input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="income">💰 Income</option>
                <option value="food">🍔 Food & Dining</option>
                <option value="transport">🚗 Transport</option>
                <option value="utilities">💡 Utilities</option>
                <option value="entertainment">🎮 Entertainment</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="health">🏥 Health</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            <div className="field">
              <label>Type</label>
              <select
                className="select"
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn-primary">
              Add Transaction
            </button>
            <button type="button" onClick={handleClearAll} className="btn-danger">
              Clear All
            </button>
          </div>
        </form>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-title">Financial overview</div>
        <div className="summary-grid" style={{ marginTop: '0.5rem' }}>
          <div className="summary-item">
            <span className="summary-label">Total Income</span>
            <span className="summary-value" style={{ color: 'var(--success)' }}>
              ${totalIncome.toFixed(2)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Expenses</span>
            <span className="summary-value" style={{ color: 'var(--danger)' }}>
              ${totalExpenses.toFixed(2)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Current Balance</span>
            <span
              className="summary-value"
              style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}
            >
              ${balance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="card-title">Transaction history</div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div>No transactions yet. Add your first transaction above.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 8 }}>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  transition: 'box-shadow 0.16s ease, transform 0.12s ease, background 0.16s ease',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{transaction.description}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {transaction.category}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'right',
                    color:
                      transaction.type === 'income' ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
