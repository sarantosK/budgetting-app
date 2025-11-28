import { useBalance } from '../contexts/BalanceContext';

const YourMainBalancePage: React.FC = () => {
  const { setCurrentBalance, setMonthlyIncome } = useBalance();
  
  // When you calculate or input the balance:
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentBalance(Number(e.target.value));
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyIncome(Number(e.target.value));
  };

  return (
    <div>
      <h1>Home Page</h1>
      <input type="number" onChange={handleBalanceChange} />
      <input type="number" onChange={handleIncomeChange} />
    </div>
  );
};

export default YourMainBalancePage;