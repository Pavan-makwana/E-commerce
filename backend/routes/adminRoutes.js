import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { 
  getAllOrders, 
  adminUpdateOrderStatus,
  getAllUsers, 
  deleteUser,
  getAdminStats,
  getSalesHistory
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getAdminStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

// New Order Routes
router.get("/orders", protect, isAdmin, getAllOrders);
router.put("/orders/:id", protect, isAdmin, adminUpdateOrderStatus);

// New Sales History Route
router.get("/sales", protect, isAdmin, getSalesHistory);

export default router;