const supabase = require('../config/database');

// --- Admin/Authenticated Endpoints ---

// Get menu sections (admin)
const getSections = async (req, res) => {
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
};

// Get categories (admin)
const getCategories = async (req, res) => {
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
};

// Get products (admin)
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
        console.error('Products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create section (admin)
const createSection = async (req, res) => {
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
};

// --- Public/Restaurant Specific Endpoints ---

// Get public menu by restaurant ID
const getPublicMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        // Note: Currently restaurantId logic is not fully implemented in DB queries in original code, 
        // but we keep the signature.

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
};

// Get public sections by restaurant ID
const getPublicSections = async (req, res) => {
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
};

module.exports = {
    getSections,
    getCategories,
    getProducts,
    createSection,
    getPublicMenu,
    getPublicSections
};
