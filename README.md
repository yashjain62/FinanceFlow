# FinanceFlow — React Finance Dashboard

🔗 Live Demo: https://your-vercel-link.vercel.app

FinanceFlow is a frontend-focused personal finance dashboard built using **React** and **plain CSS**. The application allows users to track income and expenses, analyze spending behavior, and view financial insights through interactive charts. The entire app runs client-side and uses **localStorage** for persistence, so no backend setup is required.

The main focus of this project was building a clean UI, structured state management, and modular reusable components without relying on UI libraries.

---

## Key Features

* Dashboard with balance, income, expenses, and savings rate
* Interactive charts for spending and trends
* Transaction management (add, edit, delete)
* Search, filter, and sorting functionality
* Monthly insights and category-wise analysis
* Dark / Light theme toggle with persistence
* CSV export support
* Toast notifications
* Responsive layout (mobile, tablet, desktop)
* Role-based UI (Admin / Viewer)
* LocalStorage data persistence

---

## Tech Stack

* React 18
* Context API + useReducer (state management)
* Chart.js + react-chartjs-2
* Plain CSS with CSS variables
* LocalStorage
* Create React App

---

## Project Structure

```
src/
 ├── components/      # Reusable UI components
 ├── pages/           # Dashboard, Transactions, Insights
 ├── context/         # Global state management
 ├── data/            # Seed transaction data
 ├── utils.js         # Helper functions
 ├── App.js           # Layout and routing
 └── index.js         # Entry point
```

---

## Running Locally

```bash
npm install
npm start
```

Runs at: http://localhost:3000

---

## Production Build

```bash
npm run build
```

Creates optimized static files inside the `build` folder.

---

## Deployment

The project is deployed using **GitHub and Vercel**.

* Code pushed to GitHub repository
* Repository imported into Vercel
* Vercel automatically builds using `npm run build`
* Static files served via global CDN
* Auto redeploy on every push

---

## Highlights

* No backend required
* No UI component libraries used
* Modular component architecture
* Optimized production build
* Fully responsive design
* Clean and minimal UI

---

This project was built to strengthen frontend architecture, state management using Context API, and building production-ready React applications without external UI frameworks.
