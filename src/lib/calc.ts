import { Inputs, SimulationResult, MonthlyEntry } from './types'

const MAX_MONTHS = 10000

function validate(inputs: Inputs) {
  const fields = ['currentSavings', 'monthlyIncome', 'monthlyExpenses', 'targetSavings'] as const
  for (const f of fields) {
    const v = (inputs as any)[f]
    if (typeof v !== 'number' || Number.isNaN(v)) throw new Error(`${f} must be a number`)
    if (v < 0) throw new Error(`${f} must be non-negative`)
  }
  if (inputs.monthlyAdditionalDeposit != null && inputs.monthlyAdditionalDeposit < 0) throw new Error('monthlyAdditionalDeposit must be non-negative')
  if (inputs.annualInterestRate != null && inputs.annualInterestRate < 0) throw new Error('annualInterestRate must be non-negative')
}

export function simulateSavings(inputs: Inputs): SimulationResult {
  validate(inputs)

  const current = inputs.currentSavings
  const target = inputs.targetSavings
  if (target <= current) {
    return {
      monthsNeeded: 0,
      endDate: inputs.startDate || null,
      monthlyBreakdown: [{ monthIndex: 0, date: inputs.startDate || undefined, balance: current }],
      totalContributions: current,
      totalInterestEarned: 0,
      summary: 'Already at or above target.'
    }
  }

  const monthlyNet = inputs.monthlyIncome - inputs.monthlyExpenses
  const monthlyAdditional = inputs.monthlyAdditionalDeposit ?? 0
  const monthlySurplus = monthlyNet + monthlyAdditional

  const annualRate = inputs.annualInterestRate ?? 0
  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0

  const breakdown: MonthlyEntry[] = []
  let balance = current

  // Edge: no surplus and no interest -> impossible
  if (monthlySurplus <= 0 && monthlyRate <= 0) {
    return {
      monthsNeeded: null,
      endDate: null,
      monthlyBreakdown: [{ monthIndex: 0, balance }],
      totalContributions: current,
      totalInterestEarned: 0,
      summary: 'Impossible with given inputs: no net monthly surplus and no interest. Consider increasing income, reducing expenses, or adding deposits.',
      impossible: true
    }
  }

  let months = 0
  let totalAdded = current

  // Simulate month-by-month
  while (months < MAX_MONTHS && balance < target) {
    months++
    // apply interest
    if (monthlyRate > 0) {
      balance = balance * (1 + monthlyRate)
    }
    // add surplus (which may be negative)
    balance = balance + monthlySurplus

    // track contributions: count positive parts
    if (monthlyNet > 0) totalAdded += monthlyNet
    if (monthlyAdditional > 0) totalAdded += monthlyAdditional

    const date = inputs.startDate ? addMonthsISO(inputs.startDate, months) : undefined
    breakdown.push({ monthIndex: months, date, balance })

    // safety: if surplus <= 0 and balance isn't increasing (or decreasing), break
    if (monthlySurplus <= 0 && monthlyRate <= 0 && balance < target) break
    if (monthlySurplus <= 0 && monthlyRate > 0) {
      // if interest alone doesn't increase balance for many iterations, we still let the loop run until MAX_MONTHS
    }
  }

  if (balance >= target) {
    const totalContributions = totalAdded
    const totalInterest = balance - totalContributions
    return {
      monthsNeeded: months,
      endDate: inputs.startDate ? addMonthsISO(inputs.startDate, months) : null,
      monthlyBreakdown: breakdown,
      totalContributions,
      totalInterestEarned: totalInterest,
      summary: `Target reached after ${months} month(s).`
    }
  }

  return {
    monthsNeeded: null,
    endDate: null,
    monthlyBreakdown: breakdown,
    totalContributions: totalAdded,
    totalInterestEarned: balance - totalAdded,
    summary: 'Impossible to reach target within limits. Consider improving inputs.',
    impossible: true
  }
}

function addMonthsISO(isoDate: string, months: number) {
  const d = new Date(isoDate)
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth()
  const day = d.getUTCDate()
  const newMonth = m + months
  const nd = new Date(Date.UTC(y, newMonth, day))
  return nd.toISOString().slice(0, 10)
}
