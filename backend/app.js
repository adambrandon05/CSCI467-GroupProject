const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Temporary test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Express backend working!' });
});
// temporary database test endpoint
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await db.query('SELECT 1 AS connected');

        res.json({
            message: 'MariaDB connected successfully!',
            result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Database connection failed'
        });
    }
});

module.exports = app;