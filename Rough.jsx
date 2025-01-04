// import  { useState } from "react";
// import axios from "axios";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [uploadedLink, setUploadedLink] = useState("");

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
      
//       const response = await axios.get("http://127.0.0.1:8000/", {
//         // headers: {
//         //   "Content-Type": "multipart/form-data",
//         // },
//       });

      
//       setUploadedLink(response.data.link);
//       alert("File uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Failed to upload file!");
//     }
//   };

//   return (
//     <div>
//       <h1>File Upload</h1>
//       <input type="file" />

//       <input type="file" onChange={handleFileChange} /> 
//        <button onClick={handleUpload}>Upload</button>

//       {uploadedLink && (
//         <div>
//           <p>File uploaded successfully! Here’s the link:</p>
//           <a href={uploadedLink} target="_blank" rel="noopener noreferrer">
//             {uploadedLink}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
import React, { useState } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");
    const [itemResponse, setItemResponse] = useState(null);

    const fetchMessage = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/");
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error fetching message:", error);
        }
    };

    const createItem = async () => {
        try {
            const newItem = { name: "Laptop", price: 999.99, in_stock: true };
            const response = await axios.post("http://127.0.0.1:8000/items/", newItem);
            setItemResponse(response.data);
        } catch (error) {
            console.error("Error creating item:", error);
        }
    };

   

  


    return (
        <div>
            <button onClick={fetchMessage}>Fetch Message</button>
            <p>{message}</p>

            <button onClick={createItem}>Create Item</button>
            <pre>{itemResponse && JSON.stringify(itemResponse, null, 2)}</pre>
        </div>
    );
}

export default App;
