const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Obtener clientes
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = '' } = req.query;

    let query = supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('name');

    // Aplicar búsqueda si existe
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data: clients, error } = await query.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    if (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching clients'
      });
    }

    res.json({
      success: true,
      data: clients || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: clients ? clients.length : 0
      }
    });
  } catch (error) {
    console.error('Clients endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Crear cliente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, document_type, document_number, address } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required'
      });
    }

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name,
        email,
        phone,
        document_type,
        document_number,
        address,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating client'
      });
    }

    res.status(201).json({
      success: true,
      data: newClient
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Actualizar cliente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating client'
      });
    }

    res.json({
      success: true,
      data: updatedClient
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Eliminar cliente (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('clients')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting client'
      });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
