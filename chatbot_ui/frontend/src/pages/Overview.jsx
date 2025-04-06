import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Overview.css';
import logo from './logo.png';  
import facebookIcon from './facebook-icon.png';  
import linkedinLogo from './linkedin-logo.png';  
import twitterLogo from './twitter-logo.jpg';  

const Overview = () => {
  const navigate = useNavigate(); 

  const handleGetStarted = () => {
    console.log('Navigating to login page');
    navigate('/login');
  };

  return (
    <div className="overview-container">
      <div className="left-section">
        <img src={logo} alt="FinBot Logo" className="logo-circle" />
        <div className="social-icons">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" className="social-icon" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer">
            <img src={twitterLogo} alt="Twitter" className="social-icon" />
          </a>
        </div>
      </div>

      <div className="right-section">
        <h1 className="title">Hi, It's <span className="highlight">FinSage</span></h1>
        <h2 className="subtitle">I'm your Finance Buddy</h2>
        <p className="description">
          Grow your funds, manage your finances, and gain financial knowledge with FinSage. Start your financial journey today!
        </p>
        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Overview;