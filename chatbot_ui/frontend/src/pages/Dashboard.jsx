// import React, { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { Pie, Line, Bar, Scatter } from "react-chartjs-2";
// import "./Dashboard.css";

// // Register Chart.js components and plugins
// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   Filler
// );

// const Dashboard = () => {
//   const [chartType, setChartType] = useState(null);
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Helper function to calculate linear regression (best fit line)
//   const linearRegression = (data) => {
//     const n = data.length;
//     if (n === 0) return null;
//     let sumX = 0,
//       sumY = 0,
//       sumXY = 0,
//       sumX2 = 0;
//     data.forEach((point) => {
//       sumX += point.x;
//       sumY += point.y;
//       sumXY += point.x * point.y;
//       sumX2 += point.x * point.x;
//     });
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
//     const intercept = (sumY - slope * sumX) / n;
//     return { slope, intercept };
//   };

//   // Retrieve the chart data from localStorage on mount
//   useEffect(() => {
//     const fetchChartData = () => {
//       const storedData = localStorage.getItem("visualizationData");
//       if (!storedData) {
//         setError("No data found for visualization.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const parsedData = JSON.parse(storedData);

//         // Ensure the type field exists
//         if (!parsedData.type) {
//           setError("Invalid chart data format: missing 'type'.");
//           setLoading(false);
//           return;
//         }

//         // Process Pie Chart Data
//         if (parsedData.type === "pie") {
//           if (
//             !Array.isArray(parsedData.labels) ||
//             !Array.isArray(parsedData.values) ||
//             parsedData.labels.length !== parsedData.values.length
//           ) {
//             setError("Invalid pie chart data format.");
//             setLoading(false);
//             return;
//           }

//           const values = parsedData.values.map((value) => parseFloat(value));
//           if (values.some(isNaN)) {
//             setError("Invalid values in pie chart data.");
//             setLoading(false);
//             return;
//           }

//           setChartData({
//             labels: parsedData.labels,
//             datasets: [
//               {
//                 data: values,
//                 backgroundColor: [
//                   "#FF6384",
//                   "#36A2EB",
//                   "#FFCE56",
//                   "#4BC0C0",
//                   "#9966FF",
//                 ],
//                 hoverBackgroundColor: [
//                   "#FF6384",
//                   "#36A2EB",
//                   "#FFCE56",
//                   "#4BC0C0",
//                   "#9966FF",
//                 ],
//                 borderWidth: 2,
//                 borderColor: "#1a233a",
//               },
//             ],
//           });
//           setChartType("pie");
//         }
//         // Process Line Chart Data
//         else if (parsedData.type === "line") {
//           if (
//             !Array.isArray(parsedData.labels) ||
//             !Array.isArray(parsedData.values) ||
//             parsedData.labels.length !== parsedData.values.length
//           ) {
//             setError("Invalid line chart data format.");
//             setLoading(false);
//             return;
//           }

//           const values = parsedData.values.map((value) => parseFloat(value));
//           if (values.some(isNaN)) {
//             setError("Invalid values in line chart data.");
//             setLoading(false);
//             return;
//           }

//           setChartData({
//             labels: parsedData.labels,
//             datasets: [
//               {
//                 label: "Monthly Savings Trend",
//                 data: values,
//                 fill: true,
//                 backgroundColor: "rgba(75, 192, 192, 0.2)",
//                 borderColor: "rgba(75, 192, 192, 1)",
//                 tension: 0.4,
//                 pointRadius: 5,
//                 pointHoverRadius: 8,
//                 borderWidth: 3,
//               },
//             ],
//           });
//           setChartType("line");
//         }
//         // Process Stacked Bar Chart Data
//         else if (parsedData.type === "stacked") {
//           if (
//             !Array.isArray(parsedData.labels) ||
//             !Array.isArray(parsedData.fixed) ||
//             !Array.isArray(parsedData.variable) ||
//             parsedData.labels.length !== parsedData.fixed.length ||
//             parsedData.labels.length !== parsedData.variable.length
//           ) {
//             setError("Invalid stacked bar chart data format.");
//             setLoading(false);
//             return;
//           }

//           const fixedValues = parsedData.fixed.map((value) => parseFloat(value));
//           const variableValues = parsedData.variable.map((value) =>
//             parseFloat(value)
//           );
//           if (fixedValues.some(isNaN) || variableValues.some(isNaN)) {
//             setError("Invalid values in stacked bar chart data.");
//             setLoading(false);
//             return;
//           }

//           setChartData({
//             labels: parsedData.labels,
//             datasets: [
//               {
//                 label: "Fixed Expenses",
//                 data: fixedValues,
//                 backgroundColor: "rgba(54, 162, 235, 0.7)",
//                 borderColor: "rgba(54, 162, 235, 1)",
//                 borderWidth: 1,
//               },
//               {
//                 label: "Variable Expenses",
//                 data: variableValues,
//                 backgroundColor: "rgba(255, 206, 86, 0.7)",
//                 borderColor: "rgba(255, 206, 86, 1)",
//                 borderWidth: 1,
//               },
//             ],
//           });
//           setChartType("stacked");
//         }
//         // Process Scatter Plot Data
//         else if (parsedData.type === "scatter") {
//           if (
//             !Array.isArray(parsedData.x) ||
//             !Array.isArray(parsedData.y) ||
//             parsedData.x.length !== parsedData.y.length
//           ) {
//             setError("Invalid scatter plot data format.");
//             setLoading(false);
//             return;
//           }

//           const xValues = parsedData.x.map((value) => parseFloat(value));
//           const yValues = parsedData.y.map((value) => parseFloat(value));
//           if (xValues.some(isNaN) || yValues.some(isNaN)) {
//             setError("Invalid values in scatter plot data.");
//             setLoading(false);
//             return;
//           }

//           // Combine x and y into an array of objects {x, y}
//           const scatterData = xValues.map((x, index) => ({
//             x: x,
//             y: yValues[index],
//           }));

//           // Compute the best-fit line using linear regression
//           const regression = linearRegression(scatterData);
//           let regressionLineData = [];
//           if (regression) {
//             const { slope, intercept } = regression;
//             const minX = Math.min(...xValues);
//             const maxX = Math.max(...xValues);
//             regressionLineData = [
//               { x: minX, y: slope * minX + intercept },
//               { x: maxX, y: slope * maxX + intercept },
//             ];
//           }

//           setChartData({
//             datasets: [
//               {
//                 label: "Income vs. Spending",
//                 data: scatterData,
//                 backgroundColor: "rgba(255, 99, 132, 1)",
//                 pointRadius: 5,
//                 pointHoverRadius: 8,
//               },
//               {
//                 label: "Best Fit Line",
//                 type: "line",
//                 data: regressionLineData,
//                 borderColor: "rgba(255, 99, 132, 1)",
//                 borderWidth: 2,
//                 fill: false,
//                 pointRadius: 0,
//                 tension: 0,
//               },
//             ],
//           });
//           setChartType("scatter");
//         } else {
//           setError("Unsupported chart type.");
//         }
//       } catch (err) {
//         setError("Failed to parse visualization data.");
//       }
//       setLoading(false);
//     };

//     fetchChartData();
//   }, []);

//   // Default chart options for non-pie charts
//   const defaultOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: "#ecf0f1",
//           font: {
//             size: 14,
//             weight: "500",
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: "rgba(26, 35, 58, 0.9)",
//         titleColor: "#00bcd4",
//         bodyColor: "#ecf0f1",
//         borderColor: "rgba(0, 188, 212, 0.3)",
//         borderWidth: 1,
//         cornerRadius: 10,
//         padding: 12,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           color: "rgba(255, 255, 255, 0.1)",
//         },
//         ticks: {
//           color: "#ecf0f1",
//         },
//       },
//       y: {
//         grid: {
//           color: "rgba(255, 255, 255, 0.1)",
//         },
//         ticks: {
//           color: "#ecf0f1",
//         },
//       },
//     },
//   };

//   // Adjust options for specific chart types
//   let chartOptions = defaultOptions;
//   if (chartType === "scatter") {
//     chartOptions = {
//       ...defaultOptions,
//       scales: {
//         x: { type: "linear", position: "bottom" },
//         y: { type: "linear" },
//       },
//     };
//   } else if (chartType === "stacked") {
//     chartOptions = {
//       ...defaultOptions,
//       scales: {
//         x: { stacked: true },
//         y: { stacked: true },
//       },
//     };
//   } else if (chartType === "pie") {
//     // For the pie chart, remove scales entirely and include data labels with percentiles and category names.
//     chartOptions = {
//       ...defaultOptions,
//       scales: {}, // Remove any scales (not applicable for pie charts)
//       plugins: {
//         ...defaultOptions.plugins,
//         datalabels: {
//           color: "#fff",
//           formatter: (value, context) => {
//             const label = context.chart.data.labels[context.dataIndex];
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percentage = ((value / total) * 100).toFixed(2) + "%";
//             return `${label}\n${percentage}`;
//           },
//           font: {
//             size: 14,
//             weight: "bold",
//           },
//         },
//       },
//     };
//   }

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container">
//         <h1>Financial Dashboard</h1>
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="charts-grid">
//             {chartType === "pie" && chartData && (
//               <div className="chart-section pie-chart">
//                 <h2>Pie Chart - Expense Breakdown</h2>
//                 <div className="chart-wrapper">
//                   <Pie data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//             )}
//             {chartType === "line" && chartData && (
//               <div className="chart-section line-chart">
//                 <h2>Line Chart - Monthly Savings Trend</h2>
//                 <div className="chart-wrapper">
//                   <Line data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//             )}
//             {chartType === "stacked" && chartData && (
//               <div className="chart-section stacked-chart">
//                 <h2>Stacked Bar Chart - Fixed vs. Variable Expenses</h2>
//                 <div className="chart-wrapper">
//                   <Bar data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//             )}
//             {chartType === "scatter" && chartData && (
//               <div className="chart-section scatter-chart">
//                 <h2>Scatter Plot - Income vs. Spending</h2>
//                 <div className="chart-wrapper">
//                   <Scatter data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
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

// Register Chart.js components and plugins
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

        if (!parsedData.type) {
          setError("Invalid chart data format: missing 'type'.");
          setLoading(false);
          return;
        }

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
                borderWidth: 2,
                borderColor: "#1a233a",
              },
            ],
          });
          setChartType("pie");
        } else if (parsedData.type === "line") {
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
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 3,
              },
            ],
          });
          setChartType("line");
        } else if (parsedData.type === "stacked") {
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
          const variableValues = parsedData.variable.map((value) => parseFloat(value));
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
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "Variable Expenses",
                data: variableValues,
                backgroundColor: "rgba(255, 206, 86, 0.7)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
              },
            ],
          });
          setChartType("stacked");
        } else if (parsedData.type === "scatter") {
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

          const scatterData = xValues.map((x, index) => ({ x, y: yValues[index] }));
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
                pointHoverRadius: 8,
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

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ecf0f1",
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(26, 35, 58, 0.9)",
        titleColor: "#00bcd4",
        bodyColor: "#ecf0f1",
        borderColor: "rgba(0, 188, 212, 0.3)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ecf0f1",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ecf0f1",
        },
      },
    },
  };

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
  } else if (chartType === "pie") {
    chartOptions = {
      ...defaultOptions,
      scales: {},
      plugins: {
        ...defaultOptions.plugins,
        datalabels: {
          color: "#fff",
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return `${label}\n${percentage}`;
          },
          font: {
            size: 14,
            weight: "bold",
          },
        },
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