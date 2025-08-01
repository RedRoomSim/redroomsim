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
import useTableSortResize from "../../hooks/useTableSortResize";
import axios from "axios";

const UserMonitoringTable = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const {
    sortConfig,
    handleSort,
    columnWidths,
    sortData,
    getSortSymbol,
  } = useTableSortResize({ email: 150, role: 120, event: 150, timestamp: 200 });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("https://api.redroomsim.com/logs/login-activity");
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

  const sortedLogs = sortData(filteredLogs);
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Pagination helpers
  const pageGroup = Math.floor((currentPage - 1) / 5);
  const startPage = pageGroup * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

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
          <table className="w-full border-collapse table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th
                  style={{ width: columnWidths.email }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email {getSortSymbol("email")}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.role }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      Role {getSortSymbol("role")}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.event }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort("event")}
                    >
                      Event {getSortSymbol("event")}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.timestamp }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort("timestamp")}
                    >
                      Timestamp {getSortSymbol("timestamp")}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td style={{ width: columnWidths.email }} className="border dark:border-gray-600 px-4 py-2">{log.email}</td>
                  <td style={{ width: columnWidths.role }} className="border dark:border-gray-600 px-4 py-2">{log.role}</td>
                  <td style={{ width: columnWidths.event }} className="border dark:border-gray-600 px-4 py-2 capitalize">{log.event}</td>
                  <td style={{ width: columnWidths.timestamp }} className="border dark:border-gray-600 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {startPage > 1 && (
            <button
              onClick={() => setCurrentPage(startPage - 1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              {'<<'}
            </button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
            const pageNum = startPage + idx;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${currentPage === pageNum
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"}`}
              >
                {pageNum}
              </button>
            );
          })}
          {endPage < totalPages && (
            <button
              onClick={() => setCurrentPage(endPage + 1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              {'>>'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMonitoringTable;
