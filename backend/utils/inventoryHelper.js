import db from "../config/db.js";

export const increaseStock = async (productId, qty) => {
    await db.promise().query(
        "UPDATE inventory SET stock = stock + ? WHERE product_id = ?",
        [qty, productId]
    );
};
