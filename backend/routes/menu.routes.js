const express = require('express');
const {
  getSections,
  getCategories,
  getProducts,
  createSection,
  getPublicMenu,
  getPublicSections
} = require('../controllers/menuController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Rutas Administrativas (Requieren Auth) ---
router.get('/sections', authenticateToken, getSections);
router.get('/categories', authenticateToken, getCategories);
router.get('/products', authenticateToken, getProducts);
router.post('/sections', authenticateToken, createSection);

// --- Rutas Públicas / Por Restaurante ---
// Nota: Estas rutas parecen solapar con /sections si no se tiene cuidado, pero como sections es estático y :restaurantId es dinámico,
// Express resuelve en orden.
// Para evitar conflictos, :restaurantId debería ser algo como GUID.
// En el original 'menu.js', las rutas eran /:restaurantId y /sections/:restaurantId.

router.get('/sections/:restaurantId', getPublicSections);
router.get('/:restaurantId', getPublicMenu);

module.exports = router;
