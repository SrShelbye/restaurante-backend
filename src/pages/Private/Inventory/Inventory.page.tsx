import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { erpService } from '../../../services/erp.service';
import { Ingredient, Product } from '../../../types/erp.types';

interface InventoryPageState {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  success: string | null;
  selectedIngredient: Ingredient | null;
  isDialogOpen: boolean;
  isEdit: boolean;
  formData: Partial<Ingredient>;
  productsUsingIngredient: Product[];
  isUsageDialogOpen: boolean;
}

const initialFormData = {
  name: '',
  description: '',
  unit_cost: 0,
  unit: 'unidad',
  current_stock: 0,
  min_stock: 10,
  supplier_id: ''
};

export const Inventory: React.FC = () => {
  const [state, setState] = useState<InventoryPageState>({
    ingredients: [],
    loading: false,
    error: null,
    success: null,
    selectedIngredient: null,
    isDialogOpen: false,
    isEdit: false,
    formData: {},
    productsUsingIngredient: [],
    isUsageDialogOpen: false
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const ingredients = await erpService.getIngredients();
      setState((prev) => ({
        ...prev,
        ingredients,
        loading: false
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al cargar ingredientes: ' + error,
        loading: false
      }));
    }
  };

  const handleCreate = () => {
    setState((prev) => ({
      ...prev,
      formData: initialFormData,
      isDialogOpen: true,
      isEdit: false
    }));
  };

  const handleEdit = (ingredient: Ingredient) => {
    setState((prev) => ({
      ...prev,
      formData: ingredient,
      selectedIngredient: ingredient,
      isDialogOpen: true,
      isEdit: true
    }));
  };

  const handleDelete = async (ingredient: Ingredient) => {
    if (
      window.confirm(`¿Está seguro que desea eliminar "${ingredient.name}"?`)
    ) {
      try {
        await erpService.deleteIngredient(ingredient.id);
        setState((prev) => ({
          ...prev,
          success: 'Ingrediente eliminado exitosamente'
        }));
        loadIngredients();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: 'Error al eliminar ingrediente: ' + error
        }));
      }
    }
  };

  const handleShowUsage = async (ingredient: Ingredient) => {
    try {
      const products = await erpService.getIngredientUsage(ingredient.id);
      setState((prev) => ({
        ...prev,
        selectedIngredient: ingredient,
        productsUsingIngredient: products,
        isUsageDialogOpen: true
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al cargar uso del ingrediente: ' + error
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (state.isEdit && state.selectedIngredient) {
        await erpService.updateIngredient(
          state.selectedIngredient.id,
          state.formData
        );
        setState((prev) => ({
          ...prev,
          success: 'Ingrediente actualizado exitosamente'
        }));
      } else {
        await erpService.createIngredient(
          state.formData as Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>
        );
        setState((prev) => ({
          ...prev,
          success: 'Ingrediente creado exitosamente'
        }));
      }

      setState((prev) => ({ ...prev, isDialogOpen: false }));
      loadIngredients();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al guardar ingrediente: ' + error
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  };

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.current_stock <= ingredient.min_stock) {
      return { color: 'error', label: 'Stock Bajo' };
    }
    if (ingredient.current_stock <= ingredient.min_stock * 1.5) {
      return { color: 'warning', label: 'Stock Medio' };
    }
    return { color: 'success', label: 'Stock OK' };
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant='h4' component='h1'>
          Gestión de Inventario
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Ingrediente
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

      {/* Tabla de Ingredientes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Costo Unitario</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Stock Actual</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.ingredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient);
              const totalValue =
                ingredient.current_stock * ingredient.unit_cost;

              return (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.description || '-'}</TableCell>
                  <TableCell>${ingredient.unit_cost.toFixed(2)}</TableCell>
                  <TableCell>{ingredient.unit}</TableCell>
                  <TableCell>{ingredient.current_stock}</TableCell>
                  <TableCell>{ingredient.min_stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color as any}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>${totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Tooltip title='Editar'>
                      <IconButton onClick={() => handleEdit(ingredient)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Ver uso'>
                      <IconButton onClick={() => handleShowUsage(ingredient)}>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar'>
                      <IconButton onClick={() => handleDelete(ingredient)}>
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
        maxWidth='md'
        fullWidth
        onClose={() => setState((prev) => ({ ...prev, isDialogOpen: false }))}
      >
        <DialogTitle>
          {state.isEdit ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Nombre'
                value={state.formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Unidad'
                value={state.formData.unit || ''}
                onChange={(e) => handleInputChange('unit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Descripción'
                multiline
                rows={2}
                value={state.formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Costo Unitario'
                type='number'
                value={state.formData.unit_cost || ''}
                onChange={(e) =>
                  handleInputChange('unit_cost', parseFloat(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Stock Actual'
                type='number'
                value={state.formData.current_stock || ''}
                onChange={(e) =>
                  handleInputChange('current_stock', parseFloat(e.target.value))
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label='Stock Mínimo'
                type='number'
                value={state.formData.min_stock || ''}
                onChange={(e) =>
                  handleInputChange('min_stock', parseFloat(e.target.value))
                }
              />
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

      {/* Dialog de Uso del Ingrediente */}
      <Dialog
        open={state.isUsageDialogOpen}
        maxWidth='md'
        fullWidth
        onClose={() =>
          setState((prev) => ({ ...prev, isUsageDialogOpen: false }))
        }
      >
        <DialogTitle>
          Productos que usan "{state.selectedIngredient?.name}"
        </DialogTitle>
        <DialogContent>
          {state.productsUsingIngredient.length === 0 ? (
            <Typography color='text.secondary'>
              Este ingrediente no se utiliza en ningún producto actualmente.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.productsUsingIngredient.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category?.name || '-'}</TableCell>
                      <TableCell>${product.final_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setState((prev) => ({ ...prev, isUsageDialogOpen: false }))
            }
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
