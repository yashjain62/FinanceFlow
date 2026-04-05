import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { computeSummary, computeCategoryTotals, computeMonthlyData, fmt, fmtFull, fmtDate } from '../utils';
import { CAT_COLORS, CAT_ICONS } from '../data/transactions';
import './Insights.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function InsightCard({ icon, label, value, desc, children }) {
  return (
    <div className="insight-card">
      <div className="insight-icon">{icon}</div>
      <div className="insight-label">{label}</div>
      <div className="insight-value">{value}</div>
      {desc && <div className="insight-desc">{desc}</div>}
      {children}
    </div>
  );
}

export default function Insights() {
  const { transactions, theme } = useApp();

  const { income, expenses, rate } = useMemo(() => computeSummary(transactions), [transactions]);
  const catTotals = useMemo(() => computeCategoryTotals(transactions), [transactions]);
  const monthly   = useMemo(() => computeMonthlyData(transactions), [transactions]);

  const isDark = theme === 'dark';
  const grid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const tick = isDark ? '#8a8fa0' : '#6b7080';

  /* top category */
  const [topCat, topVal] = catTotals[0] || ['—', 0];
  const topPct = expenses > 0 ? Math.round((topVal / expenses) * 100) : 0;

  /* largest transaction */
  const largest = [...transactions].sort((a, b) => b.amount - a.amount)[0];

  /* savings advice */
  const savingsAdvice =
    rate >= 20 ? 'Excellent! Well above the recommended 20% savings threshold.' :
    rate >= 10 ? 'Good progress. Aim for 20% to build a stronger cushion.' :
    'Consider trimming expenses to improve your savings rate.';

  /* monthly income vs expense avg */
  const activeMonths = monthly.income.filter(v => v > 0).length || 1;
  const avgInc = Math.round(monthly.income.reduce((a, v) => a + v, 0) / activeMonths);
  const avgExp = Math.round(monthly.expenses.reduce((a, v) => a + v, 0) / activeMonths);

  /* bar chart */
  const barData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Income',
        data: monthly.income,
        backgroundColor: 'rgba(62,207,142,0.75)',
        borderRadius: 5,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: monthly.expenses,
        backgroundColor: 'rgba(245,86,106,0.75)',
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.parsed.y) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: tick, font: { family: 'DM Sans', size: 11 } } },
      y: {
        grid: { color: grid },
        ticks: { color: tick, font: { family: 'DM Sans', size: 11 }, callback: v => '$' + (v / 1000).toFixed(0) + 'k' },
      },
    },
  };

  const maxCat = catTotals[0] ? catTotals[0][1] : 1;

  return (
    <div className="insights page-anim">
      <h2 className="section-title" style={{ marginBottom: 24 }}>Financial Insights</h2>

      {/* KPI Cards */}
      <div className="insights-grid">
        <InsightCard
          icon="🏆"
          label="Top Spending Category"
          value={topCat}
          desc={`${fmt(topVal)} spent — ${topPct}% of total expenses`}
        />
        <InsightCard
          icon="📊"
          label="Savings Rate"
          value={rate + '%'}
          desc={savingsAdvice}
        >
          <div className="savings-bar-wrap">
            <div className="savings-bar-bg">
              <div
                className="savings-bar-fill"
                style={{
                  width: `${Math.min(rate, 100)}%`,
                  background: rate >= 20 ? 'var(--green)' : rate >= 10 ? 'var(--amber)' : 'var(--red)',
                }}
              />
            </div>
            <span className="savings-bar-label">Target: 20%</span>
          </div>
        </InsightCard>
        <InsightCard
          icon="⚡"
          label="Largest Transaction"
          value={largest ? fmtFull(largest.amount) : '—'}
          desc={largest ? `${largest.name} · ${fmtDate(largest.date)}` : 'No transactions yet'}
        />
        <InsightCard
          icon="💰"
          label="Avg Monthly Income"
          value={fmt(avgInc)}
          desc={`Across ${activeMonths} active month${activeMonths !== 1 ? 's' : ''}`}
        />
        <InsightCard
          icon="🧾"
          label="Avg Monthly Expenses"
          value={fmt(avgExp)}
          desc={avgInc > 0 ? `${Math.round((avgExp / avgInc) * 100)}% of avg income` : '—'}
        />
        <InsightCard
          icon="🗂️"
          label="Total Transactions"
          value={transactions.length}
          desc={`${transactions.filter(t => t.type === 'income').length} income · ${transactions.filter(t => t.type === 'expense').length} expenses`}
        />
      </div>

      {/* Charts row */}
      <div className="insights-charts">
        {/* Monthly bar chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Monthly Comparison</div>
              <div className="chart-subtitle">Income vs Expenses by month</div>
            </div>
            <div className="legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: '#3ecf8e' }} />Income</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#f5566a' }} />Expenses</div>
            </div>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 260 }}>
            <Bar data={barData} options={barOpts} />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Category Breakdown</div>
              <div className="chart-subtitle">Spending distribution</div>
            </div>
          </div>
          {catTotals.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No expense data yet.</p>
            </div>
          ) : (
            <div className="cat-bars">
              {catTotals.slice(0, 8).map(([cat, val]) => (
                <div className="cat-bar-row" key={cat}>
                  <div className="cat-bar-label">
                    <span>{CAT_ICONS[cat] || '◈'} {cat}</span>
                    <span className="cat-bar-val">{fmt(val)}</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div
                      className="cat-bar-fill"
                      style={{
                        width: `${Math.round((val / maxCat) * 100)}%`,
                        background: CAT_COLORS[cat] || '#8a8fa0',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
