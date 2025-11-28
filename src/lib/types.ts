/**
 * User input data for savings goal calculation.
 * All monetary values are in the user's local currency.
 */
export interface BudgetInputs {
  /** Total monthly income before any deductions (gross income) */
  income: number;

  /** Total monthly expenses including all bills, rent, groceries, etc. */
  expenses: number;

  /** Current savings balance at the start of the simulation */
  currentSavings: number;

  /** Target savings goal amount to reach */
  savingsGoal: number;

  /** Annual interest rate as a percentage (e.g., 1.2 for 1.2% APY) */
  interestRate: number;
}

/**
 * Snapshot of account state at a specific month in the simulation.
 * Used for generating the time-series chart visualization.
 */
export interface MonthData {
  /** Month number in the simulation (0-indexed, where 0 = starting month) */
  month: number;

  /** Total savings balance at the end of this month, including interest */
  balance: number;
}

/**
 * Complete result of the savings goal calculation.
 * Includes both the final outcome and time-series data for visualization.
 */
export interface CalculationResult {
  /**
   * Number of months required to reach the savings goal.
   * null if the goal is unattainable with current parameters.
   */
  monthsToGoal: number | null;

  /**
   * Month-by-month progression of savings balance.
   * Array of snapshots showing balance growth over time.
   * Used to render the Chart.js line graph.
   */
  monthlyData: MonthData[];
}

/**
 * Input parameters for the legacy simulateSavings API.
 */
export interface SimulationInputs {
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyAdditionalDeposit?: number;
  annualInterestRate?: number;
  targetSavings: number;
  startDate?: string;
}

/**
 * Monthly balance breakdown with optional date information.
 */
export interface MonthlyBreakdownItem {
  monthIndex: number;
  balance: number;
  date?: string;
  dateISO?: string;
}

/**
 * Result of the legacy simulateSavings function.
 */
export interface SimulationResult {
  monthsNeeded: number | 'Impossible';
  endDate?: string | null;
  totalContributions: number;
  totalInterestEarned: number;
  summary: string;
  monthlyBreakdown: MonthlyBreakdownItem[];
  impossible?: boolean;
}
