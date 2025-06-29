const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Endpoint to handle JSON updates
app.post("/update-json", (req, res) => {
  const { jsonName, data } = req.body;

  // Validate jsonName
  const validJsonNames = [
    "cases",
    "cooling",
    "cpu",
    "custom_PC",
    "gpu",
    "headphones",
    "keyboards",
    "mb",
    "mice",
    "microphone",
    "monitor",
    "psu",
    "ram",
    "webcam",
  ];

  if (!validJsonNames.includes(jsonName)) {
    return res.status(400).send("Invalid JSON name");
  }

  const filePath = path.join(__dirname, "src", "data", `${jsonName}.json`);

  // Read the existing JSON file
  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      return res.status(500).send("Error reading JSON file");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fileData);
    } catch (parseError) {
      return res.status(500).send("Error parsing JSON file");
    }

    // Add new data to the JSON
    if (jsonName === "cases") {
      // For cases, append to the "Gaming PC Cases" object
      const category = Object.keys(data["Gaming PC Cases"])[0];
      if (!jsonData["Gaming PC Cases"][category]) {
        jsonData["Gaming PC Cases"][category] = [];
      }
      jsonData["Gaming PC Cases"][category].push(data["Gaming PC Cases"][category][0]);
    } else if (jsonName === "cooling") {
      // For cooling, append to the specific category
      const category = Object.keys(data)[0];
      if (!jsonData["Cooling Solutions"][category]) {
        jsonData["Cooling Solutions"][category] = [];
      }
      jsonData["Cooling Solutions"][category].push(data[category][0]);
    } else if (jsonName === "cpu") {
      // For cpu, append to the "gaming_cpus" array
      jsonData.gaming_cpus.push(data.gaming_cpus[0]);
    } else if (jsonName === "headphones") {
      // For headphones, append to the "GamingHeadphones/Earphones" array
      jsonData["GamingHeadphones/Earphones"].push(data["GamingHeadphones/Earphones"][0]);
    } else if (jsonName === "microphone") {
      // For microphone, append to the "microphones" array
      jsonData.microphones.push(data.microphones[0]);
    } else if (jsonName === "webcam") {
      // For webcam, append to the "webcams" array
      jsonData.webcams.push(data.webcams[0]);
    } else if (Array.isArray(jsonData)) {
      jsonData.push(data); // For arrays
    } else if (typeof jsonData === "object") {
      jsonData = { ...jsonData, ...data }; // For objects
    } else {
      return res.status(500).send("Invalid JSON structure");
    }

    // Write the updated JSON back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing JSON file");
      }
      res.send("JSON updated successfully");
    });
  });
});

// Endpoint to handle storage updates
app.post("/update-storage", (req, res) => {
  const { jsonName, storageType, data } = req.body;

  // Validate jsonName
  if (jsonName !== "storage") {
    return res.status(400).send("Invalid JSON name for storage");
  }

  const filePath = path.join(__dirname, "src", "data", "storage.json");

  // Read the existing JSON file
  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      return res.status(500).send("Error reading storage JSON file");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fileData);
    } catch (parseError) {
      return res.status(500).send("Error parsing storage JSON file");
    }

    // Determine the storage type based on the data
    if (!jsonData[storageType]) {
      jsonData[storageType] = []; // Create a new array if the storage type doesn't exist
    }

    // Add new data to the appropriate storage type array
    jsonData[storageType].push(data);

    // Write the updated JSON back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing storage JSON file");
      }
      res.send("Storage data updated successfully");
    });
  });
});

// Endpoint to handle image uploads
app.post("/upload-image", upload.single("image"), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start the server
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});