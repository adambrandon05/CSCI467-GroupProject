
const express = require('express');
const router = express.Router();

const db = require('../config/database');
const requireAuth = require('../middleware/authMiddleware');
const warehouseController = require('../controllers/warehouseController');

// Only employees and admins can access the warehouse
async function requireEmployee(req, res, next) {
    try {
        const users = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [req.session.userId]
        );

        if (
            users.length === 0 ||
            !['employee', 'admin'].includes(users[0].role)
        ) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
}

router.use(requireAuth);
router.use(requireEmployee);

router.get('/orders', warehouseController.getOrders);
router.get('/orders/:id', warehouseController.getOrderById);
router.patch('/orders/:id/ship', warehouseController.shipOrder);

module.exports = router;
