import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  currentBalance: number;
  setCurrentBalance: (balance: number) => void;
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  return (
    <BalanceContext.Provider
      value={{
        currentBalance,
        setCurrentBalance,
        monthlyIncome,
        setMonthlyIncome,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
