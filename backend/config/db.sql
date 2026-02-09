
-- DATABASE
CREATE DATABASE  ecommerce;
USE ecommerce;


-- USERS (Customer / Seller / Admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','seller','admin') DEFAULT 'customer',
    phone VARCHAR(15),
    address TEXT,
    status ENUM('active','blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name,email,password,role,phone,address) VALUES
-- Admin
('System Admin','admin@shop.com','admin123','admin','9000000000','Head Office'),

-- Sellers
('Tech Seller','tech@shop.com','seller123','seller','9111111111','Ahmedabad'),
('Fashion Seller','fashion@shop.com','seller123','seller','9222222222','Surat'),

-- Customers
('Pavan Makwana','pavan@gmail.com','123456','customer','9333333333','Ahmedabad'),
('Rahul Shah','rahul@gmail.com','123456','customer','9444444444','Vadodara'),
('Neha Patel','neha@gmail.com','123456','customer','9555555555','Surat');
UPDATE users
SET password = '$2b$10$7DKjBxz.DlhuYYgt6DeESes9F4aXHsAdl3yNbYoiA.gLUM9bDoaZG'
WHERE email = 'admin@shop.com';



select * from users;

-- PRODUCTS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seller_id) REFERENCES users(id)
);


INSERT INTO products (seller_id, name, description, price, category, image_url) VALUES
(2, 'HP Laptop', '8GB RAM, 512GB SSD, High Performance', 55000, 'Electronics', 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?q=80&w=1000&auto=format&fit=crop'),
(2, 'Samsung Mobile', '5G Smartphone, 128GB Storage, Awesome Camera', 25000, 'Electronics', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop'),
(3, 'Cotton T-Shirt', 'Premium Cotton, Round Neck, White', 799, 'Clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'),
(3, 'Blue Jeans', 'Denim Slim Fit, Rugged Look', 1599, 'Clothing', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop');

select * from products;
INSERT INTO products (seller_id, name, description, price, category, image_url) VALUES

--  SELLER 2: ELECTRONICS (5 Products)
(2, 'Apple MacBook Air M2', '13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD', 114900, 'Electronics', 'https://www.apple.com/v/macbook-air/specs/a/images/specs/13-inch/mba_13_hero__ft1h6h6uc96y_large_2x.jpg'),
(2, 'Sony WH-1000XM5', 'Wireless Noise Cancelling Headphones, Black', 24990, 'Electronics', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop'),
(2, 'iPhone 14 Pro', '128GB, Deep Purple, A16 Bionic Chip', 119900, 'Electronics', 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-mistblue_GEO_EMEA?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxcFYyWWhPSUg0YytZdmJ2dmY4d09xcm9ybkE1WmZYZGw4ZVJBQ2FIUWYrLzhLcXQxZ1h0QThIT2dnUm5qbGk5OUJkSERIUjY1Wk1Od3FtNjF6NFZLVXNoQlNzRzdPQUgxWUhsSVV3V0VPSXhDcEN1NkN3RUFyY3dhaDU4aXM3eHp3&traceId=1'),
(2, 'Canon EOS 1500D', '24.1MP Digital SLR Camera + 18-55mm Lens', 41990, 'Electronics', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'),
(2, 'Apple Watch Series 8', 'GPS, 45mm Midnight Aluminium Case', 41900, 'Electronics', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop'),

--  SELLER 3: FASHION (5 Products)
(3, 'Nike Air Jordan 1', 'High Top Sneakers, Red, White & Black', 12995, 'Clothing', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'),
(3, 'Levis Denim Jacket', 'Classic Trucker Jacket, Blue Denim', 3999, 'Clothing', 'https://images.unsplash.com/photo-1573286596658-507245faf2da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGRlbmltfGVufDB8fDB8fHwy'),
(3, 'Ray-Ban Aviator', 'Classic Gold Frame, Green G-15 Lens', 6590, 'Fashion', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop'),
(3, 'Adidas Running Shoes', 'Ultraboost Light, Core Black', 8999, 'Clothing', 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000&auto=format&fit=crop'),
(3, 'PCotton T-Shirt', 'Regular Fit, Round Neck, White', 999, 'Clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop');



-- 1. Remove associated Inventory first
-- DELETE FROM inventory 
-- WHERE product_id IN (SELECT id FROM products WHERE seller_id IN (2, 3));
-- insert into inventory (product_id,stock) values 
-- (2,25),(3,50);
-- 2. Remove associated Order Items (Warning: This modifies past order history)
-- DELETE FROM order_items 
-- WHERE product_id IN (SELECT id FROM products WHERE seller_id IN (2, 3));

-- 3. Now safely delete the Products
-- DELETE FROM products WHERE seller_id IN (2, 3);

-- INVENTORY
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNIQUE NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO inventory (product_id,stock) VALUES
(1,20),
(2,25),
(3,50),
(4,35);

INSERT INTO inventory (product_id, stock)
SELECT id, 50 
FROM products
WHERE id NOT IN (SELECT product_id FROM inventory);

SELECT products.id, products.name, products.price, inventory.stock 
FROM products 
JOIN inventory ON products.id = inventory.product_id;

-- INSERT INTO inventory (product_id, stock)
-- SELECT id, 25 FROM products WHERE name = 'HP Laptop'
-- UNION ALL
-- SELECT id, 50 FROM products WHERE name = 'Samsung Mobile'
-- UNION ALL
-- SELECT id, 100 FROM products WHERE name = 'Cotton T-Shirt'
-- UNION ALL
-- SELECT id, 75 FROM products WHERE name = 'Blue Jeans';
-- SELECT id, name FROM products;
-- select * from inventory;


-- ORDERS
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2),
    status ENUM(
        'Placed',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Placed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id,total_amount,status) VALUES
(4,55799,'Delivered'),
(5,1599,'Shipped'),
(6,799,'Placed'),
(4,25000,'Cancelled');

ALTER TABLE orders 
MODIFY COLUMN status ENUM(
    'Placed', 
    'Confirmed', 
    'Shipped', 
    'Delivered', 
    'Cancelled', 
    'Returned', 
    'Return Requested'
) DEFAULT 'Placed';
select * from orders;


-- ORDER ITEMS
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_items (order_id,product_id,quantity,price) VALUES
(1,1,1,55000),
(1,3,1,799),
(2,4,1,1599),
(3,3,1,799),
(4,2,1,25000);

select * from order_items;


-- PAYMENTS
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('Success','Failed','Pending'),
    transaction_id VARCHAR(100),
    paid_at TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO payments (order_id,payment_method,payment_status,transaction_id,paid_at) VALUES
(1,'UPI','Success','TXN9001',NOW()),
(2,'Card','Pending','TXN9002',NULL),
(3,'COD','Success','TXN9003',NOW()),
(4,'UPI','Failed','TXN9004',NULL);

select * from payments;


-- RETURNS
CREATE TABLE returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    reason TEXT,
    status ENUM('Requested','Approved','Rejected','Refunded')
        DEFAULT 'Requested',

    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO returns (order_id,reason,status) VALUES
(1,'Damaged product','Refunded'),
(2,'Late delivery','Requested'),
(4,'Wrong item','Rejected');

select * from returns;

-- SELLER PERFORMANCE (For Analytics)

CREATE TABLE seller_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT UNIQUE NOT NULL,
    total_orders INT DEFAULT 0,
    cancelled_orders INT DEFAULT 0,
    return_orders INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 5.0,

    FOREIGN KEY (seller_id) REFERENCES users(id)
);

INSERT INTO seller_stats (seller_id,total_orders,cancelled_orders,return_orders,rating) VALUES
(2,120,5,3,4.6),
(3,95,8,6,4.2);

select * from seller_stats;
