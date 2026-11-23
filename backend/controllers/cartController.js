const db = require('../config/database');

const isPositiveInt = (value) =>
    Number.isInteger(value) && value > 0;

// Find or create active cart
async function getOrCreateCartId(userId) {
    const carts = await db.query(
        "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
        [userId]
    );

    if (carts.length > 0) {
        return Number(carts[0].id);
    }

    const result = await db.query(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
    );

    return Number(result.insertId);
}

// Get available inventory
async function getStock(productId) {
    const rows = await db.query(
        `SELECT available_quantity AS stock
         FROM inventory
         WHERE product_id = ?`,
        [productId]
    );

    return rows.length > 0 ? Number(rows[0].stock) : null;
}

// Get authenticated user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        const cartId = await getOrCreateCartId(userId);

        const items = await db.query(
            `SELECT
                i.id,
                i.product_id AS productId,
                p.name,
                p.price,
                p.weight,
                i.quantity
             FROM cart_items i
             JOIN products p ON p.id = i.product_id
             WHERE i.cart_id = ?`,
            [cartId]
        );

        res.json({ cartId, items });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to retrieve cart'
        });
    }
};

// Add product to cart
exports.addItem = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.body;
        const quantity = req.body.quantity ?? 1;

        if (![productId, quantity].every(isPositiveInt)) {
            return res.status(400).json({
                error: 'Product id and quantity must be positive integers'
            });
        }

        const stock = await getStock(productId);

        if (stock === null) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        const cartId = await getOrCreateCartId(userId);

        const existing = await db.query(
            `SELECT quantity
             FROM cart_items
             WHERE cart_id = ? AND product_id = ?`,
            [cartId, productId]
        );

        const currentQuantity = existing.length > 0
            ? Number(existing[0].quantity)
            : 0;

        const newQuantity = currentQuantity + quantity;

        if (newQuantity > stock) {
            return res.status(409).json({
                error: 'Not enough stock available'
            });
        }

        await db.query(
            `INSERT INTO cart_items
                (cart_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
                quantity = VALUES(quantity)`,
            [cartId, productId, newQuantity]
        );

        res.status(201).json({
            message: 'Item added to cart'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to add item to cart'
        });
    }
};

// Update cart item quantity
exports.updateItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        const userId = req.session.userId;

        if (!isPositiveInt(id) || !isPositiveInt(quantity)) {
            return res.status(400).json({
                error: 'Item id and quantity must be positive integers'
            });
        }

        // Verify that this item belongs to this user
        const items = await db.query(
            `SELECT i.product_id
             FROM cart_items i
             JOIN carts c ON i.cart_id = c.id
             WHERE i.id = ?
               AND c.user_id = ?
               AND c.status = 'active'`,
            [id, userId]
        );

        if (items.length === 0) {
            return res.status(404).json({
                error: 'Cart item not found'
            });
        }

        const stock = await getStock(
            Number(items[0].product_id)
        );

        if (stock === null || quantity > stock) {
            return res.status(409).json({
                error: 'Not enough stock available'
            });
        }

        const result = await db.query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE id = ?
               AND cart_id IN (
                   SELECT id
                   FROM carts
                   WHERE user_id = ?
                     AND status = 'active'
               )`,
            [quantity, id, userId]
        );

        if (Number(result.affectedRows) === 0) {
            return res.status(404).json({
                error: 'Cart item not found or unchanged'
            });
        }

        res.json({
            message: 'Cart item updated'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to update cart item'
        });
    }
};

// Remove product from cart
exports.removeItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.session.userId;

        if (!isPositiveInt(id)) {
            return res.status(400).json({
                error: 'Invalid item id'
            });
        }

        const result = await db.query(
            `DELETE FROM cart_items
             WHERE id = ?
               AND cart_id IN (
                   SELECT id
                   FROM carts
                   WHERE user_id = ?
                     AND status = 'active'
               )`,
            [id, userId]
        );

        if (Number(result.affectedRows) === 0) {
            return res.status(404).json({
                error: 'Cart item not found'
            });
        }

        res.json({
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to remove cart item'
        });
    }
};
