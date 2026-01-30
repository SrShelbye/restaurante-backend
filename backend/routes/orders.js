const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Obtener pedidos activos
router.get('/actives', async (req, res) => {
  try {
    const { limit = 50, offset = 0, startDate, period = 'daily' } = req.query;

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        client:clients(*),
        order_details:order_details(*, product:products(*))
      `
      )
      .in('status', ['pending', 'preparing', 'ready'])
      .order('created_at', { ascending: false });

    // Aplicar filtro de fecha si existe
    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    const { data: orders, error } = await query.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    if (error) {
      console.error('Error fetching active orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching active orders'
      });
    }

    res.json({
      success: true,
      data: orders || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: orders ? orders.length : 0
      }
    });
  } catch (error) {
    console.error('Active orders endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, startDate, endDate } = req.query;

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        client:clients(*),
        order_details:order_details(*, product:products(*))
      `
      )
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: orders, error } = await query.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching orders'
      });
    }

    res.json({
      success: true,
      data: orders || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: orders ? orders.length : 0
      }
    });
  } catch (error) {
    console.error('Orders endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Crear pedido
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { client_id, table_number, total_amount, notes, order_details } =
      req.body;

    if (!total_amount || !order_details || order_details.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount and order details are required'
      });
    }

    // Crear pedido
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        client_id,
        table_number,
        total_amount: parseFloat(total_amount),
        notes,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return res.status(500).json({
        success: false,
        message: 'Error creating order'
      });
    }

    // Crear detalles del pedido
    const orderDetailsData = order_details.map((detail) => ({
      order_id: newOrder.id,
      product_id: detail.product_id,
      quantity: parseInt(detail.quantity),
      unit_price: parseFloat(detail.unit_price),
      subtotal: parseFloat(detail.unit_price) * parseInt(detail.quantity),
      notes: detail.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: detailsError } = await supabase
      .from('order_details')
      .insert(orderDetailsData);

    if (detailsError) {
      console.error('Error creating order details:', detailsError);
      return res.status(500).json({
        success: false,
        message: 'Error creating order details'
      });
    }

    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Actualizar estado de pedido
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating order status'
      });
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
