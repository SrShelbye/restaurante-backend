const supabase = require('../config/database');
const bcrypt = require('bcryptjs');

// Get users
const getUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, username, email, first_name, last_name, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching users'
            });
        }

        res.json({
            success: true,
            data: users || []
        });
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create user
const createUser = async (req, res) => {
    try {
        const { username, email, first_name, last_name, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email and password are required'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                username,
                email,
                first_name,
                last_name,
                password: hashedPassword,
                role: role || 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select('id, username, email, first_name, last_name, role')
            .single();

        if (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating user'
            });
        }

        res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getUsers,
    createUser
};
