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

  // Retrieve the chart data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("visualizationData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setChartType(parsedData.type);
      if (parsedData.type === "pie") {
        setChartData({
          labels: parsedData.labels,
          datasets: [
            {
              data: parsedData.values,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        });
      } else {
        setError("Invalid chart type or data format.");
      }
    } else {
      setError("No data found for visualization.");
    }
    setLoading(false);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Financial Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="charts-grid">
            {chartType === "pie" && chartData && (
              <div className="chart-section pie-chart">
                <h2>Pie Chart - Expense Breakdown</h2>
                <div className="chart-wrapper">
                  <Pie data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
            <div className="chart-section line-chart">
              <h2>Monthly Savings</h2>
              <div className="chart-wrapper">
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
