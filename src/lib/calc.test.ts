import { describe, it, expect } from 'vitest';
import { simulateSavings } from './calc';

describe('simulateSavings', () => {
  it('sample case reaches target in expected months', () => {
    const res = simulateSavings({
      currentSavings: 2000,
      monthlyIncome: 3500,
      monthlyExpenses: 2700,
      monthlyAdditionalDeposit: 200,
      annualInterestRate: 1.2,
      targetSavings: 10000,
      startDate: '2025-01-01',
    });
    expect(res.monthsNeeded).toBe(8);
    expect(res.endDate).toBe('2025-09-01');
  });

  it('returns monthsNeeded 0 when target <= current', () => {
    const res = simulateSavings({
      currentSavings: 10000,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      targetSavings: 5000,
    });
    expect(res.monthsNeeded).toBe(0);
  });

  it('throws for negative inputs', () => {
    expect(() =>
      simulateSavings({
        currentSavings: -1,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        targetSavings: 100,
      })
    ).toThrow();
  });

  it('reports impossible when no surplus and no interest', () => {
    const res = simulateSavings({
      currentSavings: 1000,
      monthlyIncome: 1000,
      monthlyExpenses: 1000,
      targetSavings: 2000,
    });
    expect(res.impossible).toBe(true);
  });
});
