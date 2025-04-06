import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png'; // Adjust if in a different folder

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home" className="brand-logo">
          <img src={logo} alt="Finsage Logo" className="navbar-logo" />
          FINSAGE
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/whats-hot">What's Hot</Link></li>
        <li><Link to="/stock-analyzer">Stock Analyzer</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;