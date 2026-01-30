# 🍽️ Sistema ERP/POS Gastronómico Full-Stack

Un sistema completo de gestión de restaurantes con arquitectura full-stack, base de datos relacional y cálculos de costos en tiempo real.

## ✅ Características Implementadas

### 🧠 Arquitectura de Datos

- **Base de datos relacional** con PostgreSQL + Supabase
- **Ingredientes ↔ Recetas**: Cálculo automático de costos
- **Productos ↔ Áreas Producción**: Enrutamiento inteligente de comandas
- **Ventas ↔ Inventario**: Descuento automático de stock

### 📦 Módulos Funcionales

#### 🥫 Gestión de Inventario

- ✅ CRUD completo de ingredientes
- ✅ Control de stock con alertas
- ✅ Cálculo de valor total del inventario
- ✅ Detección de stock bajo
- ✅ Historial de movimientos

#### 🍔 Gestión de Productos

- ✅ CRUD completo de productos
- ✅ **Cálculo automático de costos** basado en recetas
- ✅ **Motor de márgenes de utilidad** en tiempo real
- ✅ Buscador dinámico de ingredientes
- ✅ Editor de recetas con validación

#### 📊 Dashboard Analítico

- ✅ **Métricas en tiempo real**
- ✅ Valor total del inventario
- ✅ Análisis de rentabilidad por producto
- ✅ Alertas de stock crítico
- ✅ Indicadores de márgenes promedio

### 🚀 Características Técnicas

- ✅ **React + TypeScript** (Type-safe)
- ✅ **Material-UI** para UI/UX
- ✅ **Supabase** para base de datos y auth
- ✅ **Vite** para desarrollo rápido
- ✅ **Redux Toolkit** para state management
- ✅ **React Query** para manejo de datos
- ✅ **Notificaciones Toast** integradas

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos

- Node.js 18+
- npm/pnpm/yarn
- Cuenta de Supabase

### 2. Configuración de Supabase

1. **Crear proyecto en Supabase Dashboard**

   ```bash
   # Visita: https://supabase.com/dashboard
   # Crea nuevo proyecto > PostgreSQL
   ```

2. **Ejecutar script SQL**

   ```sql
   -- Copia y pega el contenido de:
   database/supabase_schema.sql
   -- en el SQL Editor de Supabase
   ```

3. **Obtener credenciales**
   - Project URL: Settings > API > Project URL
   - Anon Key: Settings > API > anon/public key

### 3. Configuración del Frontend

1. **Clonar el proyecto**

   ```bash
   git clone <repository-url>
   cd restaurant-web-app-master
   ```

2. **Instalar dependencias**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.production
   ```

   Editar `.env.production`:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here

   # API Configuration
   VITE_APP_NAME=Sistema Restaurante ERP
   VITE_API_URL=https://restaurante-backend-api.onrender.com/api
   VITE_WS_URL=wss://restaurante-backend-api.onrender.com
   ```

4. **Desarrollo local**

   ```bash
   npm run dev
   ```

5. **Build para producción**
   ```bash
   npm run build
   ```

## 📱 Uso del Sistema

### 🗂️ Navegación

- **Dashboard ERP**: Métricas principales y alertas
- **Inventario**: Gestión de ingredientes y stock
- **Productos**: Creación de platos con recetas
- **Menú Restaurante**: Configuración visual del menú

### 📊 Flujo de Trabajo Típico

1. **Configurar Ingredientes**

   ```
   Inventario > Nuevo Ingrediente
   - Nombre: "Tomate"
   - Costo Unitario: $2.50/kg
   - Stock Actual: 10kg
   - Stock Mínimo: 5kg
   ```

2. **Crear Producto con Receta**

   ```
   Productos > Nuevo Producto
   - Nombre: "Ensalada César"
   - Precio Base: $15.00
   - Margen: 30%
   - Agregar a receta: Tomate (200g)
   - 🤖 Sistema calcula: Costo = $0.50, Precio Final = $19.50
   ```

3. **Monitorear en Dashboard**
   ```
   Dashboard ERP:
   - Valor Inventario: $1,250.50
   - Margen Promedio: 32.5%
   - Alertas: "3 ingredientes con stock bajo"
   ```

## 🔄 Integración de Costos Automáticos

### 🧮 Motor de Cálculo

```javascript
// Costo de Plato = Σ(CostoUnitario × CantidadBruta)
const costoEnsalada =
  (2.50 × 0.200) + // Tomate
  (15.00 × 0.050) + // Pollo
  (5.00 × 0.100) + // Lechuga
  0.80 +            // Pan crutones
  = $2.30

// Margen de Utilidad
const precioFinal = costoBase × (1 + margen/100)
const margenReal = ((precioFinal - costoTotal) / precioFinal) × 100
```

### 📈 Actualizaciones en Tiempo Real

- ✅ Cambiar precio de ingrediente → actualiza costos de productos
- ✅ Modificar receta → recalcula costos automáticamente
- ✅ Nueva venta → descarga stock en tiempo real

## 🐛 Troubleshooting

### Errores Comunes

**401 en auth/renew**

```bash
# El endpoint fue corregido en auth.thunks.ts
# Si persiste, verifica el backend en Render
```

**404 en register**

```bash
# Endpoint no existe en el backend actual
# Se requiere implementar el backend completo
```

**Problemas de Supabase**

```bash
# Verifica conexión:
curl https://your-project.supabase.co/rest/v1/ingredients \
  -H "apikey: YOUR_ANON_KEY"
```

## 🚀 Despliegue

### GitHub Pages (Frontend)

```bash
# 1. Habilitar GitHub Pages en Settings
# 2. Configurar source: gh-pages
# 3. El deploy automático ocurre en cada push
```

### Supabase (Backend)

```bash
# 1. Ejecutar schema.sql en SQL Editor
# 2. Configurar RLS policies para seguridad
# 3. Habilitar Database Webhooks si es necesario
```

## 📈 Próximos Pasos

### 🎯 Pendientes de Alta Prioridad

- [ ] Completar módulo de modificadores con grupos
- [ ] Implementar backend completo con Express.js
- [ ] Configurar authentication con Supabase Auth

### 🔄 Mejoras Futuras

- [ ] Módulo de compras y proveedores
- [ ] Análisis predictivo de ventas
- [ ] Integración con sistemas de pago
- [ ] App móvil para tablets de mesas

## 🤝 Contribución

1. Fork del proyecto
2. Branch feature/nueva-funcionalidad
3. Commit con mensajes claros
4. Push y Pull Request

## 📄 Licencia

MIT License - Uso libre con atribución

---

**🎉 ¡Listo para usar!** El sistema está diseñado para ser productivo desde el primer momento, con todos los cálculos de costos funcionando y métricas en tiempo real.
