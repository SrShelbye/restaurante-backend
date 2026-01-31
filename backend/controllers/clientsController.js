const supabase = require('../config/database');

// Get clients
const getClients = async (req, res) => {
    try {
        const { limit = 10, offset = 0, search = '' } = req.query;

        let query = supabase
            .from('clients')
            .select('*')
            .eq('is_active', true)
            .order('name');

        // Apply search if exists
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
};

// Create client
const createClient = async (req, res) => {
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
};

// Get client by ID
const getClientById = async (req, res) => {
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
};

// Update client
const updateClient = async (req, res) => {
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
};

// Delete client (soft delete)
const deleteClient = async (req, res) => {
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
};

module.exports = {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient
};
