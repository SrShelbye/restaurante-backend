const express = require('express');
const {
    getTables,
    createTable,
    updateTable,
    deleteTable
} = require('../controllers/tablesController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener mesas
router.get('/', getTables); // Public or Authed? Original was public (no auth middleware used in route definition)

// Crear mesa
router.post('/', authenticateToken, createTable);

// Actualizar mesa
router.put('/:id', authenticateToken, updateTable);

// Eliminar mesa
router.delete('/:id', authenticateToken, deleteTable);

module.exports = router;
