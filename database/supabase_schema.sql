-- Sistema ERP/POS Gastronómico - Esquema de Base de Datos
-- Creado para PostgreSQL en Supabase

-- Habilitar la extensión UUID para generación automática de IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipo enumerado para tipos de movimiento de stock
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- Crear tipo enumerado para tipos de referencia
CREATE TYPE reference_type AS ENUM ('sale', 'purchase', 'adjustment', 'production');

-- Tabla: Categorías
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Proveedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Ingredientes
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'unidad',
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    min_stock DECIMAL(10,3) NOT NULL DEFAULT 10,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Áreas de Producción
CREATE TABLE production_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    margin_percentage DECIMAL(5,2) NOT NULL DEFAULT 30,
    total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    production_area_id UUID NOT NULL REFERENCES production_areas(id) ON DELETE RESTRICT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Ingredientes de Receta (relación muchos a muchos)
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    gross_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    net_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    waste_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient_id)
);

-- Tabla: Grupos de Modificadores
CREATE TABLE modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_selections INTEGER NOT NULL DEFAULT 1,
    max_selections INTEGER NOT NULL DEFAULT 1,
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Opciones de Modificadores
CREATE TABLE modifier_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    additional_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Relación entre Productos y Grupos de Modificadores
CREATE TABLE product_modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, modifier_group_id)
);

-- Tabla: Movimientos de Stock
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    movement_type movement_type NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    reference_id UUID,
    reference_type reference_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    document_type VARCHAR(20),
    document_number VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Órdenes/Ventas (simplificada para empezar)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    table_number VARCHAR(10),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: Detalles de Orden
CREATE TABLE order_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_active ON ingredients(is_active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_area ON products(production_area_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_stock_movements_ingredient ON stock_movements(ingredient_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_areas_updated_at BEFORE UPDATE ON production_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipe_ingredients_updated_at BEFORE UPDATE ON recipe_ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modifier_groups_updated_at BEFORE UPDATE ON modifier_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modifier_options_updated_at BEFORE UPDATE ON modifier_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_details_updated_at BEFORE UPDATE ON order_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular automáticamente el costo total de un producto
CREATE OR REPLACE FUNCTION calculate_product_cost(product_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_cost DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(ri.gross_quantity * i.unit_cost), 0)
    INTO total_cost
    FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE ri.recipe_id = product_id_param;
    
    -- Actualizar el costo del producto
    UPDATE products 
    SET total_cost = total_cost
    WHERE id = product_id_param;
    
    RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente el costo cuando cambia la receta
CREATE OR REPLACE FUNCTION trigger_product_cost_calculation()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        PERFORM calculate_product_cost(NEW.recipe_id);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_cost_after_recipe_change
    AFTER INSERT OR UPDATE OR DELETE ON recipe_ingredients
    FOR EACH ROW EXECUTE FUNCTION trigger_product_cost_calculation();

-- Vista para productos con información completa
CREATE VIEW products_complete AS
SELECT 
    p.*,
    c.name as category_name,
    pa.name as production_area_name,
    -- Calcular margen real
    CASE 
        WHEN p.base_price > 0 THEN 
            ROUND(((p.final_price - p.total_cost) / p.final_price) * 100, 2)
        ELSE 0 
    END as real_margin_percentage
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN production_areas pa ON p.production_area_id = pa.id
WHERE p.is_active = true;

-- Vista para ingredientes con stock bajo
CREATE VIEW low_stock_ingredients AS
SELECT 
    i.*,
    s.name as supplier_name,
    CASE 
        WHEN i.current_stock <= 0 THEN 'SIN STOCK'
        WHEN i.current_stock <= i.min_stock THEN 'STOCK BAJO'
        ELSE 'OK'
    END as stock_status
FROM ingredients i
LEFT JOIN suppliers s ON i.supplier_id = s.id
WHERE i.is_active = true 
AND i.current_stock <= i.min_stock;

-- Vista para valor total del inventario
CREATE VIEW inventory_value AS
SELECT 
    SUM(i.current_stock * i.unit_cost) as total_value,
    COUNT(i.id) as total_ingredients,
    COUNT(CASE WHEN i.current_stock <= i.min_stock THEN 1 END) as low_stock_count,
    COUNT(CASE WHEN i.current_stock <= 0 THEN 1 END) as out_of_stock_count
FROM ingredients i
WHERE i.is_active = true;

-- Políticas de seguridad para Supabase (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (temporalmente permitimos todo para desarrollo)
-- En producción, estas políticas deberían ser más restrictivas
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL;
CREATE POLICY "Allow all operations on suppliers" ON suppliers FOR ALL;
CREATE POLICY "Allow all operations on ingredients" ON ingredients FOR ALL;
CREATE POLICY "Allow all operations on production_areas" ON production_areas FOR ALL;
CREATE POLICY "Allow all operations on products" ON products FOR ALL;
CREATE POLICY "Allow all operations on recipe_ingredients" ON recipe_ingredients FOR ALL;
CREATE POLICY "Allow all operations on modifier_groups" ON modifier_groups FOR ALL;
CREATE POLICY "Allow all operations on modifier_options" ON modifier_options FOR ALL;
CREATE POLICY "Allow all operations on product_modifier_groups" ON product_modifier_groups FOR ALL;
CREATE POLICY "Allow all operations on stock_movements" ON stock_movements FOR ALL;
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL;
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL;
CREATE POLICY "Allow all operations on order_details" ON order_details FOR ALL;

-- Insertar datos iniciales básicos
INSERT INTO categories (name, description) VALUES
    ('Bebidas', 'Todas las bebidas y refrescos'),
    ('Entradas', 'Aperitivos y platos de entrada'),
    ('Platos Principales', 'Platos principales del menú'),
    ('Postres', 'Dulces y postres'),
    ('Salsas', 'Salsas y acompañamientos');

INSERT INTO production_areas (name, description, "order") VALUES
    ('Bar', 'Bebidas y cócteles', 1),
    ('Cocina', 'Platos calientes', 2),
    ('Parrilla', 'Platos a la parrilla', 3),
    ('Postres', 'Preparación de postres', 4);

INSERT INTO suppliers (name, contact_person, phone) VALUES
    ('Distribuidora Central', 'Juan Pérez', '555-0101'),
    ('Frutas y Verduras S.A.', 'María García', '555-0102'),
    ('Carnes Premium', 'Carlos Rodríguez', '555-0103');

-- Algunos ingredientes de ejemplo
INSERT INTO ingredients (name, unit_cost, unit, current_stock, min_stock, supplier_id) VALUES
    ('Tomate', 2.50, 'kg', 10.5, 5, (SELECT id FROM suppliers WHERE name = 'Frutas y Verduras S.A.')),
    ('Cebolla', 1.80, 'kg', 8.2, 3, (SELECT id FROM suppliers WHERE name = 'Frutas y Verduras S.A.')),
    ('Carne de Res', 45.00, 'kg', 15.0, 8, (SELECT id FROM suppliers WHERE name = 'Carnes Premium')),
    ('Pan', 0.80, 'unidad', 50, 20, (SELECT id FROM suppliers WHERE name = 'Distribuidora Central')),
    ('Queso', 28.00, 'kg', 5.5, 2, (SELECT id FROM suppliers WHERE name = 'Carnes Premium'));

COMMIT;