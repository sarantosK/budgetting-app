import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="nav">
      {/* Current Balance */}
      <NavLink
        to="/current"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon" aria-hidden>
          💼
        </span>
        <span>Current Balance</span>
      </NavLink>

      {/* Savings Goal */}
      <NavLink
        to="/savings-goal"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon" aria-hidden>
          🎯
        </span>
        <span>Savings Goal</span>
      </NavLink>

      {/* Future Balance Goal */}
      <NavLink
        to="/future-balance-goal"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon" aria-hidden>
          📈
        </span>
        <span>Future Balance Goal</span>
      </NavLink>
    </nav>
  );
}
