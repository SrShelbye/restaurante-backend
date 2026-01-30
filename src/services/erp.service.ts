import { supabase } from '../lib/supabase';
import {
  Ingredient,
  Product,
  Category,
  ProductionArea,
  RecipeIngredient,
  ModifierGroup,
  ModifierOption,
  StockMovement,
  Client,
  Supplier,
  CreateProductRequest,
  UpdateStockRequest,
  StockCalculationResult,
  ProductCostCalculation
} from '../types/erp.types';

// Servicios de Supabase para el ERP Gastronómico

export class SupabaseErpService {
  // ---------- INGREDIENTES ----------

  async getIngredients(): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createIngredient(
    ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Ingredient> {
    const { data, error } = await supabase
      .from('ingredients')
      .insert(ingredient)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateIngredient(
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient> {
    const { data, error } = await supabase
      .from('ingredients')
      .update({ ...ingredient, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteIngredient(id: string): Promise<void> {
    const { error } = await supabase.from('ingredients').delete().eq('id', id);

    if (error) throw error;
  }

  async getIngredientUsage(id: string): Promise<any> {
    try {
      // Get recipes that use this ingredient
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          name,
          description,
          recipe_ingredients!inner(
            ingredient_id,
            gross_quantity,
            ingredients(
              id,
              name,
              unit
            )
          )
        `)
        .eq('recipe_ingredients.ingredient_id', id)
        .eq('is_active', true);

      // Get semifinished products that use this ingredient
      const { data: semifinished, error: semifinishedError } = await supabase
        .from('semifinished')
        .select(`
          id,
          name,
          description,
          recipe_ingredients!inner(
            ingredient_id,
            gross_quantity,
            ingredients(
              id,
              name,
              unit
            )
          )
        `)
        .eq('recipe_ingredients.ingredient_id', id)
        .eq('is_active', true);

      if (recipesError || semifinishedError) throw recipesError || semifinishedError;

      const usage = {
        ingredientId: id,
        usedInRecipes: recipes?.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          type: 'recipe',
          quantity: recipe.recipe_ingredients[0]?.gross_quantity || 0,
          unit: recipe.recipe_ingredients[0]?.ingredients?.unit || 'unidad'
        })) || [],
        usedInSemifinished: semifinished?.map(product => ({
          id: product.id,
          name: product.name,
          type: 'semifinished',
          quantity: product.recipe_ingredients[0]?.gross_quantity || 0,
          unit: product.recipe_ingredients[0]?.ingredients?.unit || 'unidad'
        })) || []
      };

      return usage;
    } catch (error) {
      console.error('Error getting ingredient usage:', error);
      throw error;
    }
  }

  // ---------- PRODUCTOS ----------

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
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
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProduct(request: CreateProductRequest): Promise<Product> {
    // Primero calcular el costo total
    const totalCost = await this.calculateProductCost(
      request.recipe_ingredients
    );

    // Calcular precio final
    const marginAmount = request.base_price * (request.margin_percentage / 100);
    const finalPrice = request.base_price + marginAmount;

    const productData = {
      name: request.name,
      description: request.description,
      category_id: request.category_id,
      base_price: request.base_price,
      margin_percentage: request.margin_percentage,
      final_price: finalPrice,
      total_cost: totalCost,
      production_area_id: request.production_area_id,
      is_active: true
    };

    // Crear producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (productError) throw productError;

    // Crear ingredientes de receta
    const recipeIngredients = request.recipe_ingredients.map((ri) => ({
      ...ri,
      recipe_id: product.id
    }));

    const { error: recipeError } = await supabase
      .from('recipe_ingredients')
      .insert(recipeIngredients);

    if (recipeError) throw recipeError;

    return product;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
  }

  // ---------- CATEGORÍAS ----------

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*, parent:categories(*), children:categories(*)')
      .is('parent_id', null) // Solo categorías padre
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*, parent:categories(name), children:categories(*)')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createCategory(
    category: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ---------- ÁREAS DE PRODUCCIÓN ----------

  async getProductionAreas(): Promise<ProductionArea[]> {
    const { data, error } = await supabase
      .from('production_areas')
      .select('*')
      .eq('is_active', true)
      .order('order');

    if (error) throw error;
    return data || [];
  }

  // ---------- MOVIMIENTOS DE STOCK ----------

  async getStockMovements(ingredientId?: string): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select('*, ingredient:ingredients(*)')
      .order('created_at', { ascending: false });

    if (ingredientId) {
      query = query.eq('ingredient_id', ingredientId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async updateStock(request: UpdateStockRequest): Promise<StockMovement> {
    const ingredient = await this.getIngredientById(request.ingredient_id);
    if (!ingredient) throw new Error('Ingrediente no encontrado');

    const newStock =
      request.movement_type === 'IN'
        ? ingredient.current_stock + request.quantity
        : request.movement_type === 'OUT'
          ? ingredient.current_stock - request.quantity
          : request.quantity; // ADJUSTMENT

    // Actualizar stock del ingrediente
    await this.updateIngredient(request.ingredient_id, {
      current_stock: newStock
    });

    // Crear movimiento de stock
    const movementData = {
      ingredient_id: request.ingredient_id,
      movement_type: request.movement_type,
      quantity: request.quantity,
      unit_cost: ingredient.unit_cost,
      total_cost: ingredient.unit_cost * request.quantity,
      reason: request.reason,
      reference_type: 'adjustment'
    };

    const { data, error } = await supabase
      .from('stock_movements')
      .insert(movementData)
      .select('*, ingredient:ingredients(*)')
      .single();

    if (error) throw error;
    return data;
  }

  // ---------- CLIENTES ----------

  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createClient(
    client: Omit<Client, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ---------- CÁLCULOS ----------

  async calculateProductCost(
    recipeIngredients: Omit<RecipeIngredient, 'id' | 'recipe_id'>[]
  ): Promise<number> {
    let totalCost = 0;

    for (const ri of recipeIngredients) {
      const ingredient = await this.getIngredientById(ri.ingredient_id);
      if (ingredient) {
        // Costo = cantidad bruta × costo unitario
        totalCost += ri.gross_quantity * ingredient.unit_cost;
      }
    }

    return totalCost;
  }

  async getStockCalculation(): Promise<StockCalculationResult> {
    const ingredients = await this.getIngredients();
    const movements = await this.getStockMovements();

    const totalValue = ingredients.reduce(
      (sum, ingredient) =>
        sum + ingredient.current_stock * ingredient.unit_cost,
      0
    );

    const lowStockItems = ingredients.filter(
      (ingredient) => ingredient.current_stock <= ingredient.min_stock
    );

    return {
      total_value: totalValue,
      low_stock_items: lowStockItems,
      stock_movements: movements
    };
  }

  async getIngredientUsage(ingredientId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('recipe_ingredients')
      .select('product:products(*)')
      .eq('ingredient_id', ingredientId);

    if (error) throw error;
    const products = data?.map((item) => item.product).filter(Boolean) || [];
    return products as unknown as Product[];
  }

  // ---------- UTILIDADES ----------

  private async getIngredientById(id: string): Promise<Ingredient | null> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(*),
        production_area:production_areas(*)
      `
      )
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  async searchIngredients(query: string): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) throw error;
    return data || [];
  }
}

export const erpService = new SupabaseErpService();
