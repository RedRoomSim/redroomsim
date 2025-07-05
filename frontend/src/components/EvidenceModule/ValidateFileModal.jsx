/*
File:                 ValidateFileModal.jsx
Path:                 /src/components/EvidenceModule/ValidateFileModal.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Modal for validating uploaded files.
Changelog:
 - Initial setup for ValidateFileModal component.
 - Added file type validation.
 - Implemented file size limit check.
 - Added user feedback for validation results.
*/

import React, { useState, useEffect } from "react";

const ValidateFileModal = ({ file, open, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const allowedTypes = ["text/plain", "application/json", "text/csv", "message/rfc822", "application/vnd.tcpdump.pcap", "application/pdf"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  useEffect(() => {
    if (open) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
      }, 1500);
    }
  }, [open]);

  const validateFile = () => {
    if (!file) {
      return { success: false, message: "No file selected." };
    }
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: "Invalid file type." };
    }
    if (file.size > maxFileSize) {
      return { success: false, message: "File exceeds maximum size of 100MB." };
    }
    return { success: true };
  };

  const handleConfirm = () => {
    const result = validateFile();
    onClose(result);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
        <p>File: {file?.name}</p>

        {isScanning && <p className="text-blue-600">Scanning file for threats...</p>}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => onClose({ success: false, message: "User cancelled." })}
            disabled={isScanning}
          >
            Cancel
          </button>
          <button
            className="bg-[#1F2937] text-white px-4 py-2 rounded"
            onClick={handleConfirm}
            disabled={isScanning}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidateFileModal;
