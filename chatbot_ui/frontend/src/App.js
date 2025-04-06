// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import Home from "./pages/Home";
// import Chatbot from "./pages/Chatbot";
// import Dashboard from "./pages/Dashboard";
// import Navbar from "./components/Navbar";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleLogin = (token) => {
//     localStorage.setItem("authToken", token);
//     setIsAuthenticated(true);
//     navigate("/home"); // Redirect to Home after login
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     setIsAuthenticated(false);
//     navigate("/"); // Redirect to Login after logout
//   };

//   return (
//     <div>
//       {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
//       <div className="container">
//         <Routes>
//           {!isAuthenticated ? (
//             <>
//               <Route path="/" element={<Login onLogin={handleLogin} />} />
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </>
//           ) : (
//             <>
//               <Route path="/home" element={<Home />} />
//               <Route path="/chatbot" element={<Chatbot />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="*" element={<Navigate to="/home" replace />} />
//             </>
//           )}
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;
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
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect invalid routes to Home */}
        </Routes>
      </div>
    </div>
  );
}

export default App;