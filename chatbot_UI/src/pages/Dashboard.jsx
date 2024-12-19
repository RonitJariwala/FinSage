import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample Data
  const expenseData = {
    labels: ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment'],
    datasets: [
      {
        label: 'Expenses',
        data: [8000, 5000, 3000, 2000, 1000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const savingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Savings',
        data: [2000, 3000, 4000, 3500, 4500],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
    ],
  };

  const accountBalance = 50000;
  const totalSavings = 12000;

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>

      {/* Account Summary */}
      <div className="account-summary">
        <div className="summary-card">
          <h3>Current Balance</h3>
          <p>₹{accountBalance.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Savings This Month</h3>
          <p>₹{totalSavings.toLocaleString()}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="charts-grid">
       
        <div className="chart-section">
          <h2>Expense Tracking</h2>
          <Pie data={expenseData} />
        </div>

        
        <div className="chart-section">
          <h2>Monthly Savings</h2>
          <Line data={savingsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;