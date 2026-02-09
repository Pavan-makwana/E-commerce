import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin, allowRoles } from "../middlewares/roleMiddleware.js";
import {
  getAllReturns,
  getSellerReturns,
  updateReturnStatus,
  requestReturn 
} from "../controllers/returnController.js";

const router = express.Router();
-

router.post("/", protect, requestReturn); 

// Admin sees all
router.get("/admin", protect, isAdmin, getAllReturns);

// Seller sees theirs
router.get("/seller", protect, allowRoles("seller"), getSellerReturns);

// Action (Approve/Reject)
router.put("/:id", protect, allowRoles("admin", "seller"), updateReturnStatus);

export default router;