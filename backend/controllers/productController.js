import db from "../config/db.js";

/* GET ALL PRODUCTS */
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.promise().query(
      `SELECT p.*, u.name AS seller_name, i.stock
       FROM products p
       JOIN users u ON p.seller_id = u.id
       JOIN inventory i ON p.id = i.product_id
       WHERE p.status = 'active'`
    );

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* GET SINGLE PRODUCT */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      `SELECT p.*, u.name AS seller_name, i.stock
       FROM products p
       JOIN users u ON p.seller_id = u.id
       JOIN inventory i ON p.id = i.product_id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ADD PRODUCT (Seller)*/
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { name, description, price, category, image_url, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required"
      });
    }

    // Insert product
    const [result] = await db.promise().query(
      `INSERT INTO products (seller_id, name, description, price, category, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sellerId, name, description, price, category, image_url]
    );

    const productId = result.insertId;

    // Insert inventory
    await db.promise().query(
      `INSERT INTO inventory (product_id, stock)
       VALUES (?, ?)`,
      [productId, stock]
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product_id: productId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* UPDATE PRODUCT (Seller/Admin) */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock } = req.body;

    // Check product
    const [rows] = await db.promise().query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = rows[0];

    // Seller can update only own product
    if (req.user.role === "seller" && product.seller_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Update product
    await db.promise().query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price, category, image_url, id]
    );

    // Update stock if provided
    if (stock !== undefined) {
      await db.promise().query(
        "UPDATE inventory SET stock = ? WHERE product_id = ?",
        [stock, id]
      );
    }

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* DELETE PRODUCT (Seller/Admin) */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = rows[0];

    // Seller ownership check
    if (req.user.role === "seller" && product.seller_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Soft delete
    await db.promise().query(
      "UPDATE products SET status = 'inactive' WHERE id = ?",
      [id]
    );

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
