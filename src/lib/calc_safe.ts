import { calculateMonthsToGoal } from './calc';
import type {
  BudgetInputs,
  CalculationResult,
  MonthlyBreakdownItem,
} from './types';

/**
 * Safe wrapper around calculateMonthsToGoal that validates inputs before calculation.
 *
 * This function ensures all inputs are valid numbers and non-negative before
 * performing the savings calculation. It prevents errors and undefined behavior
 * from invalid user input.
 *
 * Input validation rules:
 * - All values must be valid numbers (not NaN, not Infinity)
 * - All values must be non-negative (>= 0)
 * - Interest rate must be non-negative
 *
 * @param inputs - User's financial parameters (same as calculateMonthsToGoal)
 * @returns Calculation result if inputs are valid, null if any input is invalid
 *
 * @example
 * ```typescript
 * // Valid inputs
 * const result = calculateMonthsToGoalSafe({
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
 * // Invalid inputs (negative values)
 * const result = calculateMonthsToGoalSafe({
 *   income: -5000,
 *   expenses: 3000,
 *   currentSavings: 10000,
 *   savingsGoal: 50000,
 *   interestRate: 1.2
 * });
 * // Returns: null
 * ```
 *
 * @example
 * // Invalid inputs (NaN values)
 * const result = calculateMonthsToGoalSafe({
 *   income: NaN,
 *   expenses: 3000,
 *   currentSavings: 10000,
 *   savingsGoal: 50000,
 *   interestRate: 1.2
 * });
 * // Returns: null
 * ```
 */
export function calculateMonthsToGoalSafe(
  inputs: BudgetInputs
): CalculationResult | null {
  const { income, expenses, currentSavings, savingsGoal, interestRate } =
    inputs;

  // Validate all inputs are valid numbers
  if (
    !Number.isFinite(income) ||
    !Number.isFinite(expenses) ||
    !Number.isFinite(currentSavings) ||
    !Number.isFinite(savingsGoal) ||
    !Number.isFinite(interestRate)
  ) {
    return null;
  }

  // Validate all inputs are non-negative
  if (
    income < 0 ||
    expenses < 0 ||
    currentSavings < 0 ||
    savingsGoal < 0 ||
    interestRate < 0
  ) {
    return null;
  }

  return calculateMonthsToGoal(inputs);
}

/**
 * Legacy wrapper for the deterministic savings simulation used in tests.
 * This provides a deterministic calculation with explicit rounding and month-by-month breakdown.
 *
 * @param inputs - Detailed simulation parameters
 * @returns Result with deterministic calculations
 */
export function simulateSavingsDeterministic(inputs: {
  currentSavings: number;
  monthlySurplus: number;
  annualInterestPercent: number;
  targetAmount: number;
  maxMonths?: number;
  startDateISO?: string;
}): {
  monthsNeeded: number | 'Impossible';
  finalBalance: number;
  totalInterestEarned: number;
  monthlyBreakdown: MonthlyBreakdownItem[];
} {
  const {
    currentSavings,
    monthlySurplus,
    annualInterestPercent,
    targetAmount,
    maxMonths = 10000,
    startDateISO,
  } = inputs;

  // Early return if already at goal
  if (currentSavings >= targetAmount) {
    return {
      monthsNeeded: 0,
      finalBalance: currentSavings,
      totalInterestEarned: 0,
      monthlyBreakdown: [
        {
          monthIndex: 0,
          balance: currentSavings,
          dateISO: startDateISO,
        },
      ],
    };
  }

  const monthlyInterestRate = annualInterestPercent / 100 / 12;
  let balance = currentSavings;
  let month = 0;
  const monthlyBreakdown: MonthlyBreakdownItem[] = [];
  let totalInterestEarned = 0;

  // Early check: if monthlySurplus is negative, goal is impossible
  if (monthlySurplus < 0) {
    return {
      monthsNeeded: 'Impossible',
      finalBalance: balance,
      totalInterestEarned: 0,
      monthlyBreakdown: [],
    };
  }

  // Simulate month by month
  while (balance < targetAmount && month < maxMonths) {
    balance += monthlySurplus;
    const interest = Math.round(balance * monthlyInterestRate * 100) / 100;
    balance += interest;
    balance = Math.round(balance * 100) / 100;
    totalInterestEarned += interest;

    month++;

    const breakdownItem: MonthlyBreakdownItem = {
      monthIndex: month,
      balance,
    };

    if (startDateISO) {
      const date = new Date(startDateISO);
      date.setMonth(date.getMonth() + month);
      breakdownItem.dateISO = date.toISOString();
      breakdownItem.date = date.toISOString().split('T')[0];
    }

    monthlyBreakdown.push(breakdownItem);

    // Check for stagnation
    if (
      month > 1 &&
      monthlyBreakdown[month - 1].balance ===
        monthlyBreakdown[month - 2].balance
    ) {
      return {
        monthsNeeded: 'Impossible',
        finalBalance: balance,
        totalInterestEarned,
        monthlyBreakdown,
      };
    }
  }

  // If we hit maxMonths, return Impossible with breakdown
  if (balance < targetAmount) {
    return {
      monthsNeeded: 'Impossible',
      finalBalance: balance,
      totalInterestEarned,
      monthlyBreakdown,
    };
  }

  return {
    monthsNeeded: month,
    finalBalance: balance,
    totalInterestEarned,
    monthlyBreakdown,
  };
}
