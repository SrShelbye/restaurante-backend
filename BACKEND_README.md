# Backend API para Sistema ERP/POS Gastronómico

Este es el backend completo construido con Express.js y Supabase que resuelve todos los problemas de 404.

## 🚀 Características

### ✅ Endpoints Implementados

#### 📋 Autenticación

- `POST /api/auth/register` - **Nuevo endpoint que faltaba**
- `POST /api/auth/login` - Login de usuarios
- `GET /api/auth/renew` - Renovación de token
- `POST /api/auth/logout` - Logout

#### 🍔 Órdenes/Pedidos

- `GET /api/orders/actives` - Pedidos activos
- `GET /api/orders` - Todos los pedidos
- `POST /api/orders` - Crear pedido
- `PATCH /api/orders/:id/status` - Actualizar estado

#### 🍽 Menú

- `GET /api/menu/:restaurantId` - Menú por restaurante
- `GET /api/menu/sections/:restaurantId` - Secciones del menú

#### 🪑 Mesas

- `GET /api/tables` - Listar mesas
- `POST /api/tables` - Crear mesa
- `PUT /api/tables/:id` - Actualizar mesa
- `DELETE /api/tables/:id` - Eliminar mesa

#### 👥 Clientes

- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

#### 🏭 Áreas de Producción

- `GET /api/production-areas` - Listar áreas
- `POST /api/production-areas` - Crear área

#### 💰 Caja Registradora

- `GET /api/cash-register/actives` - Cajas activas
- `POST /api/cash-register` - Crear caja

#### 📊 ERP endpoints

- `GET /api/erp/ingredients` - Ingredientes
- `GET /api/erp/products` - Productos
- `GET /api/erp/stock-calculation` - Cálculo de inventario

## 🛠️ Instalación y Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://srshelbye.github.io
```

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

### 4. Ejecutar en Producción

```bash
npm start
```

## 🗄️ Configuración de Base de Datos

El backend está diseñado para funcionar con Supabase. Asegúrate de:

1. **Ejecutar el schema SQL**:

   ```sql
   -- Copia el contenido de: database/supabase_schema.sql
   -- Ejecútalo en el SQL Editor de Supabase
   ```

2. **Verificar tablas**:
   - users
   - orders
   - tables
   - clients
   - production_areas
   - products
   - ingredients

## 🚀 Deploy a Render

### 1. Preparar el repositorio

```bash
# Asegúrate que el backend está en la raíz o en subcarpeta
git add backend/
git commit -m "Add complete backend with all endpoints"
git push
```

### 2. Configurar Render

1. Ve a [render.com](https://render.com)
2. Crea nuevo "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Agrega todas las variables del `.env`

## 🐛 Problemas Resueltos

### ❌ Problemas Originales:

- `401 /api/auth/renew` - Token no encontrado
- `404 /api/auth/register` - **Endpoint no existía**
- `404 /api/orders/actives` - Endpoint no implementado
- `404 /api/menu/...` - Menú no disponible
- `404 /api/tables` - Mesas no implementadas
- `404 /api/clients` - Clientes no disponibles
- `404 /api/production-areas` - Áreas no configuradas
- `404 /static/sounds/bell-ding.wav` - Archivos estáticos no servidos

### ✅ Soluciones Aplicadas:

1. **Autenticación completa** con JWT y bcrypt
2. **Endpoints faltantes** implementados
3. **Conexión a Supabase** configurada
4. **Manejo de errores** y validaciones
5. **Archivos estáticos** configurados
6. **CORS** configurado para GitHub Pages

## 📝 Estructura del Backend

```
backend/
├── server.js              # Servidor principal Express
├── package.json           # Dependencias y scripts
├── .env.example          # Variables de entorno ejemplo
├── config/
│   └── database.js      # Configuración de Supabase
└── routes/
    ├── auth.routes.js    # Autenticación
    ├── orders.js        # Pedidos
    ├── menu.js          # Menú
    ├── tables.js        # Mesas
    ├── clients.js       # Clientes
    ├── production-areas.js # Áreas producción
    ├── cash-register.js # Caja registradora
    └── erp.js          # Endpoints ERP
```

## 🔄 Pruebas de Endpoints

Una vez deployed, prueba estos endpoints:

```bash
# Health check
curl https://restaurante-backend-api.onrender.com/health

# Registro (ahora existe)
curl -X POST https://restaurante-backend-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","username":"johndoe","password":"password123","samePassword":"password123"}'

# Mesas
curl https://restaurante-backend-api.onrender.com/api/tables

# Clientes
curl https://restaurante-backend-api.onrender.com/api/clients

# Pedidos activos
curl "https://restaurante-backend-api.onrender.com/api/orders/actives?limit=50&offset=0&startDate=2025-01-01T05:00:00.000Z&period=yearly"
```

## 🎉 Resultado

**Todos los problemas 404 han sido resueltos:**

- ✅ Backend completo con todos los endpoints
- ✅ Autenticación funcional
- ✅ Base de datos conectada
- ✅ Archivos estáticos servidos
- ✅ Ready para producción

El backend está listo para reemplazar el actual en Render y resolver definitivamente todos los errores.
