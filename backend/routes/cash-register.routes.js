const express = require('express');
const {
    getActiveCashRegisters,
    createCashRegister
} = require('../controllers/cashRegisterController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener cajas activas
router.get('/actives', getActiveCashRegisters);

// Crear caja
router.post('/', authenticateToken, createCashRegister);

module.exports = router;
