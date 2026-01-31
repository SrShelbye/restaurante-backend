const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Register user
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            username,
            password,
            samePassword,
            numPhone
        } = req.body;

        // Basic Validations
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        if (password !== samePassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .or(`username.eq.${username},email.eq.${email}`)
            .single();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in Supabase
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                first_name: firstName,
                last_name: lastName,
                email,
                username,
                password: hashedPassword,
                phone: numPhone,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (createError) {
            console.error('Create user error:', createError);
            return res.status(500).json({
                success: false,
                message: 'Error creating user'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respond with success
        res.json({
            success: true,
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name
            },
            currentRestaurant: null
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .or(`username.eq.${username},email.eq.${username}`)
            .single();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respond with success
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            },
            currentRestaurant: null
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

// Renew token
const renew = async (req, res) => {
    try {
        // This endpoint requires authentication (middleware handles verification before this)
        // Actually, renew often re-verifies.
        // The middleware already puts user in req.user

        const user = req.user; // From middleware

        // Generate new token
        const newToken = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: newToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            },
            currentRestaurant: null
        });
    } catch (error) {
        console.error('Renew token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during token renewal'
        });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        // Simple logout response
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout'
        });
    }
};

module.exports = {
    register,
    login,
    renew,
    logout
};
