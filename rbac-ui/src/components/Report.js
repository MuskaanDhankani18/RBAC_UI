// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
// import { saveAs } from "file-saver"; // For CSV export
// import "../styles/Report.css";
// import { jsPDF } from "jspdf";


// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const Reports = ({isDarkMode}) => {
//   const [reportData, setReportData] = useState([]);
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     user: "",
//     action: ""
//   });

//   // Simulate data fetching from an API
//   useEffect(() => {
//     // Replace with real API call to fetch report data
//       setReportData([
//         { date: "2024-11-20", user: "John Doe", action: "Created User", status: "Success" },
//         { date: "2024-11-21", user: "Jane Smith", action: "Updated Role", status: "Success" },
//         { date: "2024-11-22", user: "Alice Johnson", action: "Deleted User", status: "Failed" },
//         { date: "2024-11-23", user: "Bob Brown", action: "Created Role", status: "Success" }
//       ]);
//   }, []);

// // Handle Filter Change
// const handleFilterChange = (e) => {
//   setFilters({
//     ...filters,
//     [e.target.name]: e.target.value
//   });
// };

// // Filtered Data
// const filteredData = reportData.filter((entry) => {
//   const matchesDateRange =
//     (!filters.startDate || entry.date >= filters.startDate) &&
//     (!filters.endDate || entry.date <= filters.endDate);
//   const matchesUser = !filters.user || entry.user.includes(filters.user);
//   const matchesRole = !filters.role || entry.role.includes(filters.role);
//   const matchesAction = !filters.action || entry.action.includes(filters.action);
//   return matchesDateRange && matchesUser && matchesRole && matchesAction;
// });

//   // Chart.js Data
//   const chartData = {
//     labels: filteredData.map(entry => entry.date),
//     datasets: [
//       {
//         label: "Activity",
//         data: filteredData.map(entry => entry.status === "Success" ? 1 : 0),
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true
//       }
//     ]
//   };


//   // Export CSV
//   const exportCSV = () => {
//     const csvData = filteredData.map((entry) => ({
//       Date: entry.date,
//       User: entry.user,
//       Action: entry.action,
//       Status: entry.status
//     }));
//     const csv = "Date,User,Action,Status\n" + csvData.map(row => `${row.Date},${row.User},${row.Action},${row.Status}`).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     saveAs(blob, "activity_report.csv");
//   };

//   // Function to export to PDF
// const exportPDF = () => {
//   const doc = new jsPDF();
//   doc.text("Activity Report", 20, 20);
  
//   const reportText = filteredData.map((entry) => (
//     `Date: ${entry.date} | User: ${entry.user} | Action: ${entry.action} | Status: ${entry.status}`
//   ));

//   doc.text(reportText.join("\n"), 20, 30);
//   doc.save("activity_report.pdf");
// };

// // Add this button below the CSV export button in the render method
// <button className="export-button" onClick={exportPDF}>Export Report to PDF</button>


//   return (
//     <div className={`reports-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
//       <h2>Reports</h2>

//       {/* Filters Section */}
//       <div className="filters">
//         <label>
//           Start Date:
//           <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
//         </label>
//         <label>
//           End Date:
//           <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
//         </label>
//         <label>
//           User:
//           <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="Search by user..." />
//         </label>
//         <label>
//           Action:
//           <input type="text" name="action" value={filters.action} onChange={handleFilterChange} placeholder="Search by action..." />
//         </label>
//       </div>

//       {/* Data Table */}
//       <div className="report-section">
//         <h3>Activity Report</h3>
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>User</th>
//               <th>Action</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.date}</td>
//                 <td>{entry.user}</td>
//                 <td>{entry.action}</td>
//                 <td>{entry.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Chart Section */}
//       <div className="report-section">
//         <h3>User Engagement Trends</h3>
//         <div className="chart-container">
//           <Line data={chartData} />
//         </div>
//       </div>

//       {/* Export CSV Button */}
//       <button className="export-button" onClick={exportCSV}>Export Report to CSV</button>
//     </div>
//   );
// };

// export default Reports;





import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver"; // For CSV export
import "../styles/Report.css";
import { jsPDF } from "jspdf";
import { getReportData } from "./apiService"; // API function to fetch report data

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = ({ isDarkMode }) => {
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    user: "",
    action: "",
  });

  // Fetch report data, including newly added user actions
  const fetchReportData = async () => {
    const data = await getReportData(); // Assume this fetches the latest data
    setReportData(data);
  };

  useEffect(() => {
    fetchReportData();
  }, []); // Empty dependency ensures it fetches data once on mount

  // Handle Filter Change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Filtered Data
  const filteredData = reportData.filter((entry) => {
    const matchesDateRange =
      (!filters.startDate || entry.date >= filters.startDate) &&
      (!filters.endDate || entry.date <= filters.endDate);
    const matchesUser = !filters.user || entry.user.includes(filters.user);
    const matchesAction = !filters.action || entry.action.includes(filters.action);
    return matchesDateRange && matchesUser && matchesAction;
  });

  // Chart.js Data
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

  // Export CSV
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

  // Export PDF
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

  return (
    <div className={`reports-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <h2>Reports</h2>

      {/* Filters Section */}
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
            {filteredData.map((entry, index) => (
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

      {/* Chart Section */}
      <div className="report-section">
        <h3>User Engagement Trends</h3>
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      </div>

      {/* Export Buttons */}
      <button className="export-button" onClick={exportCSV}>
        Export Report to CSV
      </button>
      <button className="export-button" onClick={exportPDF}>
        Export Report to PDF
      </button>
    </div>
  );
};

export default Reports;

