const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener facturas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0, startDate, endDate } = req.query;

    const invoicesData = [];

    res.json({
      success: true,
      data: invoicesData,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 0
      }
    });
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Crear factura
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { order_id, client_id, total_amount, tax_amount, items } = req.body;

    if (!order_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and total amount are required'
      });
    }

    const { data: newInvoice, error } = await supabase
      .from('invoices')
      .insert({
        order_id,
        client_id,
        total_amount: parseFloat(total_amount),
        tax_amount: parseFloat(tax_amount || 0),
        status: 'issued',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating invoice'
      });
    }

    res.status(201).json({
      success: true,
      data: newInvoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
