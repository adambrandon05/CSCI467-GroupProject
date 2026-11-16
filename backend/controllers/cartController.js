const db = require('../config/database');

const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

async function getOrCreateCartId(userId) {
    const carts = await db.query(
        "SELECT `id` FROM `Carts` WHERE `user_id` = ? AND `status` = 'active'",
        [userId]
    );

    if (carts.length > 0) {
        return carts[0].id;
    }

    const result = await db.query(
        'INSERT INTO `Carts` (`user_id`) VALUES (?)',
        [userId]
    );

    return Number(result.insertId);
}

async function getStock(productId) {
    const rows = await db.query(
        'SELECT `available quantity` AS stock FROM `Inventory` WHERE `product_id` = ?',
        [productId]
    );

    return rows.length > 0 ? rows[0].stock : null;
}

exports.getCart = async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        if (!isPositiveInt(userId)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        const cartId = await getOrCreateCartId(userId);

        const items = await db.query(
            'SELECT i.`id`, i.`product_id` AS productId, p.`Name` AS name, ' +
            'p.`Price` AS price, p.`Weight` AS weight, i.`Quantity` AS quantity ' +
            'FROM `Items in Cart` i ' +
            'JOIN `Products` p ON p.`id` = i.`product_id` ' +
            'WHERE i.`cart_id` = ?',
            [cartId]
        );

        res.json({ cartId, items });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const quantity = req.body.quantity ?? 1;

        if (![userId, productId, quantity].every(isPositiveInt)) {
            return res.status(400).json({
                error: 'userId, productId, and quantity must be positive integers'
            });
        }

        const stock = await getStock(productId);

        if (stock === null) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const cartId = await getOrCreateCartId(userId);

        const existing = await db.query(
            'SELECT `Quantity` AS quantity FROM `Items in Cart` WHERE `cart_id` = ? AND `product_id` = ?',
            [cartId, productId]
        );

        const newQuantity = (existing.length > 0 ? existing[0].quantity : 0) + quantity;

        if (newQuantity > stock) {
            return res.status(409).json({ error: 'Not enough stock available' });
        }

        await db.query(
            'INSERT INTO `Items in Cart` (`cart_id`, `product_id`, `Quantity`) VALUES (?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE `Quantity` = VALUES(`Quantity`)',
            [cartId, productId, newQuantity]
        );

        res.status(201).json({ message: 'Item added to cart' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { quantity } = req.body;

        if (!isPositiveInt(id) || !isPositiveInt(quantity)) {
            return res.status(400).json({
                error: 'Item id and quantity must be positive integers'
            });
        }

        const items = await db.query(
            'SELECT `product_id` FROM `Items in Cart` WHERE `id` = ?',
            [id]
        );

        if (items.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const stock = await getStock(items[0].product_id);

        if (quantity > stock) {
            return res.status(409).json({ error: 'Not enough stock available' });
        }

        await db.query(
            'UPDATE `Items in Cart` SET `Quantity` = ? WHERE `id` = ?',
            [quantity, id]
        );

        res.json({ message: 'Cart item updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!isPositiveInt(id)) {
            return res.status(400).json({ error: 'Invalid item id' });
        }

        const result = await db.query(
            'DELETE FROM `Items in Cart` WHERE `id` = ?',
            [id]
        );

        if (Number(result.affectedRows) === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
};