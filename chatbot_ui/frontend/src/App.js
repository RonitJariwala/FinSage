import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import WhatsHot from "./pages/WhatsHot";

function App() {
  return (
    <div>
      <Navbar /> {/* Always show Navbar since no authentication is needed */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default to Home page */}
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/whats-hot" element={<WhatsHot />} /> {/* New route */}
          <Route path="/stock-analyzer" element={<StockAnalyzer />} /> {/* New route */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect invalid routes to Home */}
        </Routes>
      </div>
    </div>
  );
}

export default App;