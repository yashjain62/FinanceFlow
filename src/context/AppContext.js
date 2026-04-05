import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { SEED_TRANSACTIONS } from '../data/transactions';

const STORAGE_KEY = 'finflow_transactions';
const THEME_KEY   = 'finflow_theme';

/* ── State Shape ──────────────────────────────────────────────────── */
function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [...SEED_TRANSACTIONS];
  } catch { return [...SEED_TRANSACTIONS]; }
}

/* ── Reducer ──────────────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TX': {
      const newId = Math.max(0, ...state.map(t => t.id)) + 1;
      return [{ ...action.payload, id: newId }, ...state];
    }
    case 'EDIT_TX':
      return state.map(t => t.id === action.payload.id ? action.payload : t);
    case 'DELETE_TX':
      return state.filter(t => t.id !== action.id);
    case 'RESET':
      return [...SEED_TRANSACTIONS];
    default:
      return state;
  }
}

/* ── Context ──────────────────────────────────────────────────────── */
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, dispatch] = useReducer(reducer, null, loadTransactions);
  const [role, setRole]         = useState('admin');
  const [theme, setTheme]       = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; }
  });
  const [activePage, setActivePage] = useState('dashboard');
  const [toast, setToast]           = useState(null);

  // Persist transactions
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  // Persist & apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : '';
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const showToast = useCallback((msg, icon = '✓') => {
    setToast({ msg, icon, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const toggleTheme = useCallback(() =>
    setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  const addTransaction    = useCallback(tx => { dispatch({ type: 'ADD_TX',    payload: tx }); showToast('Transaction added', '✓'); }, [showToast]);
  const editTransaction   = useCallback(tx => { dispatch({ type: 'EDIT_TX',   payload: tx }); showToast('Transaction updated', '✎'); }, [showToast]);
  const deleteTransaction = useCallback(id => { dispatch({ type: 'DELETE_TX', id });           showToast('Transaction deleted', '✕'); }, [showToast]);

  return (
    <AppContext.Provider value={{
      transactions, role, setRole, theme, toggleTheme,
      activePage, setActivePage,
      addTransaction, editTransaction, deleteTransaction,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
