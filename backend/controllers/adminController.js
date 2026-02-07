import db from "../config/db.js";

/* GET ALL ORDERS (Existing) */
export const getAllOrders = async (req, res) => {
    const [orders] = await db.promise().query(`
    SELECT o.id, o.status, u.name AS customer
    FROM orders o
    JOIN users u ON o.user_id = u.id
  `);
    res.json(orders);
};

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    // Select all users but hide passwords
    const [users] = await db.promise().query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*  DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting yourself
    if (req.user.id == id) {
      return res.status(400).json({ success: false, message: "Cannot delete yourself" });
    }

    await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ADMIN STATS */
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