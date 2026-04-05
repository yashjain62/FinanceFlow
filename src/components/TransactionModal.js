import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';
import { today } from '../utils';
import './TransactionModal.css';

export default function TransactionModal({ editTx, onClose }) {
  const { addTransaction, editTransaction } = useApp();

  const [type,     setType]     = useState(editTx?.type     || 'expense');
  const [name,     setName]     = useState(editTx?.name     || '');
  const [amount,   setAmount]   = useState(editTx?.amount   || '');
  const [date,     setDate]     = useState(editTx?.date     || today());
  const [category, setCategory] = useState(editTx?.category || 'Food & Dining');
  const [error,    setError]    = useState('');

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (!name.trim()) { setError('Please enter a description.'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setError('Please enter a valid amount.'); return; }
    if (!date) { setError('Please select a date.'); return; }

    const tx = { name: name.trim(), amount: amt, type, date, category };
    if (editTx) editTransaction({ ...editTx, ...tx });
    else addTransaction(tx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{editTx ? 'Edit Transaction' : 'Add Transaction'}</h2>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <button
              className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
              onClick={() => setType('expense')}
            >Expense</button>
            <button
              className={`type-btn income ${type === 'income' ? 'active' : ''}`}
              onClick={() => setType('income')}
            >Income</button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Netflix subscription"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={handleSubmit}>
            {editTx ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
