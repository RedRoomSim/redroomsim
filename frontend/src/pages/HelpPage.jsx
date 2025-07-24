/*
File:                 HelpPage.jsx
Path:                 /src/pages/HelpPage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Help and FAQ page.
Changelog:
 - Initial setup for HelpPage component.
*/


// Import necessary libraries and components
import React from "react";
import { faqs } from "../data/faqs";

/**
 * Help / FAQ page.
 */
const HelpPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Help & FAQ</h1>
      {faqs.map((faq) => (
        <details
          key={faq.id}
          className="bg-white dark:bg-gray-800 rounded-md shadow p-4"
        >
          <summary className="cursor-pointer font-semibold">
            {faq.question}
          </summary>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default HelpPage;
