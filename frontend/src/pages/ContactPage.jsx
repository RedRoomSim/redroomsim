/*
File:                 ContactPage.jsx
Path:                 /src/pages/ContactPage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Contact support information.
Changelog:
  - Initial setup for ContactPage component.
*/
import React from "react";

/**
 * Contact information page.
 */
const ContactPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p>If you need assistance, please contact our support team at <a href="mailto:support@redroomsim.com" className="text-red-500">support@redroomsim.com</a>.</p>
    </div>
  );
};

export default ContactPage;
