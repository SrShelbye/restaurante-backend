import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { erpService } from '../../../services/erp.service';
import {
  Product,
  Ingredient,
  StockCalculationResult,
  ProductCostCalculation
} from '../../../types/erp.types';

interface DashboardPageState {
  inventoryValue: StockCalculationResult | null;
  products: Product[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  stockAnalysis: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  };
  productAnalysis: {
    totalProducts: number;
    highMarginProducts: number;
    lowMarginProducts: number;
    averageMargin: number;
  };
}

export const ErpDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardPageState>({
    inventoryValue: null,
    products: [],
    ingredients: [],
    loading: false,
    error: null,
    stockAnalysis: {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0
    },
    productAnalysis: {
      totalProducts: 0,
      highMarginProducts: 0,
      lowMarginProducts: 0,
      averageMargin: 0
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [inventoryCalculation, products, ingredients] = await Promise.all([
        erpService.getStockCalculation(),
        erpService.getProducts(),
        erpService.getIngredients()
      ]);

      // Analizar stock
      const lowStockItems = ingredients.filter((i: Ingredient) => 
        i.current_stock <= i.min_stock
      ).length;
      
      const outOfStockItems = ingredients.filter((i: Ingredient) => 
        i.current_stock === 0
      ).length;
      
      const totalValue = ingredients.reduce((sum: number, p: Ingredient) => 
        sum + (p.current_stock * p.unit_cost), 0
      );
      
      const stockAnalysis = {
        totalItems: ingredients.length,
        lowStockItems,
        outOfStockItems,
        totalValue
      };

      // Analizar productos
      const validProducts = products.filter((p) => p.total_cost > 0);
      const avgMargin = products.length > 0 
        ? products.reduce((sum: number, p: Product) => sum + p.margin_percentage, 0) / products.length 
        : 0;
      const productAnalysis = {
        totalProducts: products.length,
        highMarginProducts: validProducts.filter(
          (p) => p.margin_percentage >= 35
        ).length,
        lowMarginProducts: validProducts.filter((p) => p.margin_percentage < 20)
          .length,
        averageMargin:
          validProducts.length > 0
            ? validProducts.reduce((sum, p) => sum + p.margin_percentage, 0) /
              validProducts.length
            : 0
      };

      setState((prev) => ({
        ...prev,
        inventoryValue: inventoryCalculation,
        products,
        ingredients,
        stockAnalysis,
        productAnalysis,
        loading: false
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Error al cargar datos del dashboard: ' + error,
        loading: false
      }));
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMarginStatus = (margin: number) => {
    if (margin < 20)
      return { color: 'error', label: 'Bajo', icon: <TrendingDownIcon /> };
    if (margin < 35)
      return { color: 'warning', label: 'Medio', icon: <TrendingUpIcon /> };
    return { color: 'success', label: 'Bueno', icon: <TrendingUpIcon /> };
  };

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.current_stock <= 0)
      return { color: 'error', label: 'Sin Stock' };
    if (ingredient.current_stock <= ingredient.min_stock)
      return { color: 'warning', label: 'Stock Bajo' };
    return { color: 'success', label: 'OK' };
  };

  if (state.loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>{state.error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Dashboard ERP Gastronómico
      </Typography>

      {/* Alertas de stock bajo */}
      {state.stockAnalysis.lowStockItems > 0 && (
        <Alert severity='warning' sx={{ mb: 3 }} icon={<WarningIcon />}>
          ¡Atención! Hay {state.stockAnalysis.lowStockItems} ingredientes con
          stock bajo y {state.stockAnalysis.outOfStockItems} sin stock.
        </Alert>
      )}

      {/* Tarjetas de métricas principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography color='textSecondary' gutterBottom>
                    Valor del Inventario
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {formatCurrency(state.stockAnalysis.totalValue)}
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography color='textSecondary' gutterBottom>
                    Total Productos
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {state.productAnalysis.totalProducts}
                  </Typography>
                </Box>
                <ShoppingCartIcon
                  sx={{ fontSize: 40, color: 'secondary.main' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography color='textSecondary' gutterBottom>
                    Margen Promedio
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {state.productAnalysis.averageMargin.toFixed(1)}%
                  </Typography>
                </Box>
                {React.cloneElement(
                  getMarginStatus(state.productAnalysis.averageMargin).icon,
                  {
                    sx: {
                      fontSize: 40,
                      color:
                        getMarginStatus(state.productAnalysis.averageMargin)
                          .color + '.main'
                    }
                  }
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography color='textSecondary' gutterBottom>
                    Items con Problemas
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {state.stockAnalysis.lowStockItems +
                      state.stockAnalysis.outOfStockItems}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Análisis de Stock */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Análisis de Inventario
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant='body2' color='textSecondary'>
                Estado General del Stock
              </Typography>
              <LinearProgress
                variant='determinate'
                value={
                  state.stockAnalysis.totalItems > 0
                    ? ((state.stockAnalysis.totalItems -
                        state.stockAnalysis.lowStockItems -
                        state.stockAnalysis.outOfStockItems) /
                        state.stockAnalysis.totalItems) *
                      100
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Box>

            <TableContainer>
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Ingredientes</TableCell>
                    <TableCell align='right'>
                      {state.stockAnalysis.totalItems}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stock Óptimo</TableCell>
                    <TableCell align='right' sx={{ color: 'success.main' }}>
                      {state.stockAnalysis.totalItems -
                        state.stockAnalysis.lowStockItems -
                        state.stockAnalysis.outOfStockItems}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stock Bajo</TableCell>
                    <TableCell align='right' sx={{ color: 'warning.main' }}>
                      {state.stockAnalysis.lowStockItems}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sin Stock</TableCell>
                    <TableCell align='right' sx={{ color: 'error.main' }}>
                      {state.stockAnalysis.outOfStockItems}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Análisis de Márgenes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Análisis de Rentabilidad
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant='body2' color='textSecondary'>
                Distribución de Márgenes
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant='h4' color='error.main'>
                    {state.productAnalysis.lowMarginProducts}
                  </Typography>
                  <Typography variant='caption'>
                    Margen Bajo (&lt;20%)
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant='h4' color='warning.main'>
                    {state.productAnalysis.totalProducts -
                      state.productAnalysis.highMarginProducts -
                      state.productAnalysis.lowMarginProducts}
                  </Typography>
                  <Typography variant='caption'>
                    Margen Medio (20-35%)
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant='h4' color='success.main'>
                    {state.productAnalysis.highMarginProducts}
                  </Typography>
                  <Typography variant='caption'>
                    Margen Bueno (&gt;35%)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant='body2' color='textSecondary'>
              Métricas de Rentabilidad
            </Typography>
            <TableContainer sx={{ mt: 1 }}>
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell>Promedio General</TableCell>
                    <TableCell align='right'>
                      {state.productAnalysis.averageMargin.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Productos Rentables</TableCell>
                    <TableCell align='right' sx={{ color: 'success.main' }}>
                      {state.productAnalysis.highMarginProducts}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Productos Críticos</TableCell>
                    <TableCell align='right' sx={{ color: 'error.main' }}>
                      {state.productAnalysis.lowMarginProducts}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Ingredientes Críticos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Ingredientes Críticos
            </Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Ingrediente</TableCell>
                    <TableCell>Stock Actual</TableCell>
                    <TableCell>Stock Mínimo</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.ingredients
                    .filter((i) => i.current_stock <= i.min_stock)
                    .slice(0, 5)
                    .map((ingredient) => {
                      const status = getStockStatus(ingredient);
                      return (
                        <TableRow key={ingredient.id}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>
                            {ingredient.current_stock} {ingredient.unit}
                          </TableCell>
                          <TableCell>
                            {ingredient.min_stock} {ingredient.unit}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={status.label}
                              color={status.color as any}
                              size='small'
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {state.ingredients.filter(
                    (i) => i.current_stock <= i.min_stock
                  ).length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      >
                        No hay ingredientes críticos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Productos con mejores márgenes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Top Productos por Margen
            </Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align='right'>Costo</TableCell>
                    <TableCell align='right'>Precio</TableCell>
                    <TableCell align='right'>Margen</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.products
                    .sort((a, b) => b.margin_percentage - a.margin_percentage)
                    .slice(0, 5)
                    .map((product) => {
                      const marginStatus = getMarginStatus(
                        product.margin_percentage
                      );
                      return (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align='right'>
                            {formatCurrency(product.total_cost)}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(product.final_price)}
                          </TableCell>
                          <TableCell align='right'>
                            {product.margin_percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={marginStatus.label}
                              color={marginStatus.color as any}
                              size='small'
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {state.products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      >
                        No hay productos registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
