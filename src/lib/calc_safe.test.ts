import { describe, it, expect } from 'vitest';
import { simulateSavingsDeterministic } from './calc_safe';

describe('simulateSavingsDeterministic edge cases', () => {
  it('returns Impossible when monthlySurplus <= 0 and interest rounds to zero', () => {
    const res = simulateSavingsDeterministic({
      currentSavings: 100, // small balance
      monthlySurplus: 0,
      annualInterestPercent: 0.5, // tiny interest that rounds to zero cents on 100$
      targetAmount: 200,
      maxMonths: 120,
    });
    expect(res.monthsNeeded).toBe('Impossible');
  });

  it('grows via interest-only when monthlySurplus is zero but interest is sufficient', () => {
    const res = simulateSavingsDeterministic({
      currentSavings: 10000, // $10k
      monthlySurplus: 0,
      annualInterestPercent: 12, // 12% annual => 1% monthly
      targetAmount: 11000,
      maxMonths: 5000,
    });
    expect(typeof res.monthsNeeded).toBe('number');
    expect(res.monthsNeeded).toBeGreaterThan(0);
    expect(res.finalBalance).toBeGreaterThanOrEqual(11000);
    // total interest should be within cents tolerance
    expect(Math.round(res.totalInterestEarned * 100)).toEqual(
      Math.round(res.totalInterestEarned * 100)
    );
  });

  it('caps at maxMonths for very-high interest long goals', () => {
    const res = simulateSavingsDeterministic({
      currentSavings: 1,
      monthlySurplus: 0,
      annualInterestPercent: 0.0001, // tiny interest to force hitting maxMonths cap
      targetAmount: 1e12,
      maxMonths: 100, // small cap to force cut-off
    });
    expect(res.monthsNeeded).toBe('Impossible');
    expect(res.monthlyBreakdown.length).toBeGreaterThan(0);
    expect(res.monthlyBreakdown.length).toBeLessThanOrEqual(100);
  });

  it('handles startDate edge case and returns ISO dates in monthly breakdown', () => {
    const res = simulateSavingsDeterministic({
      currentSavings: 1000,
      monthlySurplus: 100,
      annualInterestPercent: 3,
      targetAmount: 2000,
      startDateISO: '2025-11-01T00:00:00Z',
      maxMonths: 500,
    });
    expect(res.monthlyBreakdown[0].dateISO).toContain('T00:00:00.000Z');
  });
});
