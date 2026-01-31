const express = require('express');
const {
    getActiveOrders,
    getAllOrders,
    createOrder,
    updateOrderStatus
} = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener pedidos activos
router.get('/actives', getActiveOrders);

// Obtener todos los pedidos
router.get('/', getAllOrders);

// Crear pedido
router.post('/', authenticateToken, createOrder);

// Actualizar estado de pedido
router.patch('/:id/status', authenticateToken, updateOrderStatus);

module.exports = router;
