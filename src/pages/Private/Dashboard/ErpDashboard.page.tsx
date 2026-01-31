import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AttachMoney,
  Receipt,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Refresh,
  Inventory
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
  salesAnalysis: {
    totalSales: number;
    totalRevenue: number;
    totalOrders: number;
    averageTicket: number;
    paidOrders: number;
    pendingOrders: number;
  };
  stockAlerts: any[];
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
    },
    salesAnalysis: {
      totalSales: 0,
      totalRevenue: 0,
      totalOrders: 0,
      averageTicket: 0,
      paidOrders: 0,
      pendingOrders: 0
    },
    stockAlerts: []
  });

  useEffect(() => {
    loadDashboardData();
    
    // Set up WebSocket connection for real-time stock alerts
    const setupWebSocket = () => {
      // This would connect to the WebSocket server for real-time alerts
      // For now, we'll fetch stock alerts periodically
      const interval = setInterval(() => {
        loadStockAlerts();
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    };
    
    const cleanup = setupWebSocket();
    return cleanup;
  }, []);

  const loadDashboardData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [inventoryCalculation, products, ingredients, dailySales] = await Promise.all([
        erpService.getStockCalculation(),
        erpService.getProducts(),
        erpService.getIngredients(),
        erpService.getDailySales()
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
      const validProducts = products.filter((p: Product) => p.total_cost > 0);
      const avgMargin = products.length > 0 
        ? products.reduce((sum: number, p: Product) => sum + p.margin_percentage, 0) / products.length 
        : 0;
      const productAnalysis = {
        totalProducts: products.length,
        highMarginProducts: validProducts.filter(
          (p: Product) => p.margin_percentage >= 35
        ).length,
        lowMarginProducts: validProducts.filter((p: Product) => p.margin_percentage < 20)
          .length,
        averageMargin:
          validProducts.length > 0
            ? validProducts.reduce((sum: number, p: Product) => sum + p.margin_percentage, 0) /
              validProducts.length
            : 0
      };

      // ✅ Análisis de ventas diarias
      const salesAnalysis = {
        totalSales: dailySales.length,
        totalRevenue: dailySales.reduce((sum: number, sale: any) => sum + sale.total, 0),
        totalOrders: dailySales.length,
        averageTicket: dailySales.length > 0 
          ? dailySales.reduce((sum: number, sale: any) => sum + sale.total, 0) / dailySales.length 
          : 0,
        paidOrders: dailySales.filter((sale: any) => sale.paymentStatus === 'paid').length,
        pendingOrders: dailySales.filter((sale: any) => sale.paymentStatus === 'pending').length
      };

      setState((prev) => ({
        ...prev,
        inventoryValue: inventoryCalculation,
        products,
        ingredients,
        stockAnalysis,
        productAnalysis,
        salesAnalysis,
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

  const loadStockAlerts = async () => {
    try {
      const alerts = await erpService.getStockAnalysis();
      setState(prev => ({
        ...prev,
        stockAlerts: alerts.low_stock_items || []
      }));
    } catch (error) {
      console.error('Error loading stock alerts:', error);
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
      return { color: 'error', label: 'Bajo', icon: <TrendingDown /> };
    if (margin < 35)
      return { color: 'warning', label: 'Medio', icon: <TrendingUp /> };
    return { color: 'success', label: 'Bueno', icon: <TrendingUp /> };
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
      <Typography variant='h4' gutterBottom>
        Dashboard ERP
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tarjetas principales */}
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
                <Inventory sx={{ fontSize: 40, color: 'warning.main' }} />
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
                <ShoppingCart sx={{ fontSize: 40, color: 'secondary.main' }} />
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

        {/* ✅ Tarjetas de Ventas Diarias */}
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
                    Ventas del Día
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {state.salesAnalysis?.totalSales || 0}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
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
                    Ingresos Totales
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {formatCurrency(state.salesAnalysis?.totalRevenue || 0)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
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
                    Ticket Promedio
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {formatCurrency(state.salesAnalysis?.averageTicket || 0)}
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 40, color: 'warning.main' }} />
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
                    Alertas de Stock
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {state.stockAlerts.length}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
