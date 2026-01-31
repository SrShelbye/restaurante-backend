const express = require('express');
const {
    getProductionAreas,
    createProductionArea
} = require('../controllers/productionAreasController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener áreas de producción
router.get('/', getProductionAreas);

// Crear área de producción
router.post('/', authenticateToken, createProductionArea);

module.exports = router;
