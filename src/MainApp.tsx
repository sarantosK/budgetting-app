import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CurrentBalancePage from './pages/CurrentBalancePage';
import SavingsGoalPage from './pages/SavingsGoalPage';
import FutureBalanceGoalPage from './pages/FutureBalanceGoalPage';
import './styles/premium.css';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

export default function MainApp() {
  return (
    <CurrencyProvider>
      <div className="app-shell">
        {/* Top header */}
        <Header />

        {/* Top navigation bar (refactored Sidebar) */}
        <div className="nav-shell">
          <Sidebar />
        </div>

        {/* Main routed content */}
        <main className="main-content">
          <div className="content">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Navigate to="/current" replace />} />
                <Route path="/current" element={<CurrentBalancePage />} />
                <Route path="/savings-goal" element={<SavingsGoalPage />} />
                <Route path="/future-balance-goal" element={<FutureBalanceGoalPage />} />
                <Route path="*" element={<Navigate to="/current" replace />} />
              </Routes>
            </PageTransition>
          </div>
        </main>
      </div>
    </CurrencyProvider>
  );
}
