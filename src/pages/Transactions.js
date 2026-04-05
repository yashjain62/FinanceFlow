import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CAT_COLORS, CAT_ICONS } from '../data/transactions';
import { fmtFull, fmtDate } from '../utils';
import TransactionModal from '../components/TransactionModal';
import './Transactions.css';
import '../App.css';

const PER_PAGE = 10;

function sortList(list, sortBy) {
  return [...list].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc')  return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc')  return a.amount - b.amount;
    if (sortBy === 'name')     return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });
}

export default function Transactions({ onAddTx }) {
  const { transactions, role, deleteTransaction } = useApp();
  const [search,  setSearch]  = useState('');
  const [typeF,   setTypeF]   = useState('all');
  const [catF,    setCatF]    = useState('all');
  const [sortBy,  setSortBy]  = useState('date-desc');
  const [page,    setPage]    = useState(1);
  const [editTx,  setEditTx]  = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = useMemo(() =>
    [...new Set(transactions.map(t => t.category))].sort(), [transactions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sortList(
      transactions.filter(t => {
        if (q && !t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
        if (typeF !== 'all' && t.type !== typeF) return false;
        if (catF  !== 'all' && t.category !== catF) return false;
        return true;
      }),
      sortBy
    );
  }, [transactions, search, typeF, catF, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage   = Math.min(page, totalPages);
  const slice      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleSearch  = e => { setSearch(e.target.value); setPage(1); };
  const handleTypeF   = e => { setTypeF(e.target.value); setPage(1); };
  const handleCatF    = e => { setCatF(e.target.value); setPage(1); };
  const handleSort    = e => { setSortBy(e.target.value); setPage(1); };

  const openEdit = tx => { setEditTx(tx); setShowModal(true); };
  const openAdd  = () => { setEditTx(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTx(null); };

  const handleDelete = useCallback(id => {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id);
  }, [deleteTransaction]);

  return (
    <div className="transactions page-anim">
      <div className="section-header">
        <h2 className="section-title">All Transactions</h2>
        {role === 'admin' && (
          <button className="btn btn-accent" onClick={openAdd}>+ Add Transaction</button>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          className="search-box"
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={handleSearch}
        />
        <select className="filter-select" value={typeF} onChange={handleTypeF}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-select" value={catF} onChange={handleCatF}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={sortBy} onChange={handleSort}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
          <option value="name">Name A–Z</option>
          <option value="category">Category A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
        {slice.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Try adjusting your filters{role === 'admin' ? ' or add a new transaction' : ''}.</p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th onClick={() => setSortBy('name')} className="sortable">Transaction ↕</th>
                <th onClick={() => setSortBy('category')} className="sortable">Category ↕</th>
                <th onClick={() => setSortBy('date-desc')} className="sortable">Date ↕</th>
                <th style={{ textAlign: 'right' }} onClick={() => setSortBy('amount-desc')} className="sortable">Amount ↕</th>
                {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {slice.map(t => (
                <tr key={t.id} className="tx-row">
                  <td>
                    <div className="tx-info">
                      <div className="tx-icon" style={{ background: (CAT_COLORS[t.category] || '#888') + '22' }}>
                        {CAT_ICONS[t.category] || '◈'}
                      </div>
                      <div>
                        <div className="tx-name">{t.name}</div>
                        <div className="tx-date">{fmtDate(t.date)}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="cat-badge">{t.category}</span></td>
                  <td className="tx-date-cell">{fmtDate(t.date)}</td>
                  <td style={{ textAlign: 'right' }} className={t.type === 'income' ? 'amount-pos' : 'amount-neg'}>
                    {t.type === 'income' ? '+' : '-'}{fmtFull(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td style={{ textAlign: 'right' }}>
                      <div className="tx-actions">
                        <button className="tx-action-btn" onClick={() => openEdit(t)} title="Edit">✎</button>
                        <button
                          className="tx-action-btn delete"
                          onClick={() => handleDelete(t.id)}
                          title="Delete"
                        >✕</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          {filtered.length === 0
            ? 'No results'
            : `Showing ${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filtered.length)} of ${filtered.length}`}
        </div>
        <div className="pagination-btns">
          <button className="page-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${p === safePage ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      </div>

      {showModal && <TransactionModal editTx={editTx} onClose={closeModal} />}
    </div>
  );
}
