import React, { useState } from "react";
import axios from "axios";
import "./Home.css";
import expenseTrackingImage from "./expense-tracking.jpg";
import FinancialInsightsImage from "./financial-insights.jpeg";
import InvestmentStrategiesImage from "./investment-stratergies.jpg";
import MapComponent from "./MapComponent";
import twitterIcon from "./twitter-logo.jpg";
import linkedinIcon from "./linkedin-logo.png";
import facebookIcon from "./facebook-icon.png";

const Home = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [chartImage, setChartImage] = useState(null);

  const BACKEND_URL = "http://127.0.0.1:5001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setChartImage(null);

    try {
      const result = await axios.post(`${BACKEND_URL}/api/query`, { query });
      setResponse(result.data.answer);

      if (result.data.chart) {
        setChartImage(result.data.chart.image);
      }
    } catch (error) {
      setError("Failed to fetch response from server.");
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <h1 className="brand-name"></h1>
        </div>
        <nav className="nav-bar">
          <a href="#features">Why Us</a>
          <a href="#testimonials">What We Do</a>
          <a href="#contact">Contact Us</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Financial Future</h1>
          <p>   </p>
          <p>   </p>
          <p>   </p>
          <p>Simplify your financial journey with Finsage.</p>
          <p>Track Expenses - Learn To Invest - Gain Personalized Insights</p>
          <p>All in one place!</p>
        </div>
      </section>

      {/* Query Form Section */}
      <section className="query-section">
        <form onSubmit={handleSubmit} className="query-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a financial question (e.g., 'Show me a pie chart')"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {response && <p>{response}</p>}
        {chartImage && (
          <img
            src={`data:image/png;base64,${chartImage}`}
            alt="Expense Breakdown"
            style={{ maxWidth: "500px", marginTop: "10px" }}
          />
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Finsage?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={expenseTrackingImage} alt="Track Expenses" className="feature-image" />
            <h3>Track Expenses</h3>
            <p>Monitor your spending habits with ease and clarity.</p>
          </div>
          <div className="feature-card">
            <img src={FinancialInsightsImage} alt="Financial Insights" className="feature-image" />
            <h3>Financial Insights</h3>
            <p>Understand your finances with personalized insights.</p>
          </div>
          <div className="feature-card">
            <img src={InvestmentStrategiesImage} alt="Investment Strategies" className="feature-image" />
            <h3>Learn to Invest</h3>
            <p>Discover strategies to grow your savings effectively.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>What We Do</h2>
        <div className="testimonials-carousel">
          <div className="testimonial">
            <p>
              Our financial chatbot is your all-in-one personal finance companion, designed to simplify money management and empower your financial growth.
            </p>
          </div>
          <div className="testimonial">
            <p>
              With interactive chatbot support, you can get instant answers to your finance-related queries and personalized advice. Our platform features dynamic visualizations to help you understand your spending patterns, savings, and investments at a glance.
            </p>
          </div>
          <div className="testimonial">
            <p>
              Our built-in expense tracking tool ensures you stay on top of your budget effortlessly. Whether you're tracking daily expenses or planning long-term goals, our chatbot makes personal finance easy and accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Reach Out</h3>
            <p>
              Email: <a href="mailto:support@finsage.com">support@finsage.com</a>
            </p>
            <p>Phone: +91 1234567890</p>
          </div>
          <div className="footer-section">
            <h3>Our Location</h3>
            <MapComponent />
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://twitter.com" aria-label="Twitter">
                <img src={twitterIcon} alt="Twitter" className="social-icon" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
        <p className="footer-note">© 2025 Finsage. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;