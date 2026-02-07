import db from "../config/db.js";

export const getAllOrders = async (req, res) => {
    const [orders] = await db.promise().query(`
    SELECT o.id, o.status, u.name AS customer
    FROM orders o
    JOIN users u ON o.user_id = u.id
  `);

    res.json(orders);
};
