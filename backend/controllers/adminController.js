import db from "../config/db.js";

/* 1. GET ALL ORDERS (With full details) */
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* 2. UPDATE ORDER STATUS (Admin Override) */
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Shipped', 'Delivered', 'Cancelled'

    await db.promise().query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: `Order updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* 3. GET SALES HISTORY (Who sold what to whom) */
export const getSalesHistory = async (req, res) => {
  try {
    const [sales] = await db.promise().query(`
      SELECT 
        oi.id,
        p.name AS product_name,
        p.image_url,
        p.price,
        oi.quantity,
        buyer.name AS buyer_name,
        seller.name AS seller_name,
        o.created_at
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN users buyer ON o.user_id = buyer.id
      JOIN users seller ON p.seller_id = seller.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* 4. EXISTING: GET ADMIN STATS */
export const getAdminStats = async (req, res) => {
  try {
    const [users] = await db.promise().query("SELECT COUNT(*) as count FROM users");
    const [orders] = await db.promise().query("SELECT COUNT(*) as count FROM orders");
    const [revenue] = await db.promise().query("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'");

    res.json({
      users: users[0].count,
      orders: orders[0].count,
      sales: revenue[0].total || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* 5. EXISTING: GET USERS & DELETE */
export const getAllUsers = async (req, res) => {
    const [users] = await db.promise().query("SELECT id, name, email, role FROM users");
    res.json({ success: true, data: users });
};

export const deleteUser = async (req, res) => {
    await db.promise().query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "User deleted" });
};