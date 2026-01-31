const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Obtener secciones del menú
router.get('/sections', authenticateToken, async (req, res) => {
  try {
    const { data: sections, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('name');

    if (error) {
      console.error('Error fetching sections:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching sections'
      });
    }

    res.json({
      success: true,
      data: sections || []
    });
  } catch (error) {
    console.error('Sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener categorías
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching categories'
      });
    }

    res.json({
      success: true,
      data: categories || []
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener productos del menú
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(*),
        production_area:production_areas(*)
      `
      )
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching products'
      });
    }

    res.json({
      success: true,
      data: products || []
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Crear sección
router.post('/sections', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Section name is required'
      });
    }

    const { data: newSection, error } = await supabase
      .from('categories')
      .insert({
        name,
        description,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating section'
      });
    }

    res.status(201).json({
      success: true,
      data: newSection
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
