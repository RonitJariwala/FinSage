import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./StockAnalyzer.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockAnalyzer = () => {
  const [selectedStock, setSelectedStock] = useState("");
  const [compareStocks, setCompareStocks] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("1d"); // Default period
  const [interval, setInterval] = useState("1m"); // Default interval

  const periodOptions = [
    { value: "1d", label: "1 Day" },
    { value: "5d", label: "5 Days" },
    { value: "1mo", label: "1 Month" },
    { value: "3mo", label: "3 Months" },
    { value: "1y", label: "1 Year" },
    { value: "max", label: "Max" },
  ];

  const intervalOptions = [
    { value: "1m", label: "1 Minute" },
    { value: "5m", label: "5 Minutes" },
    { value: "15m", label: "15 Minutes" },
    { value: "30m", label: "30 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "1d", label: "1 Day" },
  ];

  const fetchStockData = async (tickers) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5001/api/stock-data", {
        tickers: tickers.join(","),
        period: period, // Use selected period
        interval: interval, // Use selected interval
      });
      if (response.data.status === "success") {
        setStockData(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    if (selectedStock && !compareStocks.includes(selectedStock)) {
      setCompareStocks([...compareStocks, selectedStock]);
      fetchStockData([...compareStocks, selectedStock]);
      setSelectedStock("");
    }
  };

  const handleRemoveStock = (ticker) => {
    setCompareStocks(compareStocks.filter(t => t !== ticker));
    const newData = { ...stockData };
    delete newData[ticker];
    setStockData(newData);
  };

  useEffect(() => {
    if (compareStocks.length > 0) {
      fetchStockData(compareStocks);
    }
  }, [compareStocks, period, interval]); // Re-fetch when period or interval changes

  const chartData = {
    labels: compareStocks.length > 0 ? stockData[compareStocks[0]]?.dates || [] : [],
    datasets: compareStocks.map(ticker => ({
      label: ticker,
      data: stockData[ticker]?.closes || [],
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.2)`,
      fill: false,
      tension: 0.1,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#e0e0e0" } },
      title: {
        display: true,
        text: `Stock Price Comparison (${period.replace("mo", " Month(s)")}, ${interval.replace("m", " Minute(s)").replace("h", " Hour(s)")})`,
        color: "#00ffcc",
      },
    },
    scales: {
      x: { title: { display: true, text: "Time", color: "#e0e0e0" }, ticks: { color: "#b0b0b0" } },
      y: { title: { display: true, text: "Price (USD)", color: "#e0e0e0" }, ticks: { color: "#b0b0b0" }, beginAtZero: false },
    },
  };

  return (
    <div className="stock-analyzer-wrapper">
      <div className="stock-analyzer-glass">
        <h1 className="stock-analyzer-title">Stock Analyzer</h1>
        <div className="stock-input">
          <input
            type="text"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker (e.g., AAPL)"
            disabled={loading}
          />
          <button onClick={handleAddStock} disabled={loading || !selectedStock}>
            {loading ? "Loading..." : "Add Stock"}
          </button>
        </div>
        {/* Add period and interval selectors */}
        <div className="selector-container">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} disabled={loading}>
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select value={interval} onChange={(e) => setInterval(e.target.value)} disabled={loading}>
            {intervalOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="stock-list">
          {compareStocks.map(ticker => (
            <div key={ticker} className="stock-item">
              {ticker}
              <button onClick={() => handleRemoveStock(ticker)}>Remove</button>
            </div>
          ))}
        </div>
        {loading && <div className="loading">Fetching data...</div>}
        {compareStocks.length > 0 && (
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
        {compareStocks.length === 0 && !loading && <div className="no-data">Please add a stock to see the graph.</div>}
      </div>
    </div>
  );
};

export default StockAnalyzer;