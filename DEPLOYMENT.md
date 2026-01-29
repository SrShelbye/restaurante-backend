# 🚀 Guía de Despliegue - Sistema Restaurante

## 📦 Estado Actual
✅ **Build completado** - Archivos generados en `/dist`  
✅ **Variables de entorno configuradas**  
✅ **Configuraciones listas** para Netlify y Vercel  

## 🌐 Opciones de Despliegue

### Opción 1: Netlify (Recomendado)
1. **Ve a** [netlify.com](https://netlify.com)
2. **Crea una cuenta** o inicia sesión
3. **Haz clic en "Add new site" → "Deploy manually"**
4. **Arrastra la carpeta `dist`** al área de despliegue
5. **Configura las variables de entorno**:
   - `VITE_APP_NAME=Sistema Restaurante Demo`
   - `VITE_API_URL=https://tu-api-backend.com/api`
   - `VITE_WS_URL=wss://tu-api-backend.com`

### Opción 2: Vercel
1. **Ve a** [vercel.com](https://vercel.com)
2. **Crea una cuenta** o inicia sesión
3. **Haz clic en "New Project"**
4. **Conecta tu repositorio GitHub** (recomendado)
5. **Configura el Root Directory**: `./`
6. **Configura variables de entorno** en Settings → Environment Variables

### Opción 3: GitHub Pages
1. **Sube el código a GitHub**
2. **Ve a Settings → Pages**
3. **Configura Source**: Deploy from a branch
4. **Selecciona branch**: `main` o `master`
5. **Carpeta**: `/dist`

## 🔧 Configuración Importante

### Variables de Entorno (Configúralas en la plataforma)
```env
VITE_APP_NAME=Sistema Restaurante Demo
VITE_API_URL=https://tu-api-backend.com/api
VITE_WS_URL=wss://tu-api-backend.com
```

### Archivos de Configuración
- `netlify.toml` - Configuración de Netlify
- `vercel.json` - Configuración de Vercel
- `dist/` - Archivos de producción listos

## ⚠️ Notas Importantes

1. **Backend API**: La aplicación necesita una API backend funcionando
2. **CORS**: Asegúrate que tu backend permita requests del dominio desplegado
3. **HTTPS**: Usa URLs HTTPS en producción
4. **WebSocket**: Configura WSS para WebSockets seguros

## 📱 Después del Despliegue

1. **Verifica que la aplicación carga**
2. **Prueba la navegación**
3. **Configura tu backend API**
4. **Actualiza las variables de entorno** si es necesario

## 🐛 Problemas Comunes

- **404 errors**: Los archivos de configuración ya incluyen redirecciones
- **CORS errors**: Configura tu backend para permitir el dominio
- **API errors**: Verifica las URLs de las variables de entorno

## 🎯 Siguiente Paso

Elige una plataforma y sigue los pasos. La carpeta `dist` está lista para desplegar.
