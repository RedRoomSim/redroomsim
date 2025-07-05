/*
File:                 RoleProtectedRoute.jsx
Path:                 /src/components/Auth/RoleProtectedRoute.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for role-based route protection in the Red Room Simulation application.
Changelog:
 - Initial setup for RoleProtectedRoute component.
 - Implemented role-based access control (RBAC) enforcement.
 - Improved user experience with seamless navigation.
 - Added error handling for unauthorized access.
 - Ensured users are redirected to the correct page based on their roles.
*/

// Import necessary libraries
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * RoleProtectedRoute component checks if the user has the required role to access a route.
 * If the user is not authenticated, it redirects to the login page.
 * If the user does not have the required role, it redirects to the dashboard.
 * If the user has the required role, it renders the children components.
 **/
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();

  // Check if the user is authenticated. If not, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const userRole = role?.toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
  // Check if the user's role is allowed. If not, redirect to the dashboard
  if (!normalizedAllowed.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If the user has the required role, render the children components
  return children;
};

export default RoleProtectedRoute;
