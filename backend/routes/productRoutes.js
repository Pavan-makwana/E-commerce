import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middlewares/authMiddleware.js";
// Make sure this import matches your actual file name (usually roleMiddleware.js)
import { allowRoles } from "../middlewares/roleMiddleware.js"; 

const router = express.Router();

/* Public Routes */
router.get("/", getAllProducts);
router.get("/:id", getProductById);

/* Protected Routes */
router.post("/", protect, allowRoles("seller", "admin"), addProduct);

router.put("/:id", protect, allowRoles("seller", "admin"), updateProduct);
router.delete("/:id", protect, allowRoles("seller", "admin"), deleteProduct);

export default router; 