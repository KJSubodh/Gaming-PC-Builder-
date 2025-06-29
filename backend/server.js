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
  // Uncomment below if you need to import products from JSON on startup
  // importProducts();
});

// (Optional) Function to import products from JSON
const importProducts = () => {
  const filePath = path.join(__dirname, "src/data/products.json");
  if (!fs.existsSync(filePath)) {
    console.error("❌ JSON file not found:", filePath);
    return;
  }
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    console.error("❌ Invalid or empty JSON file.");
    return;
  }
  jsonData.forEach((product) => {
    const { category, name } = product;
    const price = parseFloat(product.price) || 0;
    const stock = product.stock || 10;
    const query = `
      INSERT INTO products (category, name, price, stock) 
      VALUES (?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE price=?, stock=?`;
    db.query(query, [category, name, price, stock, price, stock], (err) => {
      if (err) console.error("❌ Error inserting product:", err);
    });
  });
  console.log("✅ Products imported successfully.");
};

// Default Homepage
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Gaming PC Store API</h1><p>Use /products to view products.</p>");
});

// GET all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST: Add product to cart
app.post("/cart", (req, res) => {
  const { product_id, quantity } = req.body;
  db.query("SELECT stock FROM products WHERE id = ?", [product_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    const stock = results[0].stock;
    if (stock < quantity) return res.status(400).json({ error: "Insufficient stock" });
    db.query("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [product_id, quantity], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product added to cart", id: result.insertId });
    });
  });
});

// GET: Retrieve all cart items with product details
app.get("/cart", (req, res) => {
  const query = `
    SELECT cart.id AS cart_id, cart.product_id, products.name, products.price, cart.quantity 
    FROM cart 
    JOIN products ON cart.product_id = products.id`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// DELETE: Remove a specific cart item
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product removed from cart" });
  });
});

// DELETE: Clear entire cart
app.delete("/cart", (req, res) => {
  db.query("DELETE FROM cart", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart cleared" });
  });
});

// POST: Create an order
app.post("/orders", (req, res) => {
  const { user_name, phone, address, total_price, items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("INSERT INTO orders (user_name, phone, address, total_price) VALUES (?, ?, ?, ?)",
      [user_name, phone, address, total_price],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
        const orderId = result.insertId;
        const orderItemsQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
        const orderItemsValues = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        db.query(orderItemsQuery, [orderItemsValues], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          db.commit((err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order created successfully", orderId });
          });
        });
      }
    );
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
