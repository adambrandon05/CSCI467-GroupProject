
CREATE DATABASE IF NOT EXISTS auto_parts;
USE auto_parts;

-- Users
CREATE TABLE `Users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(255) NOT NULL UNIQUE,
    `Password` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(20) NOT NULL DEFAULT 'customer'
);

-- Products
CREATE TABLE `Products` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL,
    `Description` TEXT NOT NULL,
    `Price` DECIMAL(8,2) NOT NULL,
    `Weight` DECIMAL(8,2) NOT NULL,
    `Category` VARCHAR(100) NOT NULL
);

-- Inventory
CREATE TABLE `Inventory` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL UNIQUE,
    `available quantity` INT NOT NULL DEFAULT 0,

    FOREIGN KEY (`product_id`)
        REFERENCES `Products` (`id`)
);

-- Carts
CREATE TABLE `Carts` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',

    FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`id`) ON DELETE SET NULL
);

-- Items in Cart
CREATE TABLE `Items in Cart` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cart_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `Quantity` INT NOT NULL,

    UNIQUE (`cart_id`, `product_id`),

    FOREIGN KEY (`cart_id`)
        REFERENCES `Carts` (`id`) ON DELETE CASCADE,

    FOREIGN KEY (`product_id`)
        REFERENCES `Products` (`id`)
);

-- Shipping Rates
CREATE TABLE `Shipping Rates` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Min weight` DECIMAL(8,2) NOT NULL,
    `Max Weight` DECIMAL(8,2) NOT NULL,
    `Charge` DECIMAL(8,2) NOT NULL
);

-- Orders
CREATE TABLE `Orders` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `Guest Email` VARCHAR(255) NULL,
    `Order date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `Total` DECIMAL(10,2) NOT NULL,
    `Status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    `Shipping Address` TEXT NOT NULL,

    FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`id`) ON DELETE SET NULL
);

-- Ordered Items
CREATE TABLE `Ordered Items` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `Quantity` INT NOT NULL,
    `Unit Price` DECIMAL(8,2) NOT NULL,

    FOREIGN KEY (`order_id`)
        REFERENCES `Orders` (`id`) ON DELETE CASCADE,

    FOREIGN KEY (`product_id`)
        REFERENCES `Products` (`id`)
);

-- Shipments
CREATE TABLE `Shipments` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT UNSIGNED NOT NULL,
    `rate_id` INT UNSIGNED NOT NULL,
    `Tracking number` VARCHAR(100) NULL,
    `Shipping status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    `Shipping cost` DECIMAL(8,2) NOT NULL,

    FOREIGN KEY (`order_id`)
        REFERENCES `Orders` (`id`),

    FOREIGN KEY (`rate_id`)
        REFERENCES `Shipping Rates` (`id`)
);

-- Payments
CREATE TABLE `Payments` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT UNSIGNED NOT NULL,
    `Amount` DECIMAL(10,2) NOT NULL,
    `Payment status` VARCHAR(30) NOT NULL,
    `Payment reference` VARCHAR(255) NOT NULL,

    FOREIGN KEY (`order_id`)
        REFERENCES `Orders` (`id`)
);

-- Reviews
CREATE TABLE `Reviews` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `Rating` INT NOT NULL,
    `Comment` TEXT NOT NULL,

    FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`id`),

    FOREIGN KEY (`product_id`)
        REFERENCES `Products` (`id`)
);

-- Inventory Transactions
CREATE TABLE `Inventory Transactions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `Quantity change` INT NOT NULL,
    `Transaction type` VARCHAR(100) NOT NULL,
    `Transaction date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`product_id`)
        REFERENCES `Products` (`id`),

    FOREIGN KEY (`user_id`)
        REFERENCES `Users` (`id`)
);
