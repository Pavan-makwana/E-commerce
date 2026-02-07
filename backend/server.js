import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import db from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// 1️⃣ Initialize app FIRST
const app = express();

// 2️⃣ Middlewares
app.use(cors());
app.use(express.json());

// 3️⃣ Database connection check
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

// 4️⃣ Base route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce Backend Running"
  });
});

// 5️⃣ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);

// 6️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
