
CREATE DATABASE IF NOT EXISTS auto_parts;
USE auto_parts;

-- USERS

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
);


-- PRODUCTS

CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    weight DECIMAL(8,2) NOT NULL,
    category VARCHAR(100) NOT NULL
);


-- INVENTORY

CREATE TABLE inventory (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL UNIQUE,
    available_quantity INT NOT NULL DEFAULT 0,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- CARTS

CREATE TABLE carts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',

    FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
);


-- CART ITEMS

CREATE TABLE cart_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,

    UNIQUE (cart_id, product_id),

    FOREIGN KEY (cart_id)
        REFERENCES carts(id) ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- SHIPPING RATES

CREATE TABLE shipping_rates (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    min_weight DECIMAL(8,2) NOT NULL,
    max_weight DECIMAL(8,2) NOT NULL,
    charge DECIMAL(8,2) NOT NULL
);


-- ORDERS

CREATE TABLE orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    guest_email VARCHAR(255) NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
);


-- ORDER ITEMS

CREATE TABLE order_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- SHIPMENTS

CREATE TABLE shipments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    rate_id INT UNSIGNED NOT NULL,
    tracking_number VARCHAR(100) NULL,
    shipping_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    shipping_cost DECIMAL(8,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id),

    FOREIGN KEY (rate_id)
        REFERENCES shipping_rates(id)
);


-- PAYMENTS

CREATE TABLE payments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,
    payment_reference VARCHAR(255) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
);


-- REVIEWS

CREATE TABLE reviews (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    rating INT NOT NULL,
    comment TEXT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- INVENTORY TRANSACTIONS

CREATE TABLE inventory_transactions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    quantity_change INT NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);
