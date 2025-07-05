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
    designation: ""
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
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleRegister} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 space-y-4">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Red Room Simulation" className="h-16 w-16" />
        </div>

        <h2 className="text-2xl font-bold text-center dark:text-white">Red Room Simulation - Register</h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />

        <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
          Register
        </button>

        <div className="text-center mt-2 dark:text-white">
          Already have an account?{" "}
          <span className="text-red-600 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
            Login here
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;