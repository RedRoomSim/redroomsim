/*
File:                 SettingsPage.jsx
Path:                 /src/pages/SettingsPage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-19
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          User settings and preferences screen.
Changelog:
  - Initial setup for SettingsPage component.
  - Added dark mode toggle functionality.
  - Implemented password reset functionality.
  - Added email verification functionality.
  - Integrated password strength meter.
  - Improved user experience with toast notifications.
*/

import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

// Function to check if the password is strong
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  return strength;
};

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { logPasswordChange } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setIsError(false);
  };

const handlePasswordReset = async () => {
    if (!auth.currentUser?.email) return;
    if (!isStrongPassword(newPassword)) {
      setMessage("New password must include upper, lower case, number, special character and be at least 8 characters long.");
      setIsError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setIsError(true);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      await logPasswordChange();
      setMessage("Password updated successfully.");
      setIsError(false);
      // setCurrentPassword("");
      // setNewPassword("");
      // setConfirmPassword("");

      setTimeout(() => {
        resetFields();
        setShowToast(false);
        // setMessage("");
        // setIsError(false);
      }, 1500);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-gray-900 dark:text-white">
            <div className="flex items-center justify-between">
            <span className="font-medium">Enable Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={theme === "dark"} onChange={toggleTheme}/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{theme === "dark" ? "On" : "Off"}</span>
            </label>
            </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Password</label>
          <button onClick={() => setShowToast(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Reset Password
          </button>
        </div>

        {showToast && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl p-6 rounded-xl z-50 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reset Password</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"/>
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"/>
              {newPassword && (
                <div className="w-full h-2 rounded mt-1 bg-gray-300 dark:bg-gray-700">
                  <div className={`h-2 rounded transition-all ${getPasswordStrength(newPassword) <= 2 ? "bg-red-500" : getPasswordStrength(newPassword) === 3 ? "bg-yellow-500" : getPasswordStrength(newPassword) === 4 ? "bg-blue-500" : "bg-green-600"}`} style={{ width: `${getPasswordStrength(newPassword) * 20}%` }}></div>
              </div>
            )}
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"/>
              {message && (<div className={`text-sm mt-2 ${isError ? "text-red-600" : "text-green-600"}`}>{message}</div>)}
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => {setShowToast(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setMessage(""); setIsError(false);}} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded">
                  Cancel
                </button>
                <button onClick={handlePasswordReset} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

  );
};

export default SettingsPage;