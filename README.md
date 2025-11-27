# Budgetting App

Simple single-page React + TypeScript app to estimate months to reach a savings target.

Features
- Validate inputs and simulate month-by-month compounding
- Return months needed, end date, monthly breakdown, total contributions, interest earned and a readable summary
- Live "what-if" adjustments and a balance-over-time chart

Quick start (Windows PowerShell):

```powershell
cd 'c:\Users\Sarados\OneDrive\Υπολογιστής\Projects\budgetting-app'
# install deps
npm install

# run dev server
npm run dev

# run tests
npm run test
```

Sample test inputs
- Example from the spec (in `src/lib/calc.test.ts`):
	- `currentSavings=2000`
	- `monthlyIncome=3500`
	- `monthlyExpenses=2700`
	- `monthlyAdditionalDeposit=200`
	- `annualInterestRate=1.2`
	- `targetSavings=10000`
	- `startDate=2025-01-01`

Expected (unit test): `monthsNeeded === 8`, `endDate === 2025-09-01`.

Notes
- The calculation module is `src/lib/calc.ts` and is fully covered by unit tests using Vitest.
- If you want a production build: `npm run build` then `npm run preview` to locally preview the built app.

