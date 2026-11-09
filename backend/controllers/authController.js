const db = require('../config/database');

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: 'Name, email, and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if email already exists
        const existingUsers = await db.query(
            'SELECT id FROM `Users` WHERE `Email` = ?',
            [normalizedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Insert new customer
        const result = await db.query(
            `INSERT INTO \`Users\`
                (\`Name\`, \`Email\`, \`Password\`, \`Role\`)
             VALUES (?, ?, ?, ?)`,
            [name.trim(), normalizedEmail, password, 'customer']
        );

        res.status(201).json({
            message: 'Account created successfully',
            userId: result.insertId.toString()
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        res.status(500).json({
            error: 'Registration failed'
        });
    }
};

// Login existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const users = await db.query(
            `SELECT
                \`id\`,
                \`Name\` AS name,
                \`Email\` AS email,
                \`Password\` AS password,
                \`Role\` AS role
             FROM \`Users\`
             WHERE \`Email\` = ?`,
            [email.trim().toLowerCase()]
        );

        // Verify credentials
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
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Login failed'
        });
    }
};
