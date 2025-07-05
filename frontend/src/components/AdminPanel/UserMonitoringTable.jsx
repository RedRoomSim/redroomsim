/*
File:                 UserMonitoringTable.jsx
Path:                 /src/components/AdminPanel/UserMonitoringTable.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component to display user monitoring data.
Changelog:
 - Initial setup for User Monitoring Table component.
 - Mock data for demonstration purposes.
 - Styled with Tailwind CSS for consistent UI.
 - Integrated with Firebase for real-time data fetching.
  - Added search functionality for filtering logs by email or role.
  - Implemented CSV export functionality for user activity logs.
  - Added pagination for better user experience.
  - Added metrics for total logs, logins today, password changes, and logouts. 
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

const UserMonitoringTable = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/logs/login-activity");
        setLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch login activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = logs.filter(
      (log) =>
        log.email.toLowerCase().includes(term) ||
        log.role.toLowerCase().includes(term)
    );
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [search, logs]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const exportCSV = () => {
    const headers = "Email,Role,Event,Timestamp\n";
    const rows = filteredLogs.map(
      (log) =>
        `"${log.email}","${log.role}","${log.event}","${new Date(
          log.timestamp
        ).toLocaleString()}"`
    );
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_login_logs.csv";
    link.click();
  };

  // Metrics
  const totalLogs = logs.length;
  const totalLoginsToday = logs.filter((log) => {
    const today = new Date().toDateString();
    return log.event === "login" && new Date(log.timestamp).toDateString() === today;
  }).length;
  const totalLogouts = logs.filter((log) => {
    const today = new Date().toDateString();
    return log.event === "logout" && new Date(log.timestamp).toDateString() === today;
  }).length;
  const totalFailedLogin = logs.filter((log) => log.event === "failed_login").length;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">User Monitoring</h2>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
          <p className="text-sm">Total Logs</p>
          <p className="text-lg font-bold">{totalLogs}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
          <p className="text-sm">Failed login</p>
          <p className="text-lg font-bold">{totalFailedLogin}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
          <p className="text-sm">Logins Today</p>
          <p className="text-lg font-bold">{totalLoginsToday}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
          <p className="text-sm">Logouts Today</p>
          <p className="text-lg font-bold">{totalLogouts}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/2 dark:bg-gray-900 dark:border-gray-600"
        />
        <button
          onClick={exportCSV}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : currentLogs.length === 0 ? (
        <p>No user activity found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Email</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Role</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Event</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border dark:border-gray-600 px-4 py-2">{log.email}</td>
                  <td className="border dark:border-gray-600 px-4 py-2">{log.role}</td>
                  <td className="border dark:border-gray-600 px-4 py-2 capitalize">{log.event}</td>
                  <td className="border dark:border-gray-600 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMonitoringTable;
