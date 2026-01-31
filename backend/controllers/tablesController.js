const supabase = require('../config/database');

// Get tables
const getTables = async (req, res) => {
    try {
        const { limit = 50, offset = 0, search = '' } = req.query;

        let query = supabase
            .from('tables')
            .select('*')
            .eq('is_active', true)
            .order('table_number');

        // Apply search if exists
        if (search) {
            query = query.ilike('table_number', `%${search}%`);
        }

        const { data: tables, error } = await query.range(
            parseInt(offset),
            parseInt(offset) + parseInt(limit) - 1
        );

        if (error) {
            console.error('Error fetching tables:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching tables'
            });
        }

        res.json({
            success: true,
            data: tables || [],
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: tables ? tables.length : 0
            }
        });
    } catch (error) {
        console.error('Tables endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create table
const createTable = async (req, res) => {
    try {
        const { table_number, capacity, location, status = 'available' } = req.body;

        if (!table_number || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Table number and capacity are required'
            });
        }

        const { data: newTable, error } = await supabase
            .from('tables')
            .insert({
                table_number,
                capacity: parseInt(capacity),
                location,
                status,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating table:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating table'
            });
        }

        res.status(201).json({
            success: true,
            data: newTable
        });
    } catch (error) {
        console.error('Create table error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update table
const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data: updatedTable, error } = await supabase
            .from('tables')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating table:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating table'
            });
        }

        res.json({
            success: true,
            data: updatedTable
        });
    } catch (error) {
        console.error('Update table error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete table
const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('tables')
            .update({
                is_active: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Error deleting table:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting table'
            });
        }

        res.json({
            success: true,
            message: 'Table deleted successfully'
        });
    } catch (error) {
        console.error('Delete table error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getTables,
    createTable,
    updateTable,
    deleteTable
};
