import db from "../config/db.js";
import { increaseStock } from "../utils/inventoryHelper.js";

/* View seller orders */
export const getSellerOrders = async (req, res) => {
    const sellerId = req.user.id;

    const [orders] = await db.promise().query(`
    SELECT o.id, o.status, p.name, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_id = ?
  `, [sellerId]);

    res.json(orders);
};

/* Accept Order */
export const acceptOrder = async (req, res) => {
    await db.promise().query(
        "UPDATE orders SET status='Confirmed' WHERE id=? AND status='Placed'",
        [req.params.id]
    );
    res.json({ message: "Order confirmed" });
};

/* Reject Order */
export const rejectOrder = async (req, res) => {
    const orderId = req.params.id;

    const [items] = await db.promise().query(
        "SELECT product_id, quantity FROM order_items WHERE order_id=?",
        [orderId]
    );

    for (let item of items) {
        await increaseStock(item.product_id, item.quantity);
    }

    await db.promise().query(
        "UPDATE orders SET status='Cancelled' WHERE id=?",
        [orderId]
    );

    res.json({ message: "Order rejected & stock reverted" });
};

/* Ship Order */
export const shipOrder = async (req, res) => {
    await db.promise().query(
        "UPDATE orders SET status='Shipped' WHERE id=? AND status='Confirmed'",
        [req.params.id]
    );
    res.json({ message: "Order shipped" });
};

/* Deliver Order */
export const deliverOrder = async (req, res) => {
    await db.promise().query(
        "UPDATE orders SET status='Delivered' WHERE id=? AND status='Shipped'",
        [req.params.id]
    );
    res.json({ message: "Order delivered" });
};
