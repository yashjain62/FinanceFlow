export const fmt = n =>
  '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const fmtFull = n =>
  '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = d =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const today = () => new Date().toISOString().split('T')[0];

export function exportCSV(transactions) {
  const rows = [['Date', 'Name', 'Type', 'Category', 'Amount']];
  transactions.forEach(t => rows.push([t.date, t.name, t.type, t.category, t.amount]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'finflow-transactions.csv';
  a.click();
}

export function computeSummary(transactions) {
  const income   = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance  = income - expenses;
  const rate     = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  return { income, expenses, balance, rate };
}

export function computeCategoryTotals(transactions) {
  const bycat = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    bycat[t.category] = (bycat[t.category] || 0) + t.amount;
  });
  return Object.entries(bycat).sort((a, b) => b[1] - a[1]);
}

export function computeMonthlyData(transactions) {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const income   = new Array(12).fill(0);
  const expenses = new Array(12).fill(0);
  transactions.forEach(t => {
    const m = new Date(t.date + 'T00:00:00').getMonth();
    if (t.type === 'income') income[m] += t.amount;
    else expenses[m] += t.amount;
  });
  return { labels: monthNames, income, expenses };
}
