import express from "express";
import {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getSellerOrders,
  sellerUpdateOrderStatus
} from "../controllers/orderController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.post("/", protect, allowRoles("customer"), placeOrder);
router.get("/my", protect, allowRoles("customer"), getMyOrders);
router.put("/:id/cancel", protect, allowRoles("customer"), cancelOrder);
/* Seller */
router.get("/seller",protect,allowRoles("seller"),getSellerOrders);

router.put("/:id/seller-status",protect,allowRoles("seller"),sellerUpdateOrderStatus);

export default router;
