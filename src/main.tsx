import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BalanceProvider } from './contexts/BalanceContext';
import MainApp from './MainApp';
import './styles/premium.css'; // now a light theme

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BalanceProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </BalanceProvider>
  </React.StrictMode>,
);
