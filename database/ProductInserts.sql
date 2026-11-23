USE auto_parts;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE shipments;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE inventory;
TRUNCATE TABLE shipping_rates;
TRUNCATE TABLE products;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;
-- USERS

INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Test Customer', 'customer@test.com', 'Customer123!', 'customer'),
(2, 'Test Employee', 'employee@test.com', 'Employee123!', 'employee'),
(3, 'Test Admin', 'admin@test.com', 'Admin123!', 'admin');


-- PRODUCTS

INSERT INTO products (id, name, description, price, weight, category) VALUES
(1, 'Oil Filter', 'Replacement engine oil filter', 9.99, 0.50, 'Filters'),
(2, 'Air Filter', 'Replacement engine air filter', 15.99, 0.75, 'Filters'),
(3, 'Brake Pad Set', 'Front brake pad replacement set', 49.99, 4.00, 'Brakes'),
(4, 'Spark Plug', 'Replacement spark plug', 6.99, 0.10, 'Ignition'),
(5, 'Car Battery', '12-volt automotive battery', 129.99, 35.00, 'Electrical'),
(6, '5W-30 Engine Oil', '5-quart bottle of synthetic 5W-30 engine oil', 29.99, 9.50, 'Fluids'),
(7, '0W-20 Engine Oil', '5-quart bottle of synthetic 0W-20 engine oil', 32.99, 9.50, 'Fluids'),
(8, 'Cabin Air Filter', 'Replacement filter for cabin ventilation', 18.99, 0.40, 'Filters'),
(9, 'Wiper Blade', 'Replacement windshield wiper blade', 14.99, 0.50, 'Accessories'),
(10, 'Brake Rotor', 'Replacement brake rotor', 64.99, 15.00, 'Brakes'),
(11, 'Headlight Bulb', 'Replacement automotive headlight bulb', 12.99, 0.20, 'Lighting'),
(12, 'Serpentine Belt', 'Replacement engine accessory drive belt', 24.99, 0.60, 'Engine'),
(13, 'Engine Coolant', '1-gallon bottle of premixed engine coolant', 16.99, 9.00, 'Fluids'),
(14, 'Brake Fluid', '12-ounce bottle of DOT 3 brake fluid', 5.99, 0.90, 'Fluids'),
(15, 'Windshield Washer Fluid', '1-gallon bottle of windshield washer fluid', 4.99, 8.50, 'Fluids');


-- INVENTORY

INSERT INTO inventory (product_id, available_quantity) VALUES
(1, 50),
(2, 40),
(3, 25),
(4, 100),
(5, 15),
(6, 50),
(7, 50),
(8, 30),
(9, 60),
(10, 20),
(11, 40),
(12, 25),
(13, 35),
(14, 30),
(15, 60);


-- SHIPPING RATES

INSERT INTO shipping_rates (id, min_weight, max_weight, charge) VALUES
(1, 0.00, 1.00, 4.99),
(2, 1.01, 5.00, 7.99),
(3, 5.01, 20.00, 12.99),
(4, 20.01, 50.00, 19.99);


-- ORDERS

INSERT INTO orders
(id, user_id, guest_email, order_date, total, status, shipping_address)
VALUES
(1, 1, NULL, '2026-11-18 10:30:00', 69.97, 'authorized', '123 Main St, DeKalb, IL'),
(2, 1, NULL, '2026-11-19 14:15:00', 137.98, 'authorized', '123 Main St, DeKalb, IL'),
(3, 1, NULL, '2026-11-20 09:00:00', 26.97, 'shipped', '123 Main St, DeKalb, IL'),
(4, 1, NULL, '2026-11-21 16:45:00', 45.98, 'authorized', '123 Main St, DeKalb, IL'),
(5, 1, NULL, '2026-11-22 11:20:00', 17.99, 'shipped', '123 Main St, DeKalb, IL');


-- ORDER ITEMS

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 9.99),
(1, 3, 1, 49.99),
(2, 5, 1, 129.99),
(3, 4, 2, 6.99),
(3, 9, 1, 14.99),
(4, 6, 1, 29.99),
(4, 2, 1, 15.99),
(5, 1, 1, 9.99);


-- PAYMENTS

INSERT INTO payments (order_id, amount, payment_status, payment_reference) VALUES
(1, 69.97, 'authorized', 'TEST-1001'),
(2, 137.98, 'authorized', 'TEST-1002'),
(3, 26.97, 'authorized', 'TEST-1003'),
(4, 45.98, 'authorized', 'TEST-1004'),
(5, 17.99, 'authorized', 'TEST-1005');


-- SHIPMENTS

INSERT INTO shipments
(order_id, rate_id, tracking_number, shipping_status, shipping_cost)
VALUES
(1, 2, NULL, 'pending', 7.99),
(2, 4, NULL, 'pending', 19.99),
(3, 2, 'TEST-1003', 'shipped', 7.99),
(4, 3, NULL, 'pending', 12.99),
(5, 2, 'TEST-1005', 'shipped', 7.99);