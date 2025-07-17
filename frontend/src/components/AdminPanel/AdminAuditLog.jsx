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
        <ul className="space-y-2">
          {logs.map((log, index) => (
            // Display a single audit record
            <li key={index} className="border dark:border-gray-600 p-2 rounded">
              <p>{log.action}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAuditLog;
