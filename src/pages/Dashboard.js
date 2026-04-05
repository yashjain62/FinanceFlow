import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { computeSummary, computeCategoryTotals, fmt, fmtFull, fmtDate } from '../utils';
import { CAT_COLORS, CAT_ICONS } from '../data/transactions';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const TREND_DATA = {
  '3m': {
    labels: ['Apr', 'May', 'Jun'],
    income:   [6150, 5850, 5720],
    expenses: [2250, 2610, 2490],
  },
  '6m': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income:   [6400, 5540, 6000, 6150, 5850, 5720],
    expenses: [2730, 2480, 3790, 2250, 2610, 2490],
  },
  '1y': {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    income:   [6400,5540,6000,6150,5850,5720,6100,5980,6300,6050,5900,6400],
    expenses: [2730,2480,3790,2250,2610,2490,2700,2580,2900,2400,2700,3100],
  },
};

function SummaryCard({ label, value, change, changeType, accentColor, icon }) {
  return (
    <div className="summary-card" style={{ '--accent-color': accentColor }}>
      <div className="card-icon">{icon}</div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      <div className={`card-change ${changeType}`}>{change}</div>
    </div>
  );
}

export default function Dashboard({ onAddTx }) {
  const { transactions, setActivePage, theme } = useApp();
  const [period, setPeriod] = useState('6m');

  const { income, expenses, balance, rate } = useMemo(() => computeSummary(transactions), [transactions]);
  const catTotals = useMemo(() => computeCategoryTotals(transactions), [transactions]);
  const recent    = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [transactions]
  );

  const isDark = theme === 'dark';
  const grid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tick = isDark ? '#8a8fa0' : '#6b7080';
  const cardBg = isDark ? '#181c26' : '#ffffff';

  /* ── Trend chart ── */
  const trendData = TREND_DATA[period];
  const lineData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Income',
        data: trendData.income,
        borderColor: '#3ecf8e',
        backgroundColor: 'rgba(62,207,142,0.1)',
        fill: true, tension: 0.4,
        pointBackgroundColor: '#3ecf8e',
        pointRadius: 4, pointHoverRadius: 6, borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: trendData.expenses,
        borderColor: '#f5566a',
        backgroundColor: 'rgba(245,86,106,0.08)',
        fill: true, tension: 0.4,
        pointBackgroundColor: '#f5566a',
        pointRadius: 4, pointHoverRadius: 6, borderWidth: 2,
      },
    ],
  };
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { color: grid }, ticks: { color: tick, font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: grid }, ticks: { color: tick, font: { family: 'DM Sans', size: 11 }, callback: v => '$' + (v/1000).toFixed(0) + 'k' } },
    },
  };

  /* ── Donut chart ── */
  const top5 = catTotals.slice(0, 5);
  const donutTotal = top5.reduce((a, [, v]) => a + v, 0);
  const donutData = {
    labels: top5.map(([k]) => k),
    datasets: [{
      data: top5.map(([, v]) => v),
      backgroundColor: top5.map(([k]) => CAT_COLORS[k] || '#8a8fa0'),
      borderWidth: 2,
      borderColor: cardBg,
      hoverOffset: 4,
    }],
  };
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '68%',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.parsed) } } },
  };

  return (
    <div className="dashboard page-anim">
      {/* Summary cards */}
      <div className="summary-grid">
        <SummaryCard label="Total Balance"  value={fmt(balance)}  change="↑ 4.2% from last month"  changeType="change-up"   accentColor="var(--accent)"  icon="⬡" />
        <SummaryCard label="Total Income"   value={fmt(income)}   change="↑ 8.5% from last month"  changeType="change-up"   accentColor="var(--green)"   icon="↑" />
        <SummaryCard label="Total Expenses" value={fmt(expenses)} change="↓ 2.1% more spent"        changeType="change-down" accentColor="var(--red)"     icon="↓" />
        <SummaryCard label="Savings Rate"   value={rate + '%'}    change="↑ On track this month"    changeType="change-up"   accentColor="var(--accent2)" icon="◈" />
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Balance Trend</div>
              <div className="chart-subtitle">Income vs Expenses over time</div>
            </div>
            <div className="period-tabs">
              {['3m','6m','1y'].map(p => (
                <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: '#3ecf8e' }} />Income</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#f5566a' }} />Expenses</div>
          </div>
          <div className="chart-canvas-wrap" style={{ height: 220 }}>
            <Line data={lineData} options={lineOpts} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Spending</div>
              <div className="chart-subtitle">By category</div>
            </div>
          </div>
          <div className="chart-canvas-wrap" style={{ height: 160 }}>
            <Doughnut data={donutData} options={donutOpts} />
          </div>
          <div className="donut-legend">
            {top5.map(([k, v]) => (
              <div className="donut-legend-item" key={k}>
                <div className="donut-legend-left">
                  <div className="donut-legend-bar" style={{ background: CAT_COLORS[k] || '#8a8fa0' }} />
                  <span>{k}</span>
                </div>
                <div className="donut-legend-right">
                  <span className="donut-legend-pct">{donutTotal > 0 ? Math.round(v / donutTotal * 100) : 0}%</span>
                  <span className="donut-legend-val">{fmt(v)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="chart-card">
        <div className="section-header">
          <div className="chart-title">Recent Transactions</div>
          <button className="btn" onClick={() => setActivePage('transactions')}>View All →</button>
        </div>
        <table className="tx-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(t => (
              <tr key={t.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
