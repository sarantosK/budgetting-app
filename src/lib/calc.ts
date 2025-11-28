import type {
  BudgetInputs,
  CalculationResult,
  MonthData,
  SimulationInputs,
  SimulationResult,
} from './types';
import { MAX_SIMULATION_MONTHS } from './constants';

// Re-export for external use
export type { SimulationResult };

/**
 * Calculates the number of months needed to reach a savings goal with compound interest.
 *
 * This function simulates month-by-month savings growth, accounting for:
 * - Monthly surplus (income minus expenses)
 * - Compound interest applied monthly
 * - Starting balance
 *
 * The simulation uses deterministic rounding to cent precision to match real-world
 * banking calculations and prevent floating-point accumulation errors.
 *
 * @param inputs - User's financial parameters
 * @param inputs.income - Monthly gross income
 * @param inputs.expenses - Monthly total expenses
 * @param inputs.currentSavings - Starting savings balance
 * @param inputs.savingsGoal - Target savings amount to reach
 * @param inputs.interestRate - Annual interest rate as percentage (e.g., 1.2 for 1.2%)
 *
 * @returns Calculation result containing months to goal and monthly progression data
 * @returns {number | null} monthsToGoal - Months needed, or null if unattainable
 * @returns {MonthData[]} monthlyData - Month-by-month balance snapshots for charting
 *
 * @example
 * ```typescript
 * const result = calculateMonthsToGoal({
 *   income: 5000,
 *   expenses: 3000,
 *   currentSavings: 10000,
 *   savingsGoal: 50000,
 *   interestRate: 1.2
 * });
 * // Returns: { monthsToGoal: 20, monthlyData: [...] }
 * ```
 *
 * @example
 * // Edge case: Already at goal
 * const result = calculateMonthsToGoal({
 *   income: 5000,
 *   expenses: 3000,
 *   currentSavings: 50000,
 *   savingsGoal: 50000,
 *   interestRate: 1.2
 * });
 * // Returns: { monthsToGoal: 0, monthlyData: [{ month: 0, balance: 50000 }] }
 *
 * @example
 * // Edge case: No surplus, no progress possible
 * const result = calculateMonthsToGoal({
 *   income: 3000,
 *   expenses: 3000,
 *   currentSavings: 1000,
 *   savingsGoal: 50000,
 *   interestRate: 0
 * });
 * // Returns: { monthsToGoal: null, monthlyData: [] }
 */
export function calculateMonthsToGoal(inputs: BudgetInputs): CalculationResult {
  const { income, expenses, currentSavings, savingsGoal, interestRate } =
    inputs;

  // Net amount saved each month after expenses
  const netMonthlySavings = income - expenses;

  // Convert annual interest rate to monthly decimal (e.g., 1.2% → 0.012 → 0.001)
  const monthlyInterestRate = interestRate / 100 / 12;

  // Early return: Already at or above the goal
  if (currentSavings >= savingsGoal) {
    return {
      monthsToGoal: 0,
      monthlyData: [{ month: 0, balance: currentSavings }],
    };
  }

  /* Edge case handling for scenarios with no progress:
   * - No monthly surplus AND no interest: Balance never grows
   * - Negative net savings: Balance decreases over time
   * - Zero interest with insufficient starting balance: Linear growth won't reach goal
   *
   * In these cases, return null to indicate the goal is unattainable.
   */
  if (netMonthlySavings <= 0 && monthlyInterestRate === 0) {
    return { monthsToGoal: null, monthlyData: [] };
  }

  if (netMonthlySavings < 0) {
    return { monthsToGoal: null, monthlyData: [] };
  }

  let balance = currentSavings;
  let month = 0;
  const monthlyData: MonthData[] = [];

  /* Month-by-month simulation loop:
   * Each iteration represents one month of savings growth.
   *
   * The loop continues until either:
   * 1. Balance reaches or exceeds the goal (success)
   * 2. MAX_SIMULATION_MONTHS is reached (unattainable goal)
   *
   * Order of operations each month:
   * 1. Add monthly surplus to balance
   * 2. Calculate and add interest on new balance
   * 3. Round to cent precision for deterministic calculations
   * 4. Record balance snapshot for chart visualization
   * 5. Check if goal is reached
   */
  while (balance < savingsGoal && month < MAX_SIMULATION_MONTHS) {
    balance += netMonthlySavings;
    // Apply compound interest: balance × (1 + monthly rate)
    balance += balance * monthlyInterestRate;
    // Round to 2 decimal places (cents) for deterministic calculations
    balance = Math.round(balance * 100) / 100;

    month++;
    monthlyData.push({ month, balance });

    /* Safety break conditions to prevent infinite loops:
     *
     * 1. Check if balance stopped growing (stuck in steady state)
     * 2. Verify we haven't exceeded reasonable timeframe (MAX_SIMULATION_MONTHS)
     *
     * This catches edge cases where mathematical convergence fails or
     * the goal is practically unattainable (e.g., $1B goal with $10/month surplus).
     */
    if (
      month > 1 &&
      monthlyData[month - 1].balance === monthlyData[month - 2].balance
    ) {
      return { monthsToGoal: null, monthlyData };
    }
  }

  // If loop exited due to reaching MAX_MONTHS, goal is unattainable
  if (month >= MAX_SIMULATION_MONTHS) {
    return { monthsToGoal: null, monthlyData };
  }

  return { monthsToGoal: month, monthlyData };
}

/**
 * Legacy wrapper function for backwards compatibility with existing UI code.
 * Adapts the old simulateSavings API to the new calculateMonthsToGoal implementation.
 *
 * @param inputs - Simulation parameters with legacy field names
 * @returns Simulation result with legacy format
 */
export function simulateSavings(inputs: SimulationInputs): SimulationResult {
  // Validate inputs
  const {
    currentSavings,
    monthlyIncome,
    monthlyExpenses,
    monthlyAdditionalDeposit = 0,
    annualInterestRate = 0,
    targetSavings,
    startDate,
  } = inputs;

  // Check for negative values
  if (
    currentSavings < 0 ||
    monthlyIncome < 0 ||
    monthlyExpenses < 0 ||
    monthlyAdditionalDeposit < 0 ||
    annualInterestRate < 0 ||
    targetSavings < 0
  ) {
    throw new Error('All input values must be non-negative');
  }

  // Calculate total monthly surplus
  const monthlySurplus =
    monthlyIncome - monthlyExpenses + monthlyAdditionalDeposit;

  // Convert to new API format
  const budgetInputs: BudgetInputs = {
    income: monthlyIncome + monthlyAdditionalDeposit,
    expenses: monthlyExpenses,
    currentSavings,
    savingsGoal: targetSavings,
    interestRate: annualInterestRate,
  };

  // Call the core calculation function
  const result = calculateMonthsToGoal(budgetInputs);

  // Convert result to legacy format
  const monthlyBreakdown = result.monthlyData.map((data) => {
    const item: {
      monthIndex: number;
      balance: number;
      date?: string;
      dateISO?: string;
    } = {
      monthIndex: data.month,
      balance: data.balance,
    };

    // Add date information if startDate was provided
    if (startDate) {
      // Parse as local date to avoid timezone issues
      const [year, month, day] = startDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setMonth(date.getMonth() + data.month);
      item.dateISO = date.toISOString();
      item.date = date.toISOString().split('T')[0];
    }

    return item;
  });

  // Calculate total contributions and interest
  const monthsNeeded = result.monthsToGoal ?? 0;
  const totalContributions = monthlySurplus * monthsNeeded;
  const finalBalance =
    monthlyBreakdown.length > 0
      ? monthlyBreakdown[monthlyBreakdown.length - 1].balance
      : currentSavings;
  const totalInterestEarned =
    finalBalance - currentSavings - totalContributions;

  // Calculate end date if start date provided
  let endDate: string | null = null;
  if (startDate && result.monthsToGoal !== null) {
    const [year, month, day] = startDate.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCMonth(date.getUTCMonth() + result.monthsToGoal);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    endDate = `${y}-${m}-${d}`;
  }

  // Generate summary message
  const impossible = result.monthsToGoal === null;
  let summary: string;
  if (impossible) {
    summary = 'Goal is impossible to reach with current parameters';
  } else if (result.monthsToGoal === 0) {
    summary = 'You have already reached your savings goal!';
  } else {
    summary = `You will reach your goal in ${result.monthsToGoal} months`;
    if (endDate) {
      summary += ` (by ${endDate})`;
    }
  }

  return {
    monthsNeeded: impossible ? 'Impossible' : monthsNeeded,
    endDate,
    totalContributions,
    totalInterestEarned,
    summary,
    monthlyBreakdown,
    impossible,
  };
}
