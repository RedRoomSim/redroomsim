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

const AdminAuditLog = () => {
  // Store logs returned from the API
  const [logs, setLogs] = useState([]);
  // Loading flag for conditional rendering
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Retrieve audit trail from the backend
        const res = await axios.get("https://api.redroomsim.com/audit/logs");
        setLogs(res.data);
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
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Admin Audit Log</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
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
              {logs.map((log, index) => (
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
