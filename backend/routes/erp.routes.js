const express = require('express');
const {
    getIngredients,
    getProducts,
    getStockCalculation
} = require('../controllers/erpController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Ingredientes
router.get('/ingredients', getIngredients);

// Productos
router.get('/products', getProducts);

// Cálculo de stock
router.get('/stock-calculation', getStockCalculation);

module.exports = router;
