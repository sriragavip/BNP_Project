import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [yesterdayFile, setYesterdayFile] = useState(null);
  const [todayFile, setTodayFile] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [deltaValues, setDeltaValues] = useState(null);

  // Handle file input changes
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'yesterday') setYesterdayFile(file);
    else setTodayFile(file);
  };

  // Handle file upload to backend
  const handleUpload = async () => {
    if (!yesterdayFile || !todayFile) {
      alert('Please select both files!');
      return;
    }

    const formData = new FormData();
    formData.append('yesterday_file', yesterdayFile);
    formData.append('today_file', todayFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Assuming response contains the paths of the comparison and delta files
      setComparisonResults(response.data.comparison_results);
      setDeltaValues(response.data.delta_values);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <h1>Upload Today's and Yesterday's Data</h1>
      <input 
        type="file" 
        onChange={(e) => handleFileChange(e, 'yesterday')} 
      />
      <input 
        type="file" 
        onChange={(e) => handleFileChange(e, 'today')} 
      />
      <button onClick={handleUpload}>Upload and Process</button>

      {/* Comparison Results Section */}
      {comparisonResults && (
        <div>
          <h2>Comparison Results</h2>
          <a href={`http://localhost:5000/${comparisonResults}`} target="_blank" rel="noopener noreferrer">
            Download Comparison Results
          </a>
        </div>
      )}

      {/* Delta Values Section */}
      {deltaValues && (
        <div>
          <h2>Delta Values</h2>
          <a href={`http://localhost:5000/${deltaValues}`} target="_blank" rel="noopener noreferrer">
            Download Delta Values
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
