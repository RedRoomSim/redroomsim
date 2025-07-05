/*
File:                 App.jsx
Path:                 /src/App.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Main application component that sets up routing and context providers for authentication and theming.
Changelog:
  - Initial setup for App component with routing and context providers.
*/



// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; 
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import RoleBasedRedirect from "./components/Auth/RoleBasedRedirect";
import SecureRoute from "./components/Auth/SecureRoute";
import RoleProtectedRoute from "./components/Auth/RoleProtectedRoute";
import Layout from "./components/Shared/Layout";
import Admin from "./pages/Admin";
import AdminPendingUsers from "./components/AdminPanel/AdminPendingUsers";
import AdminUserList from "./components/AdminPanel/AdminUserList";
import Dashboard from "./pages/Dashboard";
import ScenarioSelectorPage from "./pages/ScenarioSelectorPage";
import Simulation from "./pages/Simulation";
import Upload from "./pages/Upload";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";
import Underconstruction from "./pages/UnderConstruction";




const App = () => {
  return (

    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/redirect" element={<SecureRoute><RoleBasedRedirect /></SecureRoute>} />
            <Route path="/admin" element={<SecureRoute><RoleProtectedRoute allowedRoles={["admin"]}><Layout><Admin /></Layout></RoleProtectedRoute></SecureRoute>} />
            <Route path="/admin/pending-users" element={<SecureRoute><RoleProtectedRoute allowedRoles={["admin"]}><Layout><AdminPendingUsers /></Layout></RoleProtectedRoute></SecureRoute>} />
            <Route path="/admin/users" element={<SecureRoute><RoleProtectedRoute allowedRoles={["admin"]}><Layout><AdminUserList /></Layout></RoleProtectedRoute></SecureRoute>}/>
            <Route path="/dashboard" element={<SecureRoute><Layout><Dashboard /></Layout></SecureRoute>} />
            <Route path="/scenarios" element={<SecureRoute><Layout><ScenarioSelectorPage /></Layout></SecureRoute>} />
            <Route path="/upload" element={<SecureRoute><RoleProtectedRoute allowedRoles={["admin"]}><Layout><Upload /></Layout></RoleProtectedRoute></SecureRoute>}/>
            <Route path="/simulation/:scenarioId" element={<SecureRoute><Layout><Simulation /></Layout></SecureRoute>} />
            <Route path="/profile" element={<SecureRoute><Layout><ProfilePage /></Layout></SecureRoute>} />
            <Route path="/contact" element={<SecureRoute><Layout><ContactPage /></Layout></SecureRoute>} />
            <Route path="/help" element={<SecureRoute><Layout><HelpPage /></Layout></SecureRoute>} />
            <Route path="/settings" element={<SecureRoute><Layout><SettingsPage /></Layout></SecureRoute>} />
            <Route path="/underconstruction" element={<SecureRoute><RoleProtectedRoute allowedRoles={["admin"]}><Layout><Underconstruction /></Layout></RoleProtectedRoute></SecureRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

