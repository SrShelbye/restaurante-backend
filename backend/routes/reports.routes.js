const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

console.log('Loading reports.routes.js');
console.log('authenticateToken type:', typeof authenticateToken);
if (typeof authenticateToken !== 'function') {
  console.error('CRITICAL: authenticateToken is not a function in reports.routes.js!');
  console.error('Value:', authenticateToken);
}

const router = express.Router();

// Dashboard reports
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Métricas básicas del dashboard
    const dashboardData = {
      totalOrders: 0,
      activeOrders: 0,
      totalRevenue: 0,
      totalClients: 0
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Products reports
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Reporte de productos más vendidos
    const productsData = [];

    res.json({
      success: true,
      data: productsData
    });
  } catch (error) {
    console.error('Products reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Incomes reports
router.get('/incomes', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    // Reporte de ingresos
    const incomesData = [];

    res.json({
      success: true,
      data: incomesData
    });
  } catch (error) {
    console.error('Incomes reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
