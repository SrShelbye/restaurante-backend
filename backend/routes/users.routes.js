const express = require('express');
const { getUsers, createUser } = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener usuarios
router.get('/', authenticateToken, getUsers);

// Crear usuario
router.post('/', authenticateToken, createUser);

module.exports = router;
