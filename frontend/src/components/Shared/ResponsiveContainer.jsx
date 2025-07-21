import React from "react";

/**
 * ResponsiveContainer limits the width of its children and centers content.
 * It applies horizontal padding that adjusts across breakpoints.
 */
const ResponsiveContainer = ({ children }) => (
  <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default ResponsiveContainer;
