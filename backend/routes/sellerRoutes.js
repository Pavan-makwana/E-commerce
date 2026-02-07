import express from "express";

const router = express.Router();

// 🔹 Temporary test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Seller route is working"
  });
});

export default router;
