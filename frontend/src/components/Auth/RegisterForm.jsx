/*
File:                 RegisterForm.jsx
Path:                 /src/components/Auth/RegisterForm.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for user registration functionality in the Red Room Simulation application.
Changelog:
 - Initial setup for RegisterForm component.
 - Integrated Firebase authentication.
 - Added error handling for registration failures.
 - Displays success message after successful registration.
 - Improved UI with Tailwind CSS for better user experience.
 - Added strong password validation.
 - Implemented form validation for required fields.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import bg from "../../assets/bg-login.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";

// Strong password check function
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isStrongPassword(form.password)) {
      setError("Password must include upper, lower case, number, special character and be at least 8 characters long.");
      return;
    } else {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
          const uid = userCred.user.uid;

          // Store user profile in Firestore with role = pending
          await setDoc(doc(db, "users", uid), {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            designation: form.designation,
            role: "pending",
            createdAt: new Date().toISOString(),
            failedAttempts: 0,
            disabled: false
          });

          navigate("/login", {
            state: { message: "Registration successful! Awaiting admin approval." }
          });
        } catch (err) {
          console.error(err);
          setError("Registration failed: " + err.message);
        }
      }
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="h-screen flex items-center justify-center relative">
        <img
          src={logo}
          alt="Red Room Simulation"
          className="fixed left-1/2 transition-[top,transform] duration-500 ease-in-out"
          style={{
            top: "1rem",
            transform: "translateX(-50%) scale(0.4)",
            height: "35vh",
            zIndex: 20,
          }}
        />
      </div>
      <div
        className="fixed left-0 right-0 top-[30vh] flex flex-col md:flex-row items-start justify-between px-4 md:px-20 py-10"
        style={{ zIndex: 1 }}
      >
        <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0">
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
        <form onSubmit={handleRegister} className="bg-black bg-opacity-70 p-8 rounded shadow-md w-full md:w-1/2 space-y-4">
          {error && <div className="text-red-400 text-center">{error}</div>}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
            required
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-700 bg-opacity-50"
            required
          />
          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
            Register
          </button>
          <div className="text-center mt-2">
            Already have an account?{' '}
            <span className="text-red-400 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;