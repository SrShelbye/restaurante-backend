# ⚙️ Configurar GitHub Pages - Paso a Paso

## 📋 Pasos Manuales (Haz esto ahora)

### 1. Ve a tu repositorio
Abre: https://github.com/SrShelbye/sistema-restaurante-app

### 2. Configura GitHub Pages
1. Haz clic en **Settings** (pestaña arriba)
2. En el menú izquierdo, busca **Pages**
3. En **Build and deployment**:
   - **Source**: GitHub Actions
4. Haz clic en **Save**

### 3. Activa GitHub Actions (si es necesario)
1. Ve a la pestaña **Actions**
2. Si aparece un mensaje para habilitar Actions, haz clic en **I understand my workflows, go ahead and enable them**

### 4. Espera el despliegue
1. Ve a **Actions** → **Deploy to GitHub Pages**
2. Espera a que el workflow termine (puede tardar 2-3 minutos)
3. Cuando esté verde, tu sitio estará disponible

## 🌐 URL de tu aplicación
Una vez completado, tu aplicación estará en:
**https://srshelbye.github.io/sistema-restaurante-app/**

## 🔧 Variables de Entorno (Opcional)
Si necesitas configurar variables de entorno para producción:
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Agrega:
   - `VITE_APP_NAME`: `Sistema Restaurante Demo`
   - `VITE_API_URL`: `https://tu-api-backend.com/api`
   - `VITE_WS_URL`: `wss://tu-api-backend.com`

## 🔄 Actualizaciones Automáticas
A partir de ahora, cada vez que hagas `git push`, el sitio se actualizará automáticamente.

## 🐛 Si hay problemas
1. Ve a **Actions** → **Deploy to GitHub Pages**
2. Revisa el log del workflow
3. Los errores más comunes son:
   - Problemas de dependencias (ya configurado con --legacy-peer-deps)
   - Tiempo de espera del build

## 📱 Prueba la aplicación
Una vez desplegado, prueba:
- Navegación entre páginas
- Diseño responsive
- Funcionalidades básicas

## 🎯 ¡Listo!
Tu sistema de restaurante estará disponible en línea automáticamente.
