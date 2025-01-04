import  { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedLink, setUploadedLink] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      
      const response = await axios.post("http://localhost:5173/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
      setUploadedLink(response.data.link);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file!");
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" />

      <input type="file" onChange={handleFileChange} /> 
       <button onClick={handleUpload}>Upload</button>

      {uploadedLink && (
        <div>
          <p>File uploaded successfully! Here’s the link:</p>
          <a href={uploadedLink} target="_blank" rel="noopener noreferrer">
            {uploadedLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
