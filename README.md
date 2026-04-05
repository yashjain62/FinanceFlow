# FinFlow — Personal Finance Dashboard

🔗 Live Project: https://your-deployed-link.com

FinFlow is a simple personal finance dashboard that I built using **React and plain CSS**. The goal of this project was to create a clean and easy-to-use interface where users can track income and expenses, understand their spending habits, and get quick financial insights — all without needing any backend.

The entire application runs in the browser and stores data locally, making it lightweight and fast.

---

## Getting Started

To run the project locally:

```bash
npm install
npm start
```

This will start the development server at
http://localhost:3000

---

## Production Build

To generate an optimized production build:

```bash
npm run build
```

This creates a `build` folder that can be deployed on platforms like Netlify, Vercel, or GitHub Pages.

---

## Features

* Dashboard with balance, income, expenses, and savings rate
* Interactive charts to visualize spending and trends
* Add, edit, and delete transactions
* Search, filter, and sort functionality
* Monthly insights and spending analysis
* Dark and light mode toggle
* Data persistence using localStorage
* CSV export option
* Responsive layout for mobile and desktop
* Toast notifications for user actions

---

## Tech Stack

* React
* Plain CSS
* Chart.js
* React Context API
* useReducer
* LocalStorage

No external UI libraries were used. All components and styles were written from scratch.

---

## Project Structure

```
src
 ├── components
 ├── pages
 ├── context
 ├── data
 ├── utils
 ├── App.js
 └── index.js
```

---

## Deployment

To deploy, simply run:

```bash
npm run build
```

Then upload the `build` folder to any static hosting platform such as Netlify or Vercel.

---

This project was created to practice state management, reusable components, and building a responsive UI without relying on component libraries.
