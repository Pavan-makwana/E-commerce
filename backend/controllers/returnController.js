import db from "../config/db.js";

/* 1. ADMIN: Get All Returns (System Wide) */
export const getAllReturns = async (req, res) => {
  try {
    const [returns] = await db.promise().query(`
      SELECT r.*, o.created_at as order_date, u.name as customer_name, o.total_amount
      FROM returns r
      JOIN orders o ON r.order_id = o.id
      JOIN users u ON o.user_id = u.id
      ORDER BY r.requested_at DESC
    `);
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 2. SELLER: Get Returns for THEIR Products only */
export const getSellerReturns = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // This query finds returns linked to orders that contain this seller's products
    const [returns] = await db.promise().query(`
      SELECT DISTINCT r.*, u.name as customer_name, p.name as product_name, p.image_url
      FROM returns r
      JOIN orders o ON r.order_id = o.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE p.seller_id = ?
      ORDER BY r.requested_at DESC
    `, [sellerId]);

    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 3. CUSTOMER: Request a Return (With 7-Day Logic) */
export const requestReturn = async (req, res) => {
  try {
    const { order_id, reason } = req.body;
    const user_id = req.user.id;

    // A. Verify Order Exists & Belongs to User
    const [order] = await db.promise().query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?", 
      [order_id, user_id]
    );

    if (order.length === 0) return res.status(404).json({ message: "Order not found" });

    // B. Check Duplicate
    if (['Return Requested', 'Returned'].includes(order[0].status)) {
      return res.status(400).json({ message: "Return already active" });
    }

    // C. 7-Day Auto-Rejection Rule
    const orderDate = new Date(order[0].created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let initialStatus = 'Requested';
    let finalReason = reason;

    if (diffDays > 7) {
      initialStatus = 'Rejected';
      finalReason = `Auto-Rejected: Request exceeds 7-day policy (${diffDays} days). Reason: ${reason}`;
    }

    // D. Insert into DB
    await db.promise().query(
      "INSERT INTO returns (order_id, reason, status) VALUES (?, ?, ?)",
      [order_id, finalReason, initialStatus]
    );

    // E. Update Order Status (if not rejected)
    if (initialStatus === 'Requested') {
      await db.promise().query("UPDATE orders SET status = 'Return Requested' WHERE id = ?", [order_id]);
      res.status(201).json({ success: true, message: "Return Requested " });
    } else {
      res.status(201).json({ success: true, message: "Return Auto-Rejected (Policy Violation) " });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* 4. ADMIN/SELLER: Update Return Status (Approve/Reject) */
export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Rejected, Refunded

    // Validate
    const validStatuses = ['Approved', 'Rejected', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update Return
    await db.promise().query("UPDATE returns SET status = ? WHERE id = ?", [status, id]);

    // If 'Refunded', mark the main order as 'Returned'
    if (status === 'Refunded') {
       const [r] = await db.promise().query("SELECT order_id FROM returns WHERE id = ?", [id]);
       if(r.length > 0) {
          await db.promise().query("UPDATE orders SET status = 'Returned' WHERE id = ?", [r[0].order_id]);
       }
    }

    res.json({ success: true, message: `Return marked as ${status}` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};