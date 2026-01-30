import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { erpService } from '../../../services/erp.service';
import {
  Product,
  Category,
  ProductionArea,
  Ingredient,
  RecipeIngredient,
  CreateProductRequest
} from '../../../types/erp.types';

interface ProductsPageState {
  products: Product[];
  categories: Category[];
  productionAreas: ProductionArea[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  success: string | null;
  selectedProduct: Product | null;
  isDialogOpen: boolean;
  isEdit: boolean;
  formData: Partial<CreateProductRequest>;
  recipeIngredients: RecipeIngredient[];
  ingredientSearch: string;
  searchedIngredients: Ingredient[];
  calculatedCost: number;
  calculatedMargin: number;
  calculatedPrice: number;
  isIngredientDialogOpen: boolean;
  availableIngredients: Ingredient[];
}

const initialFormData: Partial<CreateProductRequest> = {
  name: '',
  description: '',
  category_id: '',
  base_price: 0,
  margin_percentage: 30,
  production_area_id: '',
  recipe_ingredients: []
};

export const Products: React.FC = () => {
  const [state, setState] = useState<ProductsPageState>({
    products: [],
    categories: [],
    productionAreas: [],
    ingredients: [],
    loading: false,
    error: null,
    success: null,
    selectedProduct: null,
    isDialogOpen: false,
    isEdit: false,
    formData: {},
    recipeIngredients: [],
    ingredientSearch: '',
    searchedIngredients: [],
    calculatedCost: 0,
    calculatedMargin: 0,
    calculatedPrice: 0,
    isIngredientDialogOpen: false,
    availableIngredients: []
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (state.ingredientSearch) {
      searchIngredients();
    } else {
      setState((prev) => ({ ...prev, searchedIngredients: [] }));
    }
  }, [state.ingredientSearch]);

  useEffect(() => {
    calculateProductCost();
  }, [
    state.recipeIngredients,
    state.formData.base_price,
    state.formData.margin_percentage
  ]);

  const loadData = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [products, categories, productionAreas, ingredients] =
        await Promise.all([
          erpService.getProducts(),
          erpService.getCategories(),
          erpService.getProductionAreas(),
          erpService.getIngredients()
        ]);

      setState((prev) => ({
        ...prev,
        products,
        categories,
        productionAreas,
        ingredients,
        loading: false
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al cargar datos: ' + error,
        loading: false
      }));
    }
  };

  const searchIngredients = useCallback(async () => {
    if (!state.ingredientSearch.trim()) return;

    try {
      const ingredients = await erpService.searchIngredients(
        state.ingredientSearch
      );
      setState((prev) => ({ ...prev, searchedIngredients: ingredients }));
    } catch (error) {
      console.error('Error searching ingredients:', error);
    }
  }, [state.ingredientSearch]);

  const handleCreate = () => {
    setState((prev) => ({
      ...prev,
      formData: initialFormData,
      recipeIngredients: [],
      calculatedCost: 0,
      calculatedMargin: 0,
      calculatedPrice: 0,
      isDialogOpen: true,
      isEdit: false
    }));
  };

  const handleEdit = (product: Product) => {
    const recipeIngredients = product.recipe_ingredients || [];

    setState((prev) => ({
      ...prev,
      formData: {
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        base_price: product.base_price,
        margin_percentage: product.margin_percentage,
        production_area_id: product.production_area_id,
        recipe_ingredients: []
      },
      recipeIngredients,
      selectedProduct: product,
      calculatedCost: product.total_cost,
      calculatedMargin: product.margin_percentage,
      calculatedPrice: product.final_price,
      isDialogOpen: true,
      isEdit: true
    }));
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`¿Está seguro que desea eliminar "${product.name}"?`)) {
      try {
        await erpService.deleteProduct(product.id);
        setState((prev) => ({
          ...prev,
          success: 'Producto eliminado exitosamente'
        }));
        loadData();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: 'Error al eliminar producto: ' + error
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      const productData = {
        ...state.formData,
        recipe_ingredients: state.recipeIngredients
      } as CreateProductRequest;

      if (state.isEdit && state.selectedProduct) {
        await erpService.updateProduct(state.selectedProduct.id, {
          name: productData.name,
          description: productData.description,
          category_id: productData.category_id,
          base_price: productData.base_price,
          margin_percentage: productData.margin_percentage,
          final_price: state.calculatedPrice,
          total_cost: state.calculatedCost,
          production_area_id: productData.production_area_id
        });

        setState((prev) => ({
          ...prev,
          success: 'Producto actualizado exitosamente'
        }));
      } else {
        await erpService.createProduct(productData);
        setState((prev) => ({
          ...prev,
          success: 'Producto creado exitosamente'
        }));
      }

      setState((prev) => ({ ...prev, isDialogOpen: false }));
      loadData();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al guardar producto: ' + error
      }));
    }
  };

  const calculateProductCost = useCallback(async () => {
    let totalCost = 0;

    for (const ri of state.recipeIngredients) {
      const ingredient = state.ingredients.find(
        (i) => i.id === ri.ingredient_id
      );
      if (ingredient) {
        totalCost += ri.gross_quantity * ingredient.unit_cost;
      }
    }

    const basePrice = state.formData.base_price || 0;
    const margin = state.formData.margin_percentage || 30;
    const finalPrice = basePrice * (1 + margin / 100);
    const actualMargin = finalPrice > 0 ? ((finalPrice - totalCost) / finalPrice) * 100 : 0;
    
    setState((prev) => ({
      ...prev,
      calculatedCost: totalCost,
      calculatedPrice: finalPrice,
      calculatedMargin: actualMargin
    }));
  }, [state.formData.base_price, state.formData.margin_percentage, state.recipeIngredients]);

  const addIngredientToRecipe = (ingredient: Ingredient) => {
    const existingIndex = state.recipeIngredients.findIndex(
      (ri) => ri.ingredient_id === ingredient.id
    );

    if (existingIndex >= 0) {
      const updated = [...state.recipeIngredients];
      updated[existingIndex].gross_quantity += 1;
      setState((prev) => ({ ...prev, recipeIngredients: updated }));
    } else {
      const newRecipeIngredient: RecipeIngredient = {
        id: '',
        recipe_id: '',
        ingredient_id: ingredient.id,
        gross_quantity: 1,
        net_quantity: 1,
        waste_percentage: 0,
        ingredient
      };

      setState((prev) => ({
        ...prev,
        recipeIngredients: [...prev.recipeIngredients, newRecipeIngredient]
      }));
    }

    setState((prev) => ({
      ...prev,
      ingredientSearch: '',
      searchedIngredients: []
    }));
  };

  const removeIngredientFromRecipe = (index: number) => {
    const updated = state.recipeIngredients.filter((_, i) => i !== index);
    setState((prev) => ({ ...prev, recipeIngredients: updated }));
  };

  const updateRecipeIngredient = (index: number, field: string, value: any) => {
    const updated = [...state.recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setState((prev) => ({ ...prev, recipeIngredients: updated }));
  };

  const getMarginStatus = (product: Product) => {
    const marginPercent = product.margin_percentage;
    if (marginPercent < 20) return { color: 'error', label: 'Bajo' };
    if (marginPercent < 35) return { color: 'warning', label: 'Medio' };
    return { color: 'success', label: 'Bueno' };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant='h4' component='h1'>
          Gestión de Productos
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Alertas */}
      {state.error && (
        <Alert
          severity='error'
          sx={{ mb: 2 }}
          onClose={() => setState((prev) => ({ ...prev, error: null }))}
        >
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert
          severity='success'
          sx={{ mb: 2 }}
          onClose={() => setState((prev) => ({ ...prev, success: null }))}
        >
          {state.success}
        </Alert>
      )}

      {/* Tabla de Productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Área Producción</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Precio Base</TableCell>
              <TableCell>Margen %</TableCell>
              <TableCell>Precio Final</TableCell>
              <TableCell>Estado Margen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.products.map((product) => {
              const marginStatus = getMarginStatus(product);

              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{product.production_area?.name || '-'}</TableCell>
                  <TableCell>${product.total_cost.toFixed(2)}</TableCell>
                  <TableCell>${product.base_price.toFixed(2)}</TableCell>
                  <TableCell>{product.margin_percentage.toFixed(1)}%</TableCell>
                  <TableCell>${product.final_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={marginStatus.label}
                      color={marginStatus.color as any}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title='Editar'>
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar'>
                      <IconButton onClick={() => handleDelete(product)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para Crear/Editar */}
      <Dialog
        open={state.isDialogOpen}
        maxWidth='lg'
        fullWidth
        onClose={() => setState((prev) => ({ ...prev, isDialogOpen: false }))}
      >
        <DialogTitle>
          {state.isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Nombre del Producto'
                value={state.formData.name || ''}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    formData: { ...prev.formData, name: e.target.value }
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={state.formData.category_id || ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      formData: {
                        ...prev.formData,
                        category_id: e.target.value
                      }
                    }))
                  }
                >
                  {state.categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Descripción'
                multiline
                rows={2}
                value={state.formData.description || ''}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    formData: { ...prev.formData, description: e.target.value }
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Área de Producción</InputLabel>
                <Select
                  value={state.formData.production_area_id || ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      formData: {
                        ...prev.formData,
                        production_area_id: e.target.value
                      }
                    }))
                  }
                >
                  {state.productionAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Precio Base'
                type='number'
                value={state.formData.base_price || ''}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    formData: {
                      ...prev.formData,
                      base_price: parseFloat(e.target.value)
                    }
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Margen %'
                type='number'
                value={state.formData.margin_percentage || ''}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    formData: {
                      ...prev.formData,
                      margin_percentage: parseFloat(e.target.value)
                    }
                  }))
                }
              />
            </Grid>

            {/* Resumen de cálculos */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant='h6' gutterBottom>
                  <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Resumen de Costos y Precios
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant='body2' color='text.secondary'>
                      Costo Total Calculado:
                    </Typography>
                    <Typography variant='h6' color='primary'>
                      ${state.calculatedCost.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='body2' color='text.secondary'>
                      Margen en Dinero:
                    </Typography>
                    <Typography variant='h6' color='success.main'>
                      ${state.calculatedMargin.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant='body2' color='text.secondary'>
                      Precio Final:
                    </Typography>
                    <Typography variant='h6' color='secondary.main'>
                      ${state.calculatedPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Receta del Producto */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant='h6'>
                    Receta del Producto ({state.recipeIngredients.length}{' '}
                    ingredientes)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Buscador de ingredientes */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder='Buscar ingredientes para agregar a la receta...'
                      value={state.ingredientSearch}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          ingredientSearch: e.target.value
                        }))
                      }
                    />

                    {state.searchedIngredients.length > 0 && (
                      <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                        {state.searchedIngredients.map((ingredient) => (
                          <Box
                            key={ingredient.id}
                            sx={{
                              p: 1,
                              borderBottom: 1,
                              borderColor: 'divider'
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <Box>
                                <Typography variant='body2' fontWeight='bold'>
                                  {ingredient.name}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                >
                                  ${ingredient.unit_cost.toFixed(2)}/
                                  {ingredient.unit}
                                </Typography>
                              </Box>
                              <Button
                                size='small'
                                onClick={() =>
                                  addIngredientToRecipe(ingredient)
                                }
                              >
                                Agregar
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Paper>
                    )}
                  </Box>

                  {/* Lista de ingredientes en la receta */}
                  {state.recipeIngredients.length === 0 ? (
                    <Typography
                      color='text.secondary'
                      sx={{ textAlign: 'center', py: 2 }}
                    >
                      No hay ingredientes en la receta. Busca y agrega
                      ingredientes arriba.
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ingrediente</TableCell>
                            <TableCell>Cantidad Bruta</TableCell>
                            <TableCell>Unidad</TableCell>
                            <TableCell>Costo Unitario</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {state.recipeIngredients.map((ri, index) => {
                            const ingredient = state.ingredients.find(
                              (i) => i.id === ri.ingredient_id
                            );
                            const subtotal =
                              ri.gross_quantity * (ingredient?.unit_cost || 0);

                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  {ingredient?.name || 'Desconocido'}
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size='small'
                                    type='number'
                                    value={ri.gross_quantity}
                                    onChange={(e) =>
                                      updateRecipeIngredient(
                                        index,
                                        'gross_quantity',
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    sx={{ width: 80 }}
                                  />
                                </TableCell>
                                <TableCell>{ingredient?.unit || '-'}</TableCell>
                                <TableCell>
                                  ${ingredient?.unit_cost.toFixed(2) || '0.00'}
                                </TableCell>
                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                <TableCell>
                                  <IconButton
                                    size='small'
                                    onClick={() =>
                                      removeIngredientFromRecipe(index)
                                    }
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setState((prev) => ({ ...prev, isDialogOpen: false }))
            }
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant='contained'
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop para loading */}
      <Backdrop open={state.loading}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};
