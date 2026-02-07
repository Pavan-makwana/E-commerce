import db from "../config/db.js";

/* PLACE ORDER (Customer)*/
export const placeOrder = async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const userId = req.user.id;
    const { items, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items required"
      });
    }

    await connection.beginTransaction();

    let totalAmount = 0;

    // 1. Stock check + total calc
    for (let item of items) {
      const [rows] = await connection.query(
        `SELECT p.price, i.stock
         FROM products p
         JOIN inventory i ON p.id = i.product_id
         WHERE p.id = ? AND p.status = 'active'`,
        [item.product_id]
      );

      if (rows.length === 0) {
        throw new Error("Product not found");
      }

      if (rows[0].stock < item.quantity) {
        throw new Error("Out of stock");
      }

      totalAmount += rows[0].price * item.quantity;
    }

    // 2. Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES (?, ?, 'Placed')`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 3. Order items + deduct stock
    for (let item of items) {
      const [[product]] = await connection.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id]
      );

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, product.price]
      );

      await connection.query(
        `UPDATE inventory
         SET stock = stock - ?
         WHERE product_id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // 4. Create payment
    await connection.query(
      `INSERT INTO payments (order_id, payment_method, payment_status)
       VALUES (?, ?, 'Success')`,
      [orderId, payment_method || "COD"]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order_id: orderId
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
  }
};

/* =========================
   GET MY ORDERS (Customer)
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.promise().query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   CANCEL ORDER (Customer)
========================= */
export const cancelOrder = async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    await connection.beginTransaction();

    const [orders] = await connection.query(
      `SELECT * FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      throw new Error("Order not found");
    }

    if (["Shipped", "Delivered"].includes(orders[0].status)) {
      throw new Error("Cannot cancel after shipping");
    }

    // Update order
    await connection.query(
      "UPDATE orders SET status = 'Cancelled' WHERE id = ?",
      [orderId]
    );

    // Restore stock
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

    // Update payment
    await connection.query(
      "UPDATE payments SET payment_status = 'Failed' WHERE order_id = ?",
      [orderId]
    );

    await connection.commit();

    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};


/* SELLER - GET ORDERS */
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const [orders] = await db.promise().query(
      `SELECT DISTINCT o.*
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ?
       ORDER BY o.created_at DESC`,
      [sellerId]
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* SELLER - UPDATE ORDER STATUS */
export const sellerUpdateOrderStatus = async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body; // Confirmed | Cancelled | Shipped

    if (!["Confirmed", "Cancelled", "Shipped"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    await connection.beginTransaction();

    // Verify seller owns the order
    const [rows] = await connection.query(
      `SELECT o.status
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND p.seller_id = ?`,
      [id, sellerId]
    );

    if (rows.length === 0) {
      throw new Error("Order not found or access denied");
    }

    const currentStatus = rows[0].status;

    // Business rules
    if (currentStatus === "Cancelled" || currentStatus === "Delivered") {
      throw new Error("Order cannot be updated");
    }

    // Cancel logic (restore stock + refund)
    if (status === "Cancelled") {
      const [items] = await connection.query(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [id]
      );

      for (let item of items) {
        await connection.query(
          "UPDATE inventory SET stock = stock + ? WHERE product_id = ?",
          [item.quantity, item.product_id]
        );
      }

      await connection.query(
        "UPDATE payments SET payment_status = 'Failed' WHERE order_id = ?",
        [id]
      );
    }

    // Update order
    await connection.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Order ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
