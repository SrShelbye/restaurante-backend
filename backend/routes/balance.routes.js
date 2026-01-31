const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/authMiddleware');
if (typeof authenticateToken !== 'function') console.error('CRITICAL: authenticateToken invalid in balance.routes.js');

const router = express.Router();

// Obtener finanzas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;

    // Datos financieros básicos
    const financialData = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      cashFlow: []
    };

    res.json({
      success: true,
      data: financialData
    });
  } catch (error) {
    console.error('Finances error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener transacciones
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0, startDate, endDate } = req.query;

    const transactionsData = [];

    res.json({
      success: true,
      data: transactionsData,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 0
      }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
