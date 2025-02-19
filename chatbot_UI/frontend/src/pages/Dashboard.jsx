import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Line, Bar, Scatter } from "react-chartjs-2";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
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

  // Helper function to calculate linear regression (best fit line)
  const linearRegression = (data) => {
    const n = data.length;
    if (n === 0) return null;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;
    data.forEach((point) => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumX2 += point.x * point.x;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  };

  // Retrieve the chart data from localStorage on mount
  useEffect(() => {
    const fetchChartData = () => {
      const storedData = localStorage.getItem("visualizationData");
      if (!storedData) {
        setError("No data found for visualization.");
        setLoading(false);
        return;
      }

      try {
        const parsedData = JSON.parse(storedData);

        // Ensure the type field exists
        if (!parsedData.type) {
          setError("Invalid chart data format: missing 'type'.");
          setLoading(false);
          return;
        }

        // Process Pie Chart Data
        if (parsedData.type === "pie") {
          if (
            !Array.isArray(parsedData.labels) ||
            !Array.isArray(parsedData.values) ||
            parsedData.labels.length !== parsedData.values.length
          ) {
            setError("Invalid pie chart data format.");
            setLoading(false);
            return;
          }

          const values = parsedData.values.map((value) => parseFloat(value));
          if (values.some(isNaN)) {
            setError("Invalid values in pie chart data.");
            setLoading(false);
            return;
          }

          setChartData({
            labels: parsedData.labels,
            datasets: [
              {
                data: values,
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
          setChartType("pie");
        }
        // Process Line Chart Data
        else if (parsedData.type === "line") {
          if (
            !Array.isArray(parsedData.labels) ||
            !Array.isArray(parsedData.values) ||
            parsedData.labels.length !== parsedData.values.length
          ) {
            setError("Invalid line chart data format.");
            setLoading(false);
            return;
          }

          const values = parsedData.values.map((value) => parseFloat(value));
          if (values.some(isNaN)) {
            setError("Invalid values in line chart data.");
            setLoading(false);
            return;
          }

          setChartData({
            labels: parsedData.labels,
            datasets: [
              {
                label: "Monthly Savings Trend",
                data: values,
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 0.4)",
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
                pointRadius: 5,
                borderWidth: 2,
              },
            ],
          });
          setChartType("line");
        }
        // Process Stacked Bar Chart Data
        else if (parsedData.type === "stacked") {
          if (
            !Array.isArray(parsedData.labels) ||
            !Array.isArray(parsedData.fixed) ||
            !Array.isArray(parsedData.variable) ||
            parsedData.labels.length !== parsedData.fixed.length ||
            parsedData.labels.length !== parsedData.variable.length
          ) {
            setError("Invalid stacked bar chart data format.");
            setLoading(false);
            return;
          }

          const fixedValues = parsedData.fixed.map((value) => parseFloat(value));
          const variableValues = parsedData.variable.map((value) =>
            parseFloat(value)
          );
          if (fixedValues.some(isNaN) || variableValues.some(isNaN)) {
            setError("Invalid values in stacked bar chart data.");
            setLoading(false);
            return;
          }

          setChartData({
            labels: parsedData.labels,
            datasets: [
              {
                label: "Fixed Expenses",
                data: fixedValues,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
              },
              {
                label: "Variable Expenses",
                data: variableValues,
                backgroundColor: "rgba(255, 206, 86, 0.7)",
              },
            ],
          });
          setChartType("stacked");
        }
        // Process Scatter Plot Data
        else if (parsedData.type === "scatter") {
          if (
            !Array.isArray(parsedData.x) ||
            !Array.isArray(parsedData.y) ||
            parsedData.x.length !== parsedData.y.length
          ) {
            setError("Invalid scatter plot data format.");
            setLoading(false);
            return;
          }

          const xValues = parsedData.x.map((value) => parseFloat(value));
          const yValues = parsedData.y.map((value) => parseFloat(value));
          if (xValues.some(isNaN) || yValues.some(isNaN)) {
            setError("Invalid values in scatter plot data.");
            setLoading(false);
            return;
          }

          // Combine x and y into an array of objects {x, y}
          const scatterData = xValues.map((x, index) => ({
            x: x,
            y: yValues[index],
          }));

          // Compute the best-fit line using linear regression
          const regression = linearRegression(scatterData);
          let regressionLineData = [];
          if (regression) {
            const { slope, intercept } = regression;
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            regressionLineData = [
              { x: minX, y: slope * minX + intercept },
              { x: maxX, y: slope * maxX + intercept },
            ];
          }

          setChartData({
            datasets: [
              {
                label: "Income vs. Spending",
                data: scatterData,
                backgroundColor: "rgba(255, 99, 132, 1)",
                pointRadius: 5,
              },
              {
                label: "Best Fit Line",
                type: "line",
                data: regressionLineData,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0,
              },
            ],
          });
          setChartType("scatter");
        } else {
          setError("Unsupported chart type.");
        }
      } catch (err) {
        setError("Failed to parse visualization data.");
      }
      setLoading(false);
    };

    fetchChartData();
  }, []);

  // Default chart options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Adjust options for specific chart types
  let chartOptions = defaultOptions;
  if (chartType === "scatter") {
    chartOptions = {
      ...defaultOptions,
      scales: {
        x: { type: "linear", position: "bottom" },
        y: { type: "linear" },
      },
    };
  } else if (chartType === "stacked") {
    chartOptions = {
      ...defaultOptions,
      scales: {
        x: { stacked: true },
        y: { stacked: true },
      },
    };
  }

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
            {chartType === "line" && chartData && (
              <div className="chart-section line-chart">
                <h2>Line Chart - Monthly Savings Trend</h2>
                <div className="chart-wrapper">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
            {chartType === "stacked" && chartData && (
              <div className="chart-section stacked-chart">
                <h2>Stacked Bar Chart - Fixed vs. Variable Expenses</h2>
                <div className="chart-wrapper">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
            {chartType === "scatter" && chartData && (
              <div className="chart-section scatter-chart">
                <h2>Scatter Plot - Income vs. Spending</h2>
                <div className="chart-wrapper">
                  <Scatter data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
