import React, { useEffect, useState } from 'react'
import { simulateSavings, SimulationResult } from './lib/calc'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function App() {
  const [inputs, setInputs] = useState({
    currentSavings: 2000,
    monthlyIncome: 3500,
    monthlyExpenses: 2700,
    targetSavings: 10000,
    monthlyAdditionalDeposit: 200,
    annualInterestRate: 1.2,
    startDate: ''
  })
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function run() {
    try {
      setError(null)
      const res = simulateSavings(inputs)
      setResult(res)
    } catch (e: any) {
      setError(e.message || String(e))
      setResult(null)
    }
  }

  // live what-if updates: re-run on input changes
  useEffect(() => {
    // small timeout to batch quick edits
    const t = setTimeout(() => run(), 200)
    return () => clearTimeout(t)
  }, [inputs])

  return (
    <div className="app">
      <h1>Budgetting App</h1>
      <div className="container">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            run()
          }}
        >
          <label>
            Current Savings
            <input
              type="number"
              value={inputs.currentSavings}
              onChange={(e) => setInputs({ ...inputs, currentSavings: Number(e.target.value) })}
            />
          </label>
          <label>
            Monthly Income
            <input
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => setInputs({ ...inputs, monthlyIncome: Number(e.target.value) })}
            />
          </label>
          <label>
            Monthly Expenses
            <input
              type="number"
              value={inputs.monthlyExpenses}
              onChange={(e) => setInputs({ ...inputs, monthlyExpenses: Number(e.target.value) })}
            />
          </label>
          <label>
            Monthly Additional Deposit
            <input
              type="number"
              value={inputs.monthlyAdditionalDeposit}
              onChange={(e) => setInputs({ ...inputs, monthlyAdditionalDeposit: Number(e.target.value) })}
            />
          </label>
          <label>
            Annual Interest Rate (%)
            <input
              type="number"
              step="0.01"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: Number(e.target.value) })}
            />
          </label>
          <label>
            Target Savings
            <input
              type="number"
              value={inputs.targetSavings}
              onChange={(e) => setInputs({ ...inputs, targetSavings: Number(e.target.value) })}
            />
          </label>
          <label>
            Start Date (optional YYYY-MM-DD)
            <input
              type="date"
              value={inputs.startDate}
              onChange={(e) => setInputs({ ...inputs, startDate: e.target.value })}
            />
          </label>
          <div className="form-actions">
            <button type="submit">Calculate</button>
            <button
              type="button"
              onClick={() => {
                setInputs({
                  currentSavings: 2000,
                  monthlyIncome: 3500,
                  monthlyExpenses: 2700,
                  targetSavings: 10000,
                  monthlyAdditionalDeposit: 200,
                  annualInterestRate: 1.2,
                  startDate: ''
                })
                setResult(null)
                setError(null)
              }}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="results">
          {error && <div className="error">{error}</div>}
          {result && (
            <div>
              <h2>Summary</h2>
              <p>{result.summary}</p>
              <ul>
                <li>Months needed: {result.monthsNeeded}</li>
                <li>End date: {result.endDate ?? 'N/A'}</li>
                <li>Total contributions: {result.totalContributions.toFixed(2)}</li>
                <li>Total interest earned: {result.totalInterestEarned.toFixed(2)}</li>
              </ul>
              {result.monthlyBreakdown && result.monthlyBreakdown.length > 0 && (
                <div style={{ height: 300 }}>
                  <h3>Balance Over Time</h3>
                  <Line
                    data={{
                      labels: result.monthlyBreakdown.map((m) => m.date ?? `M${m.monthIndex}`),
                      datasets: [
                        {
                          label: 'Balance',
                          data: result.monthlyBreakdown.map((m) => Number(m.balance.toFixed(2))),
                          borderColor: 'rgba(75,192,192,1)',
                          backgroundColor: 'rgba(75,192,192,0.2)'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top' as const } }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
