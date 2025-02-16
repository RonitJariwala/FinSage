import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const BACKEND_URL = "http://127.0.0.1:5000"; // Keep it consistent with App.js

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.warn("No authentication token found.");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      localStorage.removeItem('authToken'); // Remove token after successful logout
      onLogout(); // Update authentication state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li><Link to="/">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
