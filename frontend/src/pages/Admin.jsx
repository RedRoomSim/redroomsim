/*
File:                 Admin.jsx
Path:                 /src/pages/Admin.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Admin panel landing page.
Changelog:
 - Initial setup for Admin panel.
 - Integrated user management features.
 - Added pending user approvals section.
*/

// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminUserList from "../components/AdminPanel/AdminUserList";
import AdminPendingUser from "../components/AdminPanel/AdminPendingUsers";
import AdminAuditLog from "../components/AdminPanel/AdminAuditLog";
import DifficultyAdjustment from "../components/AdminPanel/DifficultyAdjuster";
import ScenarioConfigurator from "../components/AdminPanel/ScenarioConfigurator";
import UserMonitoringTable from "../components/AdminPanel/UserMonitoringTable";
import { Users, Clock, FileText, Settings, Puzzle, Monitor } from "lucide-react";

const TABS = [
  { key: "manageUsers", label: "Manage Users", icon: Users },
  { key: "pendingUsers", label: "Pending Approvals", icon: Clock },
  { key: "monitoring", label: "User Monitoring", icon: Monitor },
  { key: "auditLog", label: "Audit Log", icon: FileText },
  { key: "scenarioConfig", label: "Scenario Configurator", icon: Puzzle },
  { key: "difficulty", label: "Difficulty Adjustment", icon: Settings },
];

const Admin = () => {
  const [hasPendingUsers, setHasPendingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("manageUsers");

  useEffect(() => {
    const checkPendingUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const pending = querySnapshot.docs.some(doc => doc.data().role === "pending");
      setHasPendingUsers(pending);
    };
    checkPendingUsers();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "pendingUsers":
        return <div className="mt-4"><AdminPendingUser /></div>;
      case "manageUsers":
        return <div className="mt-4"><AdminUserList /></div>;
      case "monitoring":
        return <div className="mt-4"><UserMonitoringTable /></div>;
      case "auditLog":
        return <div className="mt-4"><AdminAuditLog /></div>;
      case "difficulty":
        return <div className="mt-4"><DifficultyAdjustment /></div>;
      case "scenarioConfig":
        return <div className="mt-4"><ScenarioConfigurator /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {hasPendingUsers && (
        <div className="bg-yellow-100 dark:bg-yellow-300 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-900 p-4 mb-6 flex justify-between items-center rounded">
          <div>There are users pending approval.</div>
          <button
            onClick={() => setActiveTab("pendingUsers")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Review
          </button>
        </div>
      )}

      <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600 mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition-colors duration-200 ${
              activeTab === key
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:text-red-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="transition-opacity duration-300 ease-in-out">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;
