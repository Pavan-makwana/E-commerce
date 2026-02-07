import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import {
  getReturns,
  approveReturn,
  rejectReturn,
  refundReturn
} from "../controllers/returnController.js";

const router = express.Router();

router.get("/", protect, isAdmin, getReturns);
router.put("/:id/approve", protect, isAdmin, approveReturn);
router.put("/:id/reject", protect, isAdmin, rejectReturn);
router.put("/:id/refund", protect, isAdmin, refundReturn);

export default router;
