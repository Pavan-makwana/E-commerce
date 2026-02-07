import db from "../config/db.js";

/* ADMIN: View All Returns */
export const getAllReturns = async (req, res) => {
  const [returns] = await db.promise().query("SELECT * FROM returns");
  res.json(returns);
};

/* SELLER: View My Returns */
export const getSellerReturns = async (req, res) => {
  try {
    const sellerId = req.user.id;
    // Join returns -> orders -> order_items -> products to find seller's returns
    const [returns] = await db.promise().query(`
      SELECT r.*, p.name as product_name, p.image_url
      FROM returns r
      JOIN orders o ON r.order_id = o.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ?
    `, [sellerId]);

    res.json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* SELLER/ADMIN: Update Return Status */
export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Rejected

    await db.promise().query(
      "UPDATE returns SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ success: true, message: `Return ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};