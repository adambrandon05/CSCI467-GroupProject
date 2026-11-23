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

// Get order details
exports.getOrderById = async (req, res) => {
    try {
        const orders = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [req.params.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        const items = await db.query(`
            SELECT products.name, order_items.quantity,
                   order_items.unit_price
            FROM order_items
            JOIN products ON products.id = order_items.product_id
            WHERE order_items.order_id = ?
        `, [req.params.id]);

        const payments = await db.query(
            'SELECT * FROM payments WHERE order_id = ?',
            [req.params.id]
        );

        const shipments = await db.query(
            'SELECT * FROM shipments WHERE order_id = ?',
            [req.params.id]
        );

        res.json({
            order: orders[0],
            items,
            payments,
            shipments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get order details' });
    }
};

// Mark order as shipped
exports.shipOrder = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();
        await conn.beginTransaction();

        const order = await conn.query(
            `UPDATE orders SET status = 'shipped'
             WHERE id = ? AND status = 'authorized'`,
            [req.params.id]
        );

        if (Number(order.affectedRows) === 0) {
            await conn.rollback();
            return res.status(409).json({
                error: 'Order not found or already shipped'
            });
        }

        const shipment = await conn.query(
            `UPDATE shipments SET shipping_status = 'shipped'
             WHERE order_id = ? AND shipping_status = 'pending'`,
            [req.params.id]
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
        res.status(500).json({ error: 'Failed to ship order' });
    } finally {
        if (conn) conn.release();
    }
};