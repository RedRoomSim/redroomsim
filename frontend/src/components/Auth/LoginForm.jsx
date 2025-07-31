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
  - Displays session expiration message after automatic logout.
 */
 
 

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import bg from "../../assets/bg-login.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logoutMsg, setLogoutMsg] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const reason = localStorage.getItem("logoutReason");
    if (reason === "inactive") {
      setLogoutMsg("You have been logged out due to inactivity.");
    } else if (reason === "session_expired") {
      setLogoutMsg("Your session has expired. Please log in again.");
    }
    if (reason) {
      localStorage.removeItem("logoutReason");
    }
    // Automatically show form on mobile where scrolling may not trigger
    if (window.innerWidth <= 768) {
      setScrolled(true);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
       className="min-h-[120vh] md:min-h-screen overflow-y-auto bg-no-repeat bg-cover bg-center text-white pb-[90vh] md:pb-[60vh]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="h-screen flex items-center justify-center relative">
        <img
          src={logo}
          alt="Red Room Simulation"
          className="fixed left-1/2 transition-[top,transform] duration-500 ease-in-out"
          style={{
            top: scrolled ? "1rem" : "50%",
            transform: scrolled
              ? "translateX(-50%) scale(0.4)"
              : "translate(-50%, -50%) scale(1)",
            height: "35vh",
            zIndex: 20,
          }}
        />
      </div>
      <div

        className={`relative md:fixed md:left-0 md:right-0 md:top-[30vh] flex flex-col lg:flex-row items-center lg:items-start justify-between space-y-8 lg:space-y-0 px-4 lg:px-20 py-10 transition-opacity duration-500 ${scrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}

        style={{ zIndex: 1 }}
    >

        <div className="lg:w-1/2 lg:pr-2 mb-10 lg:mb-0 text-center lg:text-left"> {/*hidden md:block">*/}
          <h1 className="text-4xl font-bold mb-6">
            Train Like a Real Analyst. Think Like a Threat Actor.
          </h1>
          <p className="mb-4">
            RedRoomSim is an interactive browser-based training platform built for cyber threat intelligence (CTI) professionals.
          </p>
          <p className="mb-4">
            Step into realistic simulations inspired by real-world threat reports, dark web intelligence, and curated feeds.
          </p>
          <p>
            Sharpen your triage and incident response skills under pressure—with real-time feedback that turns theory into action.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-70 p-8 rounded shadow-md w-full lg:w-1/2 space-y-4"
        >
          {logoutMsg && <div className="text-green-400 text-center">{logoutMsg}</div>}
          {error && <div className="text-red-400 text-center">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Login
          </button>
          <div className="text-center mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-400 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
