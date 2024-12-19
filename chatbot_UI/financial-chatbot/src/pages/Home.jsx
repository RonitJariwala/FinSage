import React from 'react';

const Home = () => {
  return (
    <div className="main-content">
      <header className="header">
        <h1>Welcome to Finsage</h1>
        <p>Manage your finances, get insights, and learn about financial literacy with ease.</p>
      </header>
      
      <section className="details">
        <h2>About Our Chatbot</h2>
        <p>
          Finsage is your personal financial assistant, designed to help you track expenses, learn investment strategies, and gain financial literacy. 
        </p>
        <p>
          From providing personalized advice to offering easy-to-understand financial visualizations, our chatbot is here to empower you on your journey to financial independence.
        </p>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:support@finsage.com">support@finsage.com</a></p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Financial Street, Money City, 10101</p>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="facebook-icon.png" alt="Facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="twitter-icon.png" alt="Twitter" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src="linkedin-icon.png" alt="LinkedIn" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="instagram-icon.png" alt="Instagram" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Our Services</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <p className="footer-note">© 2024 Finsage. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;