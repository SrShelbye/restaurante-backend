const supabase = require('../config/database');

// Get production areas
const getProductionAreas = async (req, res) => {
    try {
        const { data: areas, error } = await supabase
            .from('production_areas')
            .select('*')
            .eq('is_active', true)
            .order('order');

        if (error) {
            console.error('Error fetching production areas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching production areas'
            });
        }

        res.json({
            success: true,
            data: areas || []
        });
    } catch (error) {
        console.error('Production areas endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create production area
const createProductionArea = async (req, res) => {
    try {
        const { name, description, order } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Production area name is required'
            });
        }

        const { data: newArea, error } = await supabase
            .from('production_areas')
            .insert({
                name,
                description,
                order: order || 0,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating production area:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating production area'
            });
        }

        res.status(201).json({
            success: true,
            data: newArea
        });
    } catch (error) {
        console.error('Create production area error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getProductionAreas,
    createProductionArea
};
