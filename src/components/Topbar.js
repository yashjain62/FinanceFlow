import React from 'react';
import { useApp } from '../context/AppContext';
import './Topbar.css';

const PAGE_TITLES = {
  dashboard:    'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
};

export default function Topbar({ onHamburger, onAddTx }) {
  const { activePage, role, theme, toggleTheme } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onHamburger} aria-label="Menu">
          <span /><span /><span />
        </button>
        <h1 className="topbar-title">{PAGE_TITLES[activePage] || 'FinFlow'}</h1>
      </div>
      <div className="topbar-actions">
        {role === 'viewer' && <span className="viewer-notice">View only mode</span>}
        {role === 'admin' && (
          <button className="btn btn-accent" onClick={onAddTx}>+ Add Transaction</button>
        )}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☾' : '☀'}
        </button>
      </div>
    </header>
  );
}
