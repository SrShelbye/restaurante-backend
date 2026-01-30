// Tipos de datos para el sistema ERP/POS Gastronómico

// Base de datos - Entidades principales
export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  unit_cost: number; // Costo unitario del ingrediente
  unit: string; // Unidad de medida (kg, litro, unidad, etc.)
  current_stock: number; // Stock actual
  min_stock: number; // Stock mínimo para reordenar
  supplier_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  gross_quantity: number; // Cantidad bruta necesaria
  net_quantity: number; // Cantidad neta después de desperdicio
  waste_percentage: number; // Porcentaje de desperdicio
  ingredient?: Ingredient; // Populated data
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  base_price: number; // Precio base sin margen
  final_price: number; // Precio final con margen
  margin_percentage: number; // Margen de utilidad %
  total_cost: number; // Costo total calculado de recetas
  production_area_id: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relaciones
  category?: Category;
  production_area?: ProductionArea;
  recipe_ingredients?: RecipeIngredient[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string; // Para subcategorías
  is_active: boolean;
  created_at: string;
  updated_at: string;

  children?: Category[];
  parent?: Category;
}

export interface ProductionArea {
  id: string;
  name: string;
  description?: string;
  order: number; // Orden para routing de comandas
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  min_selections: number;
  max_selections: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  options?: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  modifier_group_id: string;
  name: string;
  additional_cost: number;
  ingredient_id?: string; // Vinculado a ingrediente para afectar stock
  is_active: boolean;
  created_at: string;
  updated_at: string;

  ingredient?: Ingredient;
}

export interface StockMovement {
  id: string;
  ingredient_id: string;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reason: string;
  reference_id?: string; // ID de venta, compra, ajuste, etc.
  reference_type?: 'sale' | 'purchase' | 'adjustment' | 'production';
  created_at: string;
  updated_at: string;

  ingredient?: Ingredient;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tablas auxiliares
export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// DTOs y tipos para operaciones
export interface CreateProductRequest {
  name: string;
  description?: string;
  category_id: string;
  base_price: number;
  margin_percentage: number;
  production_area_id: string;
  recipe_ingredients: Omit<RecipeIngredient, 'id' | 'recipe_id'>[];
}

export interface UpdateStockRequest {
  ingredient_id: string;
  quantity: number;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reason: string;
}

export interface StockCalculationResult {
  total_value: number;
  low_stock_items: Ingredient[];
  stock_movements: StockMovement[];
}

export interface ProductCostCalculation {
  product_id: string;
  total_cost: number;
  gross_cost: number; // Costo con desperdicio
  net_cost: number; // Costo neta
  margin_amount: number;
  margin_percentage: number;
  profit_percentage: number;
}
