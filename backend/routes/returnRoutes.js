import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin, allowRoles } from "../middlewares/roleMiddleware.js";
import {
  getAllReturns,
  getSellerReturns,
  updateReturnStatus
} from "../controllers/returnController.js";

const router = express.Router();

// Admin sees all
router.get("/admin", protect, isAdmin, getAllReturns);

// Seller sees theirs
router.get("/seller", protect, allowRoles("seller"), getSellerReturns);

// Action (Approve/Reject)
router.put("/:id", protect, allowRoles("admin", "seller"), updateReturnStatus);

export default router;