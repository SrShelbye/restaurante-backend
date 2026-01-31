const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Importar rutas desde la estructura correcta
const authRoutes = require('../routes/auth.routes');
const menuRoutes = require('../routes/menu.routes');
const ordersRoutes = require('../routes/orders.routes');
const tablesRoutes = require('../routes/tables.routes');
const clientsRoutes = require('../routes/clients.routes');
const productionAreasRoutes = require('../routes/production-areas.routes');
const cashRegisterRoutes = require('../routes/cash-register.routes');
const erpRoutes = require('../routes/erp.routes');
const reportsRoutes = require('../routes/reports.routes');
const balanceRoutes = require('../routes/balance.routes');
const usersRoutes = require('../routes/users.routes');
const invoicesRoutes = require('../routes/invoices.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://srshelbye.github.io',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-restaurant-id']
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos (incluyendo sonidos) - path corregido
app.use('/static', express.static(path.join(__dirname, '../../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/production-areas', productionAreasRoutes);
app.use('/api/cash-register', cashRegisterRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/financial', balanceRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/invoices', invoicesRoutes);

// Manejo de errores 404
app.use((req, res) => {
  console.log(`404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      details: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    details:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Working directory: ${__dirname}`);
});

module.exports = app;
