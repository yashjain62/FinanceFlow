import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import TransactionModal from './components/TransactionModal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import './App.css';

function AppShell() {
  const { activePage, role } = useApp();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [showModal,   setShowModal]     = useState(false);

  const openModal  = () => { if (role === 'admin') setShowModal(true); };
  const closeModal = () => setShowModal(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Topbar
          onHamburger={() => setSidebarOpen(o => !o)}
          onAddTx={openModal}
        />

        <div className="app-content">
          {activePage === 'dashboard'    && <Dashboard    onAddTx={openModal} />}
          {activePage === 'transactions' && <Transactions onAddTx={openModal} />}
          {activePage === 'insights'     && <Insights />}
        </div>
      </div>

      {showModal && <TransactionModal editTx={null} onClose={closeModal} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
