/*
File:                 ArtifactPreview.jsx
Path:                 /src/components/EvidenceModule/ArtifactPreview.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Artifact preview component for displaying submitted files in the evidence module.
Changelog:
 - Initial setup for ArtifactPreview component.
*/

import React from "react";

const ArtifactPreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 border rounded shadow">
      <h3 className="font-semibold mb-2">Upload Summary</h3>
      <p><strong>File:</strong> {data.filename}</p>
      <p><strong>Size:</strong> {data.size} bytes</p>
      <p><strong>Uploaded:</strong> {new Date(data.upload_time).toLocaleString()}</p>
    </div>
  );
};

export default ArtifactPreview;