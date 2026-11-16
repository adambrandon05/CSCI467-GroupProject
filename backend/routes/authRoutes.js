const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const requireAuth = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Check active session
router.get('/me', requireAuth, authController.me);

// Logout
router.post('/logout', requireAuth, authController.logout);

module.exports = router;