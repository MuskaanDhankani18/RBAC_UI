import React, { useState, useEffect, Component } from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location.state"+location.state);
  const username = location.state?.username || null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };


  return (
    <div className={`dashboard ${isDarkTheme ? "dark-theme" : ""}`}>
      {/* Top Navbar */}
      <header className="dashboard-header">
      <h1>Welcome, {username}!</h1>
        <nav>
          <ul>
            <li>
            <button className="theme-toggle" onClick={handleLogout}>Logout</button >
            </li>
          </ul>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </header>

      {/* Sidebar */}
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <ul>
            <li>
              <Link to="user-management">Manage Users</Link>
            </li>
            <li>
              <Link to="role-management">Manage Roles</Link>
            </li>
            <li>
              <Link to="permission-management">Manage Permissions</Link>
            </li>
            <li>
              <Link to="reports">Reports</Link>
            </li>
          </ul>
        </aside>
        {/* Main Content Area */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default Dashboard;
