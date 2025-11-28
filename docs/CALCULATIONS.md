# Calculation Algorithm Documentation

## Overview

The savings simulation algorithm models month-by-month savings growth with compound interest. It provides a realistic projection of how long it takes to reach a financial goal given consistent income, expenses, and interest rates.

## Core Algorithm

### Month-by-Month Simulation

The calculation follows these steps for each month:

1. **Add Monthly Surplus**: `balance += (income - expenses)`
2. **Apply Compound Interest**: `balance += balance × (interestRate / 100 / 12)`
3. **Round to Cents**: `balance = Math.round(balance × 100) / 100`
4. **Record Snapshot**: Store month number and balance for charting
5. **Check Goal**: If `balance >= savingsGoal`, return month count

### Example of Rounding Impact

**Without Rounding:**
```
balance = 100.00
```

**With Rounding:**
```
balance = 100.00
```

### Pseudocode

