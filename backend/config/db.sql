
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

INSERT INTO products (seller_id,name,description,price,category,image_url) VALUES
(2,'HP Laptop','8GB RAM, 512GB SSD',55000,'Electronics','laptop.jpg'),
(2,'Samsung Mobile','5G Smartphone',25000,'Electronics','mobile.jpg'),
(3,'Cotton T-Shirt','Premium Cotton',799,'Clothing','tshirt.jpg'),
(3,'Blue Jeans','Denim Slim Fit',1599,'Clothing','jeans.jpg');

select * from products;


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

select * from inventory;


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
