/*
File:                 RoleBasedRedirect.jsx
Path:                 /src/components/Auth/RoleBasedRedirect.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for role-based redirection in the Red Room Simulation application.
Changelog:
 - Initial setup for RoleBasedRedirect component.
 - Implemented redirection logic based on user roles.
 - Improved user experience with seamless navigation.
 - Added error handling for undefined roles.
 - Ensured users are redirected to the correct page after login.
*/

// Import necessary libraries
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RoleBasedRedirect = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    else if (role === "student") navigate("/dashboard");
    else navigate("/login");
  }, [role]);

  return null;
};

export default RoleBasedRedirect;