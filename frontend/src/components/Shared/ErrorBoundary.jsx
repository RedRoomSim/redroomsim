/*
File:                 ErrorBoundary.jsx
Path:                 /src/components/Shared/ErrorBoundary.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          ErrorBoundary component to catch JavaScript errors in child components and display a fallback UI.
Changelog:
 - Initial setup for ErrorBoundary component.
 - Implemented error handling to display a user-friendly message when an error occurs.
*/

// Import necessary libraries and components
import React from "react";

// ErrorBoundary component catches errors in its child components and displays a fallback UI
class ErrorBoundary extends React.Component {
  // Constructor initializes the state to track if an error has occurred
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // Lifecycle method to catch errors in child components
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Lifecycle method to log the error details (optional)
  render() {
    if (this.state.hasError) {
      return <h1 className="text-center text-red-500">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Export the ErrorBoundary component for use in other parts of the application
export default ErrorBoundary;
