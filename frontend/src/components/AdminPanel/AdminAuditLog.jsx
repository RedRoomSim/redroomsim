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
import React from "react";

const AdminAuditLog = () => {
  const mockLogs = [
    { action: "Created new scenario", timestamp: "2025-05-20 12:00" },
    { action: "Updated difficulty settings", timestamp: "2025-05-22 15:45" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Admin Audit Log</h2>
      <ul className="space-y-2">
        {mockLogs.map((log, index) => (
          <li key={index} className="border dark:border-gray-600 p-2 rounded">
            <p>{log.action}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAuditLog;
