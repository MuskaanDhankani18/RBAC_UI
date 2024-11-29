import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,  
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { saveAs } from "file-saver";
import "../styles/Report.css";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { getReportData } from "./apiService"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,  
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = ({ isDarkMode }) => {
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    user: "",
    action: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  // Fetch report data
  const fetchReportData = async () => {
    const data = await getReportData(); 
    setReportData(data);
  };

  useEffect(() => {
    fetchReportData();
  }, []); // Empty dependency ensures it fetches data once on mount

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };


  const filteredData = reportData.filter((entry) => {
    const matchesDateRange =
      (!filters.startDate || entry.date >= filters.startDate) &&
      (!filters.endDate || entry.date <= filters.endDate);
    const matchesUser = !filters.user || entry.user.includes(filters.user);
    const matchesAction = !filters.action || entry.action.includes(filters.action);
    return matchesDateRange && matchesUser && matchesAction;
  });

  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  
  const chartData = {
    labels: filteredData.map((entry) => entry.date),
    datasets: [
      {
        label: "Activity Success",
        data: filteredData.map((entry) => (entry.status === "Success" ? 1 : 0)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };


  const barChartData = {
    labels: ["Login", "Logout", "Profile Update", "Password Change"], 
    datasets: [
      {
        label: "Action Count",
        data: [12, 19, 3, 5], 
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  
  const pieChartData = {
    labels: ["Success", "Failed", "Pending"],
    datasets: [
      {
        data: [
          filteredData.filter((entry) => entry.status === "Success").length,
          filteredData.filter((entry) => entry.status === "Failed").length,
          filteredData.filter((entry) => entry.status === "Pending").length,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
      },
    ],
  };


  const exportCSV = () => {
    const csvData = filteredData.map((entry) => ({
      Date: entry.date,
      User: entry.user,
      Action: entry.action,
      Status: entry.status,
    }));
    const csv =
      "Date,User,Action,Status\n" +
      csvData.map((row) => `${row.Date},${row.User},${row.Action},${row.Status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "activity_report.csv");
  };


  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity Report");
    XLSX.writeFile(wb, "activity_report.xlsx");
  };


  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Activity Report", 20, 20);

    const reportText = filteredData.map(
      (entry) =>
        `Date: ${entry.date} | User: ${entry.user} | Action: ${entry.action} | Status: ${entry.status}`
    );

    doc.text(reportText.join("\n"), 20, 30);
    doc.save("activity_report.pdf");
  };

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`reports-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h2>Reports</h2>

    
      <div className="filters">
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          User:
          <input
            type="text"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            placeholder="Search by user..."
          />
        </label>
        <label>
          Action:
          <input
            type="text"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            placeholder="Search by action..."
          />
        </label>
      </div>

      {/* Data Table */}
      <div className="report-section">
        <h3>Activity Report</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.user}</td>
                <td>{entry.action}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      
      <div className="report-section">
        <h3>User Engagement Trends (Line Chart)</h3>
        <div className="chart-container">
          <Line data={chartData} />
        </div>

        <h3>Action Distribution (Bar Chart)</h3>
        <div className="chart-container">
          <Bar data={barChartData} />
        </div>

        <h3>Status Distribution (Pie Chart)</h3>
        <div className="chart-container">
          <Pie data={pieChartData} />
        </div>
      </div>

    
      <div className="export-buttons">
        <button className="export-button" onClick={exportCSV}>
          Export Report to CSV
        </button>
        <button className="export-button" onClick={exportExcel}>
          Export Report to Excel
        </button>
        <button className="export-button" onClick={exportPDF}>
          Export Report to PDF
        </button>
      </div>
    </div>
  );
};

export default Reports;
