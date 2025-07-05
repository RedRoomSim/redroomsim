import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // Adjust the path as necessary

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-red-700 text-black shadow-md w-full">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">

        {/* LEFT: Logo fully flushed */}
        <div className="flex items-center space-x-3">
          
          <Link to="/"><img src={logo} alt="logo" className="h-30 w-40" /></Link>
        </div>

        {/* RIGHT: Nav links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/scenarios" className="hover:underline">Scenarios</Link>
          <Link to="/upload" className="hover:underline">Upload</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1">
          <Link to="/dashboard" className="block px-3 py-2 hover:bg-red-600 rounded">Dashboard</Link>
          <Link to="/scenarios" className="block px-3 py-2 hover:bg-red-600 rounded">Scenarios</Link>
          <Link to="/upload" className="block px-3 py-2 hover:bg-red-600 rounded">Upload</Link>
          <Link to="/admin" className="block px-3 py-2 hover:bg-red-600 rounded">Admin</Link>
        </div>
      )}
    </nav>

  );
};

export default Navbar;