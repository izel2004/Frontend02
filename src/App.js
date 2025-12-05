import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Books from "./Pages/Books";
import Members from "./Pages/Members";
import Loans from "./Pages/Loans";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Library System</h1>
        <nav style={{ marginBottom: "20px" }}>
          <NavLink to="/" style={linkStyle} end>Books</NavLink>
          <NavLink to="/members" style={linkStyle}>Members</NavLink>
          <NavLink to="/loans" style={linkStyle}>Loans</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/loans" element={<Loans />} />
        </Routes>
      </div>
    </Router>
  );
}

const linkStyle = ({ isActive }) => ({
  marginRight: "15px",
  textDecoration: "none",
  color: isActive ? "white" : "#333",
  backgroundColor: isActive ? "#4CAF50" : "transparent",
  padding: "6px 12px",
  borderRadius: "4px"
});

export default App;
