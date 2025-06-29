require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// 🔌 Connect to MySQL Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL Connected...");
});

// 📌 Default Homepage Route
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Gaming PC Store API</h1><p>Use /products to view products.</p>");
});

// 📌 API to Get All Products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 📌 Path to JSON Data Directory
const dataDir = path.join(__dirname, "../src/data");

// 📌 Function to Assign Correct Categories (Including PSU Fix)
const assignCategory = (file, item) => {
    switch (file) {
        case "custom_PC.json":
            return "Prebuilt Gaming PCs";
        case "gpu.json":
            return "Graphics Cards (GPU)";
        case "keyboards.json":
            return "Keyboards";
        case "mice.json":
            return "Mice";
        case "mb.json":
            return "Motherboards";
        case "monitor.json":
            return "Monitors";
        case "ram.json":
            return "Memory (RAM)";
        case "psu.json":
            return "Power Supply Units (PSU)"; // 🔥 Fixed PSU category
        default:
            return item.category?.trim() || item.Category?.trim() || "Miscellaneous";
    }
};

// 📌 Function to Extract Nested Products with Proper Category Handling
const extractNestedProducts = (obj, parentCategory = "") => {
    let extracted = [];

    Object.keys(obj).forEach(key => {
        const data = obj[key];

        if (Array.isArray(data)) {
            data.forEach(item => {
                item.category = parentCategory ? `${parentCategory} > ${key}` : key;
                extracted.push(item);
            });
        } else if (typeof data === "object") {
            extracted = extracted.concat(extractNestedProducts(data, parentCategory ? `${parentCategory} > ${key}` : key));
        }
    });

    return extracted;
};

// ----------------------------------------------------------------------------
// NEW: Differential JSON Import Function
// ----------------------------------------------------------------------------
const importJSONData = () => {
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error("❌ Error reading data directory:", err);
            return;
        }

        // Process each JSON file in the directory
        files.filter(file => file.endsWith(".json")).forEach(file => {
            const filePath = path.join(dataDir, file);

            console.log(`📂 Processing ${file}...`);

            // Read file synchronously (could be made async if desired)
            const rawData = fs.readFileSync(filePath, "utf8");

            try {
                let jsonData = JSON.parse(rawData);

                // Handle nested structures if JSON is an object
                if (typeof jsonData === "object" && !Array.isArray(jsonData)) {
                    jsonData = extractNestedProducts(jsonData);
                }

                if (!Array.isArray(jsonData)) {
                    console.warn(`⚠ Skipping ${file} (Invalid format)`);
                    return;
                }

                // Build an array of product objects from JSON
                const productsFromFile = [];
                jsonData.forEach((item, index) => {
                    // Determine category based on file name and item properties
                    const category = assignCategory(file, item);

                    // Determine product name from various possible keys
                    const name = (
                        item.name || item.Name || item.model || item.title || item.product_name || item.PC_Type
                    )?.trim() || "Unknown Product";

                    // Parse price from different possible keys
                    const rawPrice = item.price || item.Price || item["pricing (INR)"] || item["Price (INR)"];
                    let price = typeof rawPrice === "string"
                        ? parseFloat(rawPrice.replace(/[^\d.]/g, ""))
                        : typeof rawPrice === "number"
                        ? rawPrice
                        : 0;

                    const stock = item.stock || 10;

                    if (name !== "Unknown Product" && price > 0) {
                        productsFromFile.push({ category, name, price, stock });
                        if (index < 3) {
                            console.log(`🔍 Debug: Extracted product from ${file}:`, { category, name, price, stock });
                        }
                    } else {
                        console.warn(`⚠ Skipping product with missing name or price in ${file}`);
                    }
                });

                if (productsFromFile.length === 0) {
                    console.warn(`⚠ No valid products found in ${file}. Skipping insertion.`);
                    return;
                }

                // ----------------------------------------------------------------------------
                // Compare with existing products in DB using product name as unique key.
                // This query fetches only the products that exist in the DB from the current file.
                // ----------------------------------------------------------------------------
                const names = productsFromFile.map(p => p.name);
                const selectQuery = 'SELECT name, price, stock, category FROM products WHERE name IN (?)';
                db.query(selectQuery, [names], (err, results) => {
                    if (err) {
                        console.error(`❌ Database Error while selecting products for ${file}:`, err);
                        return;
                    }

                    // Create a lookup map for existing products
                    const existingProducts = {};
                    results.forEach(row => {
                        existingProducts[row.name] = row;
                    });

                    const newProducts = [];
                    const updatedProducts = [];

                    // Filter products: if not in DB, mark as new; if exists but differs, mark for update.
                    productsFromFile.forEach(prod => {
                        if (!existingProducts[prod.name]) {
                            newProducts.push(prod);
                        } else {
                            const existing = existingProducts[prod.name];
                            // Check for differences in price, stock, or even category (if it might change)
                            if (existing.price !== prod.price || existing.stock !== prod.stock || existing.category !== prod.category) {
                                updatedProducts.push(prod);
                            }
                        }
                    });

                    // ----------------------------------------------------------------------------
                    // Insert new products in bulk
                    // ----------------------------------------------------------------------------
                    if (newProducts.length > 0) {
                        const insertValues = newProducts.map(p => [p.category, p.name, p.price, p.stock]);
                        const insertQuery = `
                            INSERT INTO products (category, name, price, stock)
                            VALUES ?
                        `;
                        db.query(insertQuery, [insertValues], (err, result) => {
                            if (err) {
                                console.error(`❌ Database Insert Error for ${file}:`, err);
                            } else {
                                console.log(`✅ Inserted ${result.affectedRows} new products from ${file}`);
                            }
                        });
                    } else {
                        console.log(`ℹ️ No new products found in ${file}`);
                    }

                    // ----------------------------------------------------------------------------
                    // Update changed products individually
                    // (Bulk updating with different values per row can be complex in MySQL.)
                    // ----------------------------------------------------------------------------
                    if (updatedProducts.length > 0) {
                        updatedProducts.forEach(prod => {
                            const updateQuery = `
                                UPDATE products 
                                SET category = ?, price = ?, stock = ?
                                WHERE name = ?
                            `;
                            db.query(updateQuery, [prod.category, prod.price, prod.stock, prod.name], (err, result) => {
                                if (err) {
                                    console.error(`❌ Database Update Error for product ${prod.name} in ${file}:`, err);
                                } else {
                                    console.log(`✅ Updated product ${prod.name} from ${file}`);
                                }
                            });
                        });
                    } else {
                        console.log(`ℹ️ No updated products found in ${file}`);
                    }
                });

            } catch (error) {
                console.error(`❌ Error parsing ${file}:`, error);
            }
        });
    });
};

// 🚀 Start the Server & Auto Import JSON on startup
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    importJSONData();
});
