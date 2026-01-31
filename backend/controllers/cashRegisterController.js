const supabase = require('../config/database');

// Get active cash registers
const getActiveCashRegisters = async (req, res) => {
    try {
        const { data: cashRegisters, error } = await supabase
            .from('cash_registers')
            .select('*')
            .eq('is_active', true)
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching active cash registers:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching active cash registers'
            });
        }

        res.json({
            success: true,
            data: cashRegisters || []
        });
    } catch (error) {
        console.error('Cash registers endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create cash register (Open box)
const createCashRegister = async (req, res) => {
    try {
        const { opening_amount, user_id, notes } = req.body;

        if (!opening_amount || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'Opening amount and user ID are required'
            });
        }

        const { data: newCashRegister, error } = await supabase
            .from('cash_registers')
            .insert({
                opening_amount: parseFloat(opening_amount),
                current_amount: parseFloat(opening_amount),
                user_id,
                notes,
                status: 'open',
                is_active: true,
                opening_time: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating cash register:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating cash register'
            });
        }

        res.status(201).json({
            success: true,
            data: newCashRegister
        });
    } catch (error) {
        console.error('Create cash register error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getActiveCashRegisters,
    createCashRegister
};
