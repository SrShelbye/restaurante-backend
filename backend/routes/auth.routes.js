const express = require('express');
const { register, login, renew, logout, authenticateToken } = require('./auth');

const router = express.Router();

// Registro - ENDPOINT QUE FALTABA
router.post('/register', register);

// Login
router.post('/login', login);

// Renovar token
router.get('/renew', authenticateToken, renew);

// Logout
router.post('/logout', authenticateToken, logout);

module.exports = router;
