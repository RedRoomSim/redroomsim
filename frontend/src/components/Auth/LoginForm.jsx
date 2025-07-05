/*
File:                 LoginForm.jsx
Path:                 /src/components/Auth/LoginForm.jsx
Author:               Umair Asad
Last Modified:        2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for user login functionality in the Red Room Simulation application.
Changelog:
 - Initial setup for LoginForm component.
 - Integrated Firebase authentication.
 - Added error handling for login failures.
 - Redirects users based on their role after successful login.
 - Displays logout message if user was previously logged out.
 - Added link to registration page for new users.
 - Improved UI with Tailwind CSS for better user experience.
 - Added logo and title for branding.
 - Implemented dark mode support for better accessibility.
 - Added loading state during authentication process.
 - Implemented form validation for username and password fields.
 - Fixed redirect logic to ensure users are redirected to the correct page after login.
*/


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate("/redirect");
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "Login error.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 space-y-4">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Red Room Simulation" className="h-16 w-16" />
        </div>

        <h2 className="text-2xl font-bold text-center">Red Room Simulation</h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        />

        <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
          Login
        </button>

        <div className="text-center mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;