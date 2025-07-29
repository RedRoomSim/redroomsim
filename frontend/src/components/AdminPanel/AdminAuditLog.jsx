/*
File:                 AdminAuditLog.jsx
Path:                 /src/components/AdminPanel/AdminAuditLog.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component to display admin audit logs.
Changelog:
 - Initial setup for Admin Audit Log component.
 - Mock data for demonstration purposes.
*/

// Import necessary Firebase modules
import React, { useEffect, useState } from "react";
import useTableSortResize from "../../hooks/useTableSortResize";
import axios from "axios";
import { saveAs } from "file-saver";

const AdminAuditLog = () => {
  // Store logs returned from the API
  const [logs, setLogs] = useState([]);
  // Loading flag for conditional rendering
  const [loading, setLoading] = useState(true);
  // Filter fields
  const [filters, setFilters] = useState({
    actor: "",
    action: "",
    details: "",
    screen: "",
    startDate: "",
    endDate: "",
  });

  const {
    sortConfig,
    handleSort,
    columnWidths,
    sortData,
    getSortSymbol,
  } = useTableSortResize({
      actor: 150,
      action: 120,
      details: 200,
      screen: 120,
      timestamp: 200,
    });

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredLogs = logs.filter((log) => {
    const actorMatch = log.actor
      ? log.actor.toLowerCase().includes(filters.actor.toLowerCase())
      : filters.actor === "";
    const actionMatch = log.action
      .toLowerCase()
      .includes(filters.action.toLowerCase());
    const detailsMatch = log.details
      ? log.details.toLowerCase().includes(filters.details.toLowerCase())
      : filters.details === "";
    const screenMatch = log.screen
      ? log.screen.toLowerCase().includes(filters.screen.toLowerCase())
      : filters.screen === "";
    const startMatch = filters.startDate
      ? new Date(log.timestamp) >= new Date(filters.startDate)
      : true;
    const endMatch = filters.endDate
      ? new Date(log.timestamp) <= new Date(filters.endDate)
      : true;
    return (
      actorMatch &&
      actionMatch &&
      detailsMatch &&
      screenMatch &&
      startMatch &&
      endMatch
    );
  });

  const sortedLogs = sortData(filteredLogs);
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Pagination helpers
  const pageGroup = Math.floor((currentPage - 1) / 5);
  const startPage = pageGroup * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const downloadExcel = async () => {
    if (!filters.startDate || !filters.endDate) return;
    try {
      const res = await axios.get(
        "https://api.redroomsim.com/audit/export",
        {
          params: {
            start_date: filters.startDate,
            end_date: filters.endDate,
          },
          responseType: "blob",
        },
      );
      saveAs(res.data, "audit_logs.xlsx");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to download logs", err);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Retrieve audit trail from the backend
        const res = await axios.get("https://api.redroomsim.com/audit/logs");
        setLogs(res.data);
        setCurrentPage(1);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    // Run once on mount
    fetchLogs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Admin Audit Log</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
           <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              name="actor"
              placeholder="Filter actor"
              value={filters.actor}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="action"
              placeholder="Filter action"
              value={filters.action}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="details"
              placeholder="Filter details"
              value={filters.details}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              name="screen"
              placeholder="Filter screen"
              value={filters.screen}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={downloadExcel}
              className=" bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Download
            </button>
          </div>
          <table className="w-full border-collapse table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th
                  style={{ width: columnWidths.actor }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort('actor')}
                    >
                      Actor {getSortSymbol('actor')}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.action }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort('action')}
                    >
                      Action {getSortSymbol('action')}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.details }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort('details')}
                    >
                      Details {getSortSymbol('details')}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
                <th
                  style={{ width: columnWidths.screen }}
                  className="border dark:border-gray-600 px-4 py-2 text-left"
                >
                  <div className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => handleSort('screen')}
                    >
                      Screen {getSortSymbol('screen')}
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
                      onClick={() => handleSort('timestamp')}
                    >
                      Timestamp {getSortSymbol('timestamp')}
                    </span>
                    {/* Resizer removed */}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td style={{ width: columnWidths.actor }} className="border dark:border-gray-600 px-4 py-2">{log.actor ?? "-"}</td>
                  <td style={{ width: columnWidths.action }} className="border dark:border-gray-600 px-4 py-2 capitalize">{log.action}</td>
                  <td style={{ width: columnWidths.details }} className="border dark:border-gray-600 px-4 py-2">{log.details ?? "-"}</td>
                  <td style={{ width: columnWidths.screen }} className="border dark:border-gray-600 px-4 py-2">{log.screen ?? "-"}</td>
                  <td style={{ width: columnWidths.timestamp }} className="border dark:border-gray-600 px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                      ? "bg-blue-500 text-white"
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
      )}
    </div>
  );
};

export default AdminAuditLog;
