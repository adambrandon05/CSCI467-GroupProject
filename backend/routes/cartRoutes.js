const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/:userId', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:id', cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);

module.exports = router;