/*
File:                 SecureRoute.jsx
Path:                 /src/components/Auth/SecureRoute.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for secure route protection in the Red Room Simulation application.
Changelog:
 - Initial setup for SecureRoute component.
 - Implemented authentication check for protected routes.
 - Improved user experience with seamless navigation.
  - Added loading state while checking authentication.
*/


// Import necessary libraries
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * SecureRoute component checks if the user is authenticated.
 * If not, it redirects to the login page.
 * If authenticated, it renders the children components.
 **/
const SecureRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  

  // Check if the user is authenticated. If not, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If the user is authenticated, render the children components
  return children;
};

export default SecureRoute;