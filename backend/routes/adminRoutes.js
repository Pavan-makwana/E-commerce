import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { 
  getAllOrders, 
  getAllUsers, 
  deleteUser,
  getAdminStats 
} from "../controllers/adminController.js";

const router = express.Router();

// Existing
router.get("/orders", protect, isAdmin, getAllOrders);

// New Routes
router.get("/users", protect, isAdmin, getAllUsers);      
router.delete("/users/:id", protect, isAdmin, deleteUser); 
router.get("/stats", protect, isAdmin, getAdminStats);  

export default router;