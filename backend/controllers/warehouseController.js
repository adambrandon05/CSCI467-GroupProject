
const db = require('../config/database');

// Get orders waiting to ship
exports.getOrders = async (req, res) => {
    try {
        const orders = await db.query(
            "SELECT * FROM orders WHERE status = 'authorized'"
        );

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get orders' });
    }
};

// Get an individual order and its products
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        const orders = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        const items = await db.query(`
            SELECT
                products.name,
                order_items.quantity,
                order_items.unit_price
            FROM order_items
            JOIN products
                ON order_items.product_id = products.id
            WHERE order_items.order_id = ?
        `, [orderId]);

        const shipments = await db.query(
            'SELECT * FROM shipments WHERE order_id = ?',
            [orderId]
        );

        res.json({
            order: orders[0],
            items,
            shipments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to get order details'
        });
    }
};

// Mark an order as shipped
exports.shipOrder = async (req, res) => {
    const orderId = req.params.id;
    const { trackingNumber } = req.body;

    if (typeof trackingNumber !== 'string' ||
        !trackingNumber.trim()) {
        return res.status(400).json({
            error: 'Tracking number required'
        });
    }

    let conn;

    try {
        conn = await db.getConnection();
        await conn.beginTransaction();

        const order = await conn.query(
            `UPDATE orders
             SET status = 'shipped'
             WHERE id = ? AND status = 'authorized'`,
            [orderId]
        );

        if (Number(order.affectedRows) === 0) {
            await conn.rollback();
            return res.status(409).json({
                error: 'Order is not authorized or does not exist'
            });
        }

        const shipment = await conn.query(
            `UPDATE shipments
             SET shipping_status = 'shipped',
                 tracking_number = ?
             WHERE order_id = ?
               AND shipping_status = 'pending'`,
            [trackingNumber.trim(), orderId]
        );

        if (Number(shipment.affectedRows) === 0) {
            await conn.rollback();
            return res.status(409).json({
                error: 'Pending shipment not found'
            });
        }

        await conn.commit();

        res.json({ message: 'Order shipped successfully' });
    } catch (error) {
        if (conn) {
            try {
                await conn.rollback();
            } catch (err) {
                console.error(err);
            }
        }

        console.error(error);
        res.status(500).json({
            error: 'Failed to ship order'
        });
    } finally {
        if (conn) conn.release();
    }
};
