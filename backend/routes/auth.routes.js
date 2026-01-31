const express = require('express');
const { register, login, renew, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Registro
router.post('/register', register);

// Login
router.post('/login', login);

// Renovar token
router.get('/renew', authenticateToken, renew);

// Logout
router.post('/logout', authenticateToken, logout);

module.exports = router;
