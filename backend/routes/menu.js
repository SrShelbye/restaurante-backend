const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Obtener menú por restaurante
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const { data: menu, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(*),
        production_area:production_areas(*),
        recipe_ingredients:recipe_ingredients(
          *,
          ingredient:ingredients(*)
        )
      `
      )
      .eq('is_active', true)
      .order('category_id, name');

    if (error) {
      console.error('Error fetching menu:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching menu'
      });
    }

    res.json({
      success: true,
      data: menu || []
    });
  } catch (error) {
    console.error('Menu endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Obtener secciones del menú
router.get('/sections/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

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
    console.error('Sections endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
