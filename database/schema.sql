CREATE TABLE `Products`(
    `Product ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` TEXT NOT NULL,
    `Description` TEXT NOT NULL,
    `Price` DECIMAL(8, 2) NOT NULL,
    `Weight` DECIMAL(8, 2) NOT NULL,
    `Category` TEXT NOT NULL
);
CREATE TABLE `Inventory`(
    `Inventory ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Product ID` INT NOT NULL,
    `available quantity` INT NOT NULL,
    PRIMARY KEY(`Product ID`)
);
CREATE TABLE `Items in Cart`(
    `cart item ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cart ID` INT NOT NULL,
    `Product ID` INT NOT NULL,
    `Quantity` INT NOT NULL
);
CREATE TABLE `Orderd Items`(
    `Ordered Item ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Order ID` INT NOT NULL,
    `Product ID` INT NOT NULL,
    `Quantity` INT NOT NULL,
    `Unit Price` DECIMAL(8, 2) NOT NULL
);
CREATE TABLE `Inventory Transactions`(
    `Transaction ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Product ID` INT NOT NULL,
    `User ID` INT NOT NULL,
    `Quantity change` INT NOT NULL,
    `Transaction type` CHAR(255) NOT NULL,
    `Transaction date` DATETIME NOT NULL
);
CREATE TABLE `Carts`(
    `Cart ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `User ID` INT NOT NULL,
    `status` TEXT NOT NULL
);
CREATE TABLE `Reviews`(
    `Review ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `User ID` INT NOT NULL,
    `Product ID` INT NOT NULL,
    `Rating` INT NOT NULL,
    `Comment` TEXT NOT NULL
);
CREATE TABLE `Shipping Rates`(
    `Rate ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Min weight` DECIMAL(8, 2) NOT NULL,
    `Max Weight` DECIMAL(8, 2) NOT NULL,
    `Charge` DECIMAL(8, 2) NOT NULL
);
CREATE TABLE `Orders`(
    `Order ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `User ID` INT NOT NULL,
    `Order date` DATETIME NOT NULL,
    `Total` DECIMAL(8, 2) NOT NULL,
    `Status` TEXT NOT NULL,
    `Shipping Addres` TEXT NOT NULL
);
CREATE TABLE `Shipments`(
    `Shipment ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Order ID` INT NOT NULL,
    `Rate ID` INT NOT NULL,
    `Tracking number` INT NOT NULL,
    `Shipping status` TEXT NOT NULL,
    `Shipping cost` DECIMAL(8, 2) NOT NULL
);
CREATE TABLE `Payments`(
    `Payment ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Order ID` INT NOT NULL,
    `Amount` DECIMAL(8, 2) NOT NULL,
    `Payment status` TEXT NOT NULL,
    `Payment reference` TEXT NOT NULL
);
CREATE TABLE `Users`(
    `User ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` TEXT NOT NULL,
    `Email` TEXT NOT NULL,
    `Password` TEXT NOT NULL,
    `Role` TEXT NOT NULL
);