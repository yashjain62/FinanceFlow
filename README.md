# FinFlow — Finance Dashboard

A personal finance dashboard built with **React** and plain **CSS**. Tracks income, expenses, spending patterns, and gives you actionable insights — all in the browser with no backend required.

---

## Quick Start

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. That's it.

---

## Build for Production

```bash
npm run build
```

Outputs a static `build/` folder. Drop it on Netlify, Vercel, GitHub Pages, or any static host.

---

## Project Structure

```
src/
├── App.js                  # Root shell — layout + routing
├── App.css                 # Shared layout + reusable table/badge styles
├── index.js                # Entry point
├── index.css               # CSS variables (dark/light), resets, keyframes
│
├── context/
│   └── AppContext.js       # useReducer state: transactions, role, theme, toast
│
├── data/
│   └── transactions.js     # 47 seed transactions + category colors/icons
│
├── utils.js                # Formatting helpers + computeSummary / computeMonthlyData
│
├── components/
│   ├── Sidebar.js/.css     # Navigation + role switcher
│   ├── Topbar.js/.css      # Page title + theme toggle + add button
│   ├── Toast.js/.css       # Global notification toast
│   └── TransactionModal.js/.css  # Add / Edit form modal
│
└── pages/
    ├── Dashboard.js/.css   # Overview: KPI cards, line chart, donut, recent tx
    ├── Transactions.js/.css # Full table: search, filter, sort, pagination, CRUD
    └── Insights.js/.css    # KPI grid, monthly bar chart, category bars
```

---

## Features

### Dashboard
- **4 KPI summary cards** — Balance, Income, Expenses, Savings Rate with trend indicators
- **Balance trend line chart** — 3M / 6M / 1Y period toggle (Income vs Expenses)
- **Spending donut chart** — Top 5 categories with percentage breakdown
- **Recent transactions** — 6 most recent with quick-link to full list

### Transactions
- Full table with Description, Category, Date, Amount
- **Search** by name or category
- **Filter** by type (income / expense) and category
- **Sort** by date, amount, name, or category
- **Paginated** — 10 per page
- **Add / Edit / Delete** (Admin role only, with confirmation on delete)

### Insights
- Top spending category with % share
- Savings rate with animated progress bar and advice
- Largest transaction ever
- Average monthly income & expenses
- Total transaction count breakdown
- Monthly income vs expenses bar chart
- Category spending bars (animated on load)

### Role-Based UI
| Feature              | Admin | Viewer |
|----------------------|-------|--------|
| View all data        | ✓     | ✓      |
| Add transactions     | ✓     | ✗      |
| Edit transactions    | ✓     | ✗      |
| Delete transactions  | ✓     | ✗      |
| Export CSV           | ✓     | ✓      |

Toggle roles from the sidebar — no login required (demo simulation).

### Other
- **Dark / Light mode** with localStorage persistence
- **LocalStorage persistence** — transactions survive page refresh
- **CSV export** via sidebar
- **Animated page transitions** and bar chart fills
- **Toast notifications** for all write actions
- **Fully responsive** — mobile, tablet, desktop
- **Empty states** when no transactions match filters

---

## State Management

Uses React's built-in `useReducer` + `useContext` (no Redux, no Zustand). All global state lives in `AppContext`:

| State          | Type       | Description                        |
|----------------|------------|------------------------------------|
| `transactions` | `array`    | All transaction records            |
| `role`         | `string`   | `'admin'` or `'viewer'`            |
| `theme`        | `string`   | `'dark'` or `'light'`             |
| `activePage`   | `string`   | Current page key                   |
| `toast`        | `object`   | Active notification (auto-clears)  |

---

## Tech Stack

| Layer       | Choice                                |
|-------------|---------------------------------------|
| UI          | React 18                              |
| Styling     | Plain CSS with CSS custom properties  |
| Charts      | Chart.js 4 + react-chartjs-2         |
| Fonts       | DM Serif Display + DM Sans (Google)   |
| State       | useReducer + useContext               |
| Persistence | localStorage                          |
| Build       | Create React App                      |

No UI component library. No CSS preprocessor. Everything is hand-written CSS.

---

## Deploying

**Netlify:**
```bash
npm run build
# Drag the build/ folder to Netlify drop zone
```

**Vercel:**
```bash
npx vercel
```

**GitHub Pages:**
```bash
# Add to package.json: "homepage": "https://yourusername.github.io/finflow"
npm run build
npx gh-pages -d build
```

---

*Built from scratch — React + CSS, no component libraries.*
