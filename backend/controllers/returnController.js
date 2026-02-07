import db from "../config/db.js";

/* CUSTOMER - REQUEST RETURN*/
export const requestReturn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id, reason } = req.body;

    if (!order_id || !reason) {
      return res.status(400).json({
        success: false,
        message: "Order ID and reason required"
      });
    }

    // Check order
    const [orders] = await db.promise().query(
      `SELECT * FROM orders
       WHERE id = ? AND user_id = ? AND status = 'Delivered'`,
      [order_id, userId]
    );

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Return not allowed"
      });
    }

    // Check existing return
    const [existing] = await db.promise().query(
      "SELECT id FROM returns WHERE order_id = ?",
      [order_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Return already requested"
      });
    }

    // Create return request
    await db.promise().query(
      `INSERT INTO returns (order_id, reason, status)
       VALUES (?, ?, 'Requested')`,
      [order_id, reason]
    );

    res.json({
      success: true,
      message: "Return request submitted"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* SELLER - VIEW RETURNS*/
export const getSellerReturns = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const [returns] = await db.promise().query(
      `SELECT r.*, o.user_id
       FROM returns r
       JOIN orders o ON r.order_id = o.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ?
       ORDER BY r.requested_at DESC`,
      [sellerId]
    );

    res.json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   SELLER - HANDLE RETURN
========================= */
export const sellerHandleReturn = async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body; // Approved / Rejected

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    await connection.beginTransaction();

    // Verify seller owns return
    const [rows] = await connection.query(
      `SELECT r.order_id
       FROM returns r
       JOIN order_items oi ON r.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE r.id = ? AND p.seller_id = ?`,
      [id, sellerId]
    );

    if (rows.length === 0) {
      throw new Error("Return not found or access denied");
    }

    const orderId = rows[0].order_id;

    // Update return status
    await connection.query(
      "UPDATE returns SET status = ? WHERE id = ?",
      [status, id]
    );

    // If approved → refund + restore stock
    if (status === "Approved") {
      const [items] = await connection.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [orderId]
      );

      for (let item of items) {
        await connection.query(
          "UPDATE inventory SET stock = stock + ? WHERE product_id = ?",
          [item.quantity, item.product_id]
        );
      }

      await connection.query(
        "UPDATE orders SET status = 'Cancelled' WHERE id = ?",
        [orderId]
      );

      await connection.query(
        "UPDATE payments SET payment_status = 'Refunded' WHERE order_id = ?",
        [orderId]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Return ${status.toLowerCase()}`
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
