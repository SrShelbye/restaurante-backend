const supabase = require('../config/database');

// Ingredients
const getIngredients = async (req, res) => {
    try {
        const { data: ingredients, error } = await supabase
            .from('ingredients')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) {
            console.error('Error fetching ingredients:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching ingredients'
            });
        }

        res.json({
            success: true,
            data: ingredients || []
        });
    } catch (error) {
        console.error('Ingredients endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Products
const getProducts = async (req, res) => {
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
        console.error('Products endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Stock calculation
const getStockCalculation = async (req, res) => {
    try {
        // Get total inventory value
        const { data: ingredients, error: ingredientsError } = await supabase
            .from('ingredients')
            .select('current_stock, unit_cost, min_stock')
            .eq('is_active', true);

        if (ingredientsError) {
            console.error('Error calculating stock:', ingredientsError);
            return res.status(500).json({
                success: false,
                message: 'Error calculating stock'
            });
        }

        const totalValue = (ingredients || []).reduce(
            (sum, item) => sum + item.current_stock * item.unit_cost,
            0
        );

        const lowStockItems = (ingredients || []).filter(
            (item) => item.current_stock <= item.min_stock
        );

        // Get recent movements
        const { data: movements, error: movementsError } = await supabase
            .from('stock_movements')
            .select('*, ingredient:ingredients(*)')
            .order('created_at', { ascending: false })
            .limit(50);

        if (movementsError) {
            console.error('Error fetching movements:', movementsError);
            // Non-critical error, continue
        }

        res.json({
            success: true,
            data: {
                total_value: totalValue,
                low_stock_items: lowStockItems,
                stock_movements: movements || []
            }
        });
    } catch (error) {
        console.error('Stock calculation endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getIngredients,
    getProducts,
    getStockCalculation
};
