/*
File:                 UploadEvidence.jsx
Path:                 /src/components/EvidenceModule/UploadEvidence.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Evidence upload component.
Changelog:
  - Initial setup for UploadEvidence component.
*/

import React, { useState } from "react";
import axios from "axios";
import ArtifactPreview from "./ArtifactPreview";

const UploadEvidence = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/sim/upload-scenario", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResult(response.data);
      setError("");
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Evidence File</h2>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Upload
      </button>

      {error && <div className="text-red-600 mt-3">{error}</div>}
      {uploadResult && <ArtifactPreview data={uploadResult} />}
    </div>
  );
};

export default UploadEvidence;