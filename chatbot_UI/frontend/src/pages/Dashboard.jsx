import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import axios from "axios";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [chartType, setChartType] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prevStoredData, setPrevStoredData] = useState(null); // Store previous data to detect changes

  // Function to load chart from localStorage
  const loadChartFromStorage = () => {
    const storedData = localStorage.getItem("visualizationData");
    if (storedData !== prevStoredData) {
      const parsedData = JSON.parse(storedData);
      setChartType(parsedData.type);
      setChartData({
        labels: parsedData.labels,
        datasets: [
          {
            data: parsedData.values,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      });
      setPrevStoredData(storedData); // Update previous data to track changes
    }
  };

  useEffect(() => {
    loadChartFromStorage();
    fetchDashboardData();

    // Poll every 2 seconds to check for updates
    const interval = setInterval(() => {
      loadChartFromStorage();
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Fetch API data for other financial details
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/dashboard");
      console.log("Dashboard API data:", response.data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>

      {/* Error and Loading States */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Render Pie Chart if Data Exists */}
      <div className="charts-grid">
        {chartType === "pie" && chartData && (
          <div className="chart-section pie-chart">
            <h2>Pie Chart - Expense Breakdown</h2>
            <div className="chart-wrapper large-chart">
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Static Savings Line Chart */}
        <div className="chart-section line-chart">
          <h2>Monthly Savings</h2>
          <div className="chart-wrapper large-chart">
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Savings",
                    data: [2000, 3000, 4000, 3500, 4500],
                    fill: true,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    tension: 0.4,
                    pointRadius: 6,
                    borderWidth: 3,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
