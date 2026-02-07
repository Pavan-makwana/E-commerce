import express from "express";
import {
  requestReturn,
  getSellerReturns,
  sellerHandleReturn
} from "../controllers/returnController.js";

import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

/* Customer */
router.post("/", protect, allowRoles("customer"), requestReturn);

/* Seller */
router.get("/seller", protect, allowRoles("seller"), getSellerReturns);
router.put("/:id", protect, allowRoles("seller"), sellerHandleReturn);

export default router;
