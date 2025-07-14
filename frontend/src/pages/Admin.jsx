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
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const Admin = () => {
  const [hasPendingUsers, setHasPendingUsers] = useState(false);

  useEffect(() => {
    const checkPendingUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const pending = querySnapshot.docs.some(doc => doc.data().role === "pending");
      setHasPendingUsers(pending);
    };
    checkPendingUsers();
  }, []);


  return (
    <div className="p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {hasPendingUsers && (
        <div className="bg-yellow-100 dark:bg-yellow-300 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-900 p-4 mb-6 flex justify-between items-center rounded">
          <div>There are users pending approval.</div>
          <Link
            to="/admin/pending-users"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Review
          </Link>
        </div>
      )}

      <p>Select an option from the sidebar.</p>
    </div>
  );
};

export default Admin;
