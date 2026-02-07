import db from "../config/db.js";
import { increaseStock } from "../utils/inventoryHelper.js";

export const getReturns = async (req, res) => {
  const [returns] = await db.promise().query("SELECT * FROM returns");
  res.json(returns);
};

export const approveReturn = async (req, res) => {
  await db.promise().query(
    "UPDATE returns SET status='Approved' WHERE id=?",
    [req.params.id]
  );
  res.json({ message: "Return approved" });
};

export const rejectReturn = async (req, res) => {
  await db.promise().query(
    "UPDATE returns SET status='Rejected' WHERE id=?",
    [req.params.id]
  );
  res.json({ message: "Return rejected" });
};

export const refundReturn = async (req, res) => {
  const [orderItems] = await db.promise().query(`
    SELECT oi.product_id, oi.quantity
    FROM order_items oi
    JOIN returns r ON r.order_id = oi.order_id
    WHERE r.id = ?
  `, [req.params.id]);

  for (let item of orderItems) {
    await increaseStock(item.product_id, item.quantity);
  }

  await db.promise().query(
    "UPDATE returns SET status='Refunded' WHERE id=?",
    [req.params.id]
  );

  res.json({ message: "Refund completed" });
};
