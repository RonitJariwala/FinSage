import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from './pages/Overview';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <div>
      {isAuthenticated && <Navbar />}

      <div className="container">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Overview />} /> 
              <Route path="/login" element={<Login onLogin={handleLogin} />} /> 
            </>
          ) : (
            <Route path="/" element={<Navigate to="/home" />} />
          )}
          {isAuthenticated ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/home" />} /> 
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;