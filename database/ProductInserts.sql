-- AutoParts Store sample product data
-- Run after database/schema.sql, on a database that does not already contain these IDs.
-- Prices are in USD; weights follow the units defined by your application.

INSERT INTO `Products` (`id`, `Name`, `Description`, `Price`, `Weight`, `Category`) VALUES
(1,'Oil Filter','Replacement engine oil filter',9.99,0.50,'Filters'),
(2,'Air Filter','Replacement engine air filter',15.99,0.75,'Filters'),
(3,'Brake Pad Set','Front brake pad replacement set',49.99,4.00,'Brakes'),
(4,'Spark Plug','Replacement spark plug',6.99,0.10,'Ignition'),
(5,'Car Battery','12-volt automotive battery',129.99,35.00,'Electrical'),
(6,'5W-30 Engine Oil','5-quart bottle of synthetic 5W-30 engine oil',29.99,9.50,'Fluids'),
(7,'0W-20 Engine Oil','5-quart bottle of synthetic 0W-20 engine oil',32.99,9.50,'Fluids'),
(8,'Cabin Air Filter','Replacement filter for cabin ventilation',18.99,0.40,'Filters'),
(9,'Wiper Blade','Replacement windshield wiper blade',14.99,0.50,'Accessories'),
(10,'Brake Rotor','Replacement brake rotor',64.99,15.00,'Brakes'),
(11,'Headlight Bulb','Replacement automotive headlight bulb',12.99,0.20,'Lighting'),
(12,'Serpentine Belt','Replacement engine accessory drive belt',24.99,0.60,'Engine'),
(13,'Engine Coolant','1-gallon bottle of premixed engine coolant',16.99,9.00,'Fluids'),
(14,'Brake Fluid','12-ounce bottle of DOT 3 brake fluid',5.99,0.90,'Fluids'),
(15,'Windshield Washer Fluid','1-gallon bottle of windshield washer fluid',4.99,8.50,'Fluids');

-- Starting stock for the 15 sample products.
INSERT INTO `Inventory` (`id`, `product_id`, `available quantity`) VALUES
(1,1,50),
(2,2,40),
(3,3,25),
(4,4,100),
(5,5,15),
(6,6,50),
(7,7,50),
(8,8,30),
(9,9,60),
(10,10,20),
(11,11,40),
(12,12,25),
(13,13,35),
(14,14,30),
(15,15,60);
