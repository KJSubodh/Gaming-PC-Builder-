import React, { useState } from "react";
import axios from "axios";
import '../styles/JsonUploader.css';

const JsonUploader = () => {
  const [jsonName, setJsonName] = useState("");
  const [storageType, setStorageType] = useState("");
  const [data, setData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  // Define the fields for each JSON type
  const jsonFields = {
    cases: ["Name", "Price", "Specs"],
    cooling: ["Category", "Name", "Price"],
    cpu: ["name", "cores_threads", "clock_speed", "price", "description"],
    custom_PC: ["PC_Type", "Price", "CPU", "GPU", "Motherboard", "RAM", "Primary_Storage", "Secondary_Storage", "Case", "Cooling"],
    gpu: ["name", "specs", "features", "pricing (INR)"],
    headphones: ["name", "wireless", "mic", "rgb", "price", "connectivity"],
    keyboards: ["name", "RGB", "type", "USB", "price"],
    mb: ["name", "specs", "features", "pricing (INR)"],
    mice: ["Name", "DpI", "Hz", "price", "Description"],
    microphone: ["name", "price", "connectivity", "pickup_pattern", "rgb_lighting", "description"],
    monitor: ["brand", "model", "size", "resolution", "refresh_rate_hz", "response_time_ms", "panel_type", "features", "price"],
    psu: ["name", "wattage", "voltage", "pricing (INR)"],
    ram: ["name", "GB", "speed", "LP", "pricing (INR)"],
    storage: ["Name", "Price (INR)"],
    webcam: ["name", "resolution", "fps", "price"],
  };

  // Define storage types
  const storageTypes = ["NVMe PCIe M.2 (Primary Storage)", "SATA III SSD (Secondary Storage)", "HDD (Secondary Storage)"];

  // Define cooling categories
  const coolingCategories = [
    "Air CPU Coolers",
    "Liquid CPU Coolers",
    "Case Fans",
    "Thermal Paste",
    "Cable Management",
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:7000/upload-image", formData);
      setImageUrl(response.data.imageUrl);
      setMessage("Image uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = { ...data };

      // Format price for mice.json
      if (jsonName === "mice" && jsonData.price) {
        jsonData.price = `₹${jsonData.price}`;
      }

      // Parse DpI and Hz as numbers for mice.json
      if (jsonName === "mice") {
        jsonData.DpI = parseInt(jsonData.DpI, 10);
        jsonData.Hz = parseInt(jsonData.Hz, 10);
      }

      // Add image URL to the data
      if (imageUrl) {
        jsonData.urls = [imageUrl];
      }

      // Use a different endpoint for storage
      const endpoint = jsonName === "storage" ? "/update-storage" : "/update-json";

      // For cooling, we need to handle the nested structure
      if (jsonName === "cooling") {
        const category = jsonData.Category; // Get the selected category
        delete jsonData.Category; // Remove the category from the data object

        // Prepare the data to be added to the specific category
        const coolingData = {
          [category]: [jsonData],
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: coolingData,
        });
      } else if (jsonName === "cases") {
        // For cases, append to the "Gaming PC Cases" object
        const casesData = {
          "Gaming PC Cases": {
            [jsonData.Category]: [jsonData],
          },
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: casesData,
        });
      } else if (jsonName === "cpu") {
        // For cpu, append to the "gaming_cpus" array
        const cpuData = {
          gaming_cpus: [jsonData],
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: cpuData,
        });
      } else if (jsonName === "headphones") {
        // For headphones, append to the "GamingHeadphones/Earphones" array
        const headphonesData = {
          "GamingHeadphones/Earphones": [jsonData],
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: headphonesData,
        });
      } else if (jsonName === "microphone") {
        // For microphone, append to the "microphones" array
        const microphoneData = {
          microphones: [jsonData],
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: microphoneData,
        });
      } else if (jsonName === "webcam") {
        // For webcam, append to the "webcams" array
        const webcamData = {
          webcams: [jsonData],
        };

        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          data: webcamData,
        });
      } else {
        // For other JSON types, send the data as is
        await axios.post(`http://localhost:7000${endpoint}`, {
          jsonName,
          storageType, // Include storageType for storage-specific updates
          data: jsonData,
        });
      }

      setMessage("Data updated successfully!");
    } catch (error) {
      setMessage("Failed to update data.");
    }
  };

  const handleInputChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="json-uploader">
      <h1>JSON Data Uploader</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select JSON:
          <select value={jsonName} onChange={(e) => setJsonName(e.target.value)} required>
            <option value="">Select a JSON</option>
            {Object.keys(jsonFields).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Render storage type dropdown if "storage" is selected */}
        {jsonName === "storage" && (
          <>
            <label>
              Select Storage Type:
              <select value={storageType} onChange={(e) => setStorageType(e.target.value)} required>
                <option value="">Select a storage type</option>
                {storageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <br />
          </>
        )}

        {/* Render cooling category dropdown if "cooling" is selected */}
        {jsonName === "cooling" && (
          <>
            <label>
              Select Cooling Category:
              <select value={data.Category || ""} onChange={(e) => handleInputChange("Category", e.target.value)} required>
                <option value="">Select a cooling category</option>
                {coolingCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <br />
          </>
        )}

        {jsonName && (
          <>
            {jsonFields[jsonName].map((field) => (
              <label key={field}>
                {field}:
                <input
                  type="text"
                  value={data[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required
                />
              </label>
            ))}
            <br />
          </>
        )}

        <label>
          Upload Image:
          <input type="file" onChange={handleImageUpload} accept="image/*" />
        </label>
        <br />
        {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: "100px" }} />}
        <br />
        <button type="submit">Upload Data</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JsonUploader;