import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/whats-hot">What's Hot</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
