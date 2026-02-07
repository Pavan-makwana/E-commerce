import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { getAllOrders } from "../controllers/adminController.js";

const router = express.Router();

router.get("/orders", protect, isAdmin, getAllOrders);

export default router;
