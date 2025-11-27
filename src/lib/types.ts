export interface Inputs {
  currentSavings: number
  monthlyIncome: number
  monthlyExpenses: number
  targetSavings: number
  monthlyAdditionalDeposit?: number
  annualInterestRate?: number // percent
  startDate?: string // ISO date
}

export interface MonthlyEntry {
  monthIndex: number
  date?: string
  balance: number
}

export interface SimulationResult {
  monthsNeeded: number | null
  endDate?: string | null
  monthlyBreakdown: MonthlyEntry[]
  totalContributions: number
  totalInterestEarned: number
  summary: string
  impossible?: boolean
}
