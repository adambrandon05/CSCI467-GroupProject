const db = require('../config/database');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Check if email already exists
        const existingUsers = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Create customer account
        const result = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, password, 'customer']
        );

        res.status(201).json({
            message: 'Account created successfully',
            userId: result.insertId.toString()
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to register user'
        });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const users = await db.query(
            'SELECT id, email, password, role FROM users WHERE email = ?',
            [email]
        );

        // Check credentials
        if (users.length === 0 ||
            users[0].password !== password) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Return user information
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to login'
        });
    }
};
