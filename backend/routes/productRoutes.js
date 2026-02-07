import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

/* Public */
router.get("/", getAllProducts);
router.get("/:id", getProductById);

/* Seller/Admin */
router.post("/", protect, allowRoles("seller"), addProduct);
router.put("/:id", protect, allowRoles("seller", "admin"), updateProduct);
router.delete("/:id", protect, allowRoles("seller", "admin"), deleteProduct);

export default router;
