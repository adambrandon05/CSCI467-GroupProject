const db = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.query(`
            SELECT
                id,
                name AS Name,
                description AS Description,
                price AS Price,
                weight AS Weight,
                category AS Category
            FROM products
        `);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to retrieve products'
        });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const products = await db.query(`
            SELECT
                id,
                name AS Name,
                description AS Description,
                price AS Price,
                weight AS Weight,
                category AS Category
            FROM products
            WHERE id = ?
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to retrieve product'
        });
    }
};
