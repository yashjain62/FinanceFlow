import React from 'react';
import { useApp } from '../context/AppContext';
import { exportCSV } from '../utils';
import './Sidebar.css';

const NAV = [
  { id: 'dashboard',    icon: '◈', label: 'Overview' },
  { id: 'transactions', icon: '⇄', label: 'Transactions' },
  { id: 'insights',     icon: '◉', label: 'Insights' },
];

export default function Sidebar({ open, onClose }) {
  const { activePage, setActivePage, role, setRole, transactions, showToast } = useApp();

  const navigate = id => { setActivePage(id); onClose(); };

  const handleExport = () => { exportCSV(transactions); showToast('CSV exported', '↓'); onClose(); };

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">F</div>
          <span className="logo-text">FinanceFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${activePage === n.id ? 'active' : ''}`}
              onClick={() => navigate(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {activePage === n.id && <span className="nav-dot" />}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 20 }}>Account</div>
          <button className="nav-item" onClick={() => { showToast('Settings coming soon', '⚙️'); onClose(); }}>
            <span className="nav-icon">◎</span><span>Settings</span>
          </button>
          <button className="nav-item" onClick={handleExport}>
            <span className="nav-icon">↓</span><span>Export CSV</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="role-label">Active Role</div>
          <div className="role-switcher">
            <button
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >Admin</button>
            <button
              className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
              onClick={() => setRole('viewer')}
            >Viewer</button>
          </div>
          <div className="role-badge-wrap">
            <span className={`role-badge ${role}`}>
              {role === 'admin' ? '◈ Admin Access' : '◎ Viewer Access'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
