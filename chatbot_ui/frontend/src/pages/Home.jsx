import React from 'react';
import './Home.css';
import expenseTrackingImage from './expense-tracking.jpg';
import FinancialInsightsImage from './financial-insights.jpeg';
import InvestmentStrategiesImage from './investment-stratergies.jpg'; // Ensure the file name matches exactly!
import MapComponent from './MapComponent';
import logo from './logo.png';

// Import your local icon images
import twitterIcon from './twitter-logo.jpg';
import linkedinIcon from './linkedin-logo.png';
import facebookIcon from './facebook-icon.png';

const Home = () => {
  return (
    <div className="home-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Finsage Logo" className="logo" />
          <h1 className="brand-name">FINSAGE</h1>
        </div>
        <nav className="nav-bar">
          <a href="#features">Features</a>
          <a href="#testimonials">Overview</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Financial Future</h1>
          <p>
            Simplify your financial journey with Finsage. Track expenses, learn investment strategies, and gain personalized insights—all in one place.
          </p>
          <a href="#features" className="cta-button">Start Your Journey</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Features Tailored for You</h2>
        <div className="features-container">
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
        <h2>Overview</h2>
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

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          {/* Contact Information Section */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>
              Email: <a href="mailto:support@finsage.com">support@finsage.com</a>
            </p>
            <p>Phone: +91 1234567890</p>
          </div>

          {/* Social Media Section */}
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

        {/* Location Section */}
        <div className="footer-map">
          <h3>Our Location</h3>
          <MapComponent />
        </div>

        <p className="footer-note">© 2024 Finsage. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
