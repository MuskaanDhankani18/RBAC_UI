import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";


const Dashboard = () => {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };


  return (
    <div className={`dashboard ${isDarkTheme ? "dark-theme" : ""}`}>
      {/* Top Navbar */}
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
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

