const express = require('express');
const {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient
} = require('../controllers/clientsController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener clientes
router.get('/', getClients);

// Crear cliente
router.post('/', authenticateToken, createClient);

// Obtener cliente por ID
router.get('/:id', getClientById);

// Actualizar cliente
router.put('/:id', authenticateToken, updateClient);

// Eliminar cliente (soft delete)
router.delete('/:id', authenticateToken, deleteClient);

module.exports = router;
