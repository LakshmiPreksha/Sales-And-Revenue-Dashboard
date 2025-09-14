# Sales & Revenue Dashboard

This project is a **Sales & Revenue Dashboard** built with React. The idea behind the dashboard is simple: make it easy for a manager to quickly understand how the business is doing by looking at sales performance, monthly targets, and the top products/customers.

🔗 **Live Demo:** [Sales & Revenue Dashboard](https://sales-and-revenue-dashboard.vercel.app/)

---

## Project Overview

I built this as part of the **Krowd Software Engineer Internship pre-interview assignment**.
The main goal was to design a dashboard that:

* Tracks **total revenue and growth**
* Compares **monthly sales with targets**
* Highlights the **top products and customers**
* Presents everything in a clean, visual format

---

## Tech Stack

* **React (JavaScript)** for the frontend
* **Tailwind CSS** for styling
* **Recharts** for charts and data visualization
* **Framer Motion** for subtle animations
* Hosted on **Vercel**

---

## Features

### Dashboard Sections

* **Top Section:** KPIs like total revenue, target achievement %, and revenue growth %
* **Charts:**

  * Line chart showing monthly sales vs target
  * Pie chart for product share
  * Bar chart (optional) for top 5 customers
* **Tables:**

  * Complete sales data (date, sales rep, client, product, units, revenue, target)
  * Top 5 products by sales
  * Top 5 customers by revenue

### Revenue Growth

The dashboard calculates month-over-month revenue growth using:

$$
\frac{(This\ Month - Last\ Month)}{Last\ Month} \times 100
$$

### Data

For this project, I used **mock data** from a local JSON file (no backend).

---

## How to Run

1. Clone the repo

   ```bash
   git clone https://github.com/yourusername/sales-revenue-dashboard.git
   cd sales-revenue-dashboard
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npm start
   ```

   The app runs on [http://localhost:3000](http://localhost:3000).

4. Build for production

   ```bash
   npm run build
   ```
## Delivery

* **Live Link:** [Sales & Revenue Dashboard](https://sales-and-revenue-dashboard.vercel.app/)
* **GitHub Repo:** [Repository Link](https://github.com/yourusername/sales-revenue-dashboard)
