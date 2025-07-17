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
import axios from "axios";
import { utils, writeFile } from "xlsx";

const AdminAuditLog = () => {
  // Store logs returned from the API
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  // Loading flag for conditional rendering
  const [loading, setLoading] = useState(true);
  // Column filters
  const [actorFilter, setActorFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [detailsFilter, setDetailsFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Retrieve audit trail from the backend
        const res = await axios.get("https://api.redroomsim.com/audit/logs");
        setLogs(res.data);
        setFilteredLogs(res.data);
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

  useEffect(() => {
    const filtered = logs.filter((log) => {
      const matchesActor = log.actor
        ?.toLowerCase()
        .includes(actorFilter.toLowerCase());
      const matchesAction = log.action
        .toLowerCase()
        .includes(actionFilter.toLowerCase());
      const matchesDetails = (log.details || "")
        .toLowerCase()
        .includes(detailsFilter.toLowerCase());
      const logDate = new Date(log.timestamp);
      const afterStart = startDate ? logDate >= new Date(startDate) : true;
      const beforeEnd = endDate
        ? logDate <= new Date(`${endDate}T23:59:59`)
        : true;
      return (
        matchesActor &&
        matchesAction &&
        matchesDetails &&
        afterStart &&
        beforeEnd
      );
    });
    setFilteredLogs(filtered);
  }, [actorFilter, actionFilter, detailsFilter, startDate, endDate, logs]);

  const exportExcel = () => {
    const rows = filteredLogs.map((log) => ({
      Actor: log.actor || "-",
      Action: log.action,
      Details: log.details || "-",
      Timestamp: new Date(log.timestamp).toLocaleString(),
    }));
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Audit Logs");
    writeFile(workbook, "audit_logs.xlsx");
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Admin Audit Log</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Filter actor"
              className="border p-2 rounded dark:bg-gray-900 dark:border-gray-600"
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter action"
              className="border p-2 rounded dark:bg-gray-900 dark:border-gray-600"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter details"
              className="border p-2 rounded dark:bg-gray-900 dark:border-gray-600"
              value={detailsFilter}
              onChange={(e) => setDetailsFilter(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded dark:bg-gray-900 dark:border-gray-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded dark:bg-gray-900 dark:border-gray-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              onClick={exportExcel}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Export Excel
            </button>
          </div>
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Actor</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Action</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Details</th>
                <th className="border dark:border-gray-600 px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border dark:border-gray-600 px-4 py-2">{log.actor ?? "-"}</td>
                  <td className="border dark:border-gray-600 px-4 py-2 capitalize">{log.action}</td>
                  <td className="border dark:border-gray-600 px-4 py-2">{log.details ?? "-"}</td>
                  <td className="border dark:border-gray-600 px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLog;
