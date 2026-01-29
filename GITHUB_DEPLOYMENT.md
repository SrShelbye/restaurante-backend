# 🚀 Guía de Despliegue con GitHub

## 📋 Paso 1: Crear Repositorio en GitHub

### 1. Ve a GitHub
- Abre [github.com](https://github.com)
- Inicia sesión con tu cuenta

### 2. Crea Nuevo Repositorio
- Haz clic en **"New"** (o el icono +)
- **Repository name**: `sistema-restaurante-app`
- **Description**: `Sistema completo de gestión de restaurantes`
- **Visibility**: Public (o Private si prefieres)
- **NO marques** "Add a README file" (ya tenemos uno)
- **NO marques** "Add .gitignore" (ya tenemos uno)
- Haz clic en **"Create repository"**

## 📋 Paso 2: Conectar y Subir Código

### Opción A: Si ya tienes el repositorio creado
```bash
# Reemplaza TU_USERNAME con tu usuario de GitHub
git remote add origin https://github.com/TU_USERNAME/sistema-restaurante-app.git
git branch -M main
git push -u origin main
```

### Opción B: Sigue las instrucciones de GitHub
GitHub te dará comandos similares a los de arriba.

## 📋 Paso 3: Configurar Despliegue Automático

### Opción 1: GitHub Pages (Gratis y Rápido)
1. En tu repositorio, ve a **Settings**
2. Busca **Pages** en el menú izquierdo
3. **Source**: Deploy from a branch
4. **Branch**: `main`
5. **Folder**: `/dist`
6. Haz clic en **Save**

### Opción 2: Netlify con GitHub (Recomendado)
1. Ve a [netlify.com](https://netlify.com)
2. **"Sign up"** y conecta tu cuenta GitHub
3. **"New site from Git"**
4. Selecciona tu repositorio `sistema-restaurante-app`
5. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Environment variables**:
   - `VITE_APP_NAME`: `Sistema Restaurante Demo`
   - `VITE_API_URL`: `https://tu-api-backend.com/api`
   - `VITE_WS_URL`: `wss://tu-api-backend.com`
7. Haz clic en **"Deploy site"**

### Opción 3: Vercel con GitHub
1. Ve a [vercel.com](https://vercel.com)
2. **"New Project"**
3. Importa tu repositorio GitHub
4. **Framework Preset**: Vite
5. **Root Directory**: `./`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. Configura las variables de entorno
9. Haz clic en **Deploy**

## 📋 Paso 4: Configurar Variables de Entorno

### Importante para el Funcionamiento
Configura estas variables en tu plataforma de despliegue:

```env
VITE_APP_NAME=Sistema Restaurante Demo
VITE_API_URL=https://tu-api-backend.com/api
VITE_WS_URL=wss://tu-api-backend.com
```

### Si no tienes backend API
Puedes usar URLs de demostración:
```env
VITE_API_URL=https://jsonplaceholder.typicode.com
VITE_WS_URL=wss://echo.websocket.org
```

## 📋 Paso 5: Verificar Despliegue

1. **Espera unos minutos** para que se complete el despliegue
2. **Visita la URL** que te proporciona la plataforma
3. **Verifica que la aplicación carga**
4. **Prueba la navegación** entre secciones

## 🎯 Comandos Útiles

### Para actualizar el repositorio
```bash
git add .
git commit -m "Tu mensaje de commit"
git push
```

### Para forzar push (si hay problemas)
```bash
git push -f origin main
```

## 🔧 Configuraciones Adicionales

### GitHub Actions (Despliegue Automático)
Crea el archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install --legacy-peer-deps
    - name: Build
      run: npm run build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## ⚠️ Notas Importantes

1. **Backend API**: La aplicación necesita una API para funcionar completamente
2. **CORS**: Configura tu backend para permitir el dominio de despliegue
3. **HTTPS**: Usa URLs HTTPS en producción
4. **Actualizaciones**: Cada `git push` actualizará automáticamente el sitio

## 🎉 ¡Listo!

Tu sistema de restaurante estará disponible en:
- **GitHub Pages**: `https://TU_USERNAME.github.io/sistema-restaurante-app`
- **Netlify**: `https://random-name.netlify.app`
- **Vercel**: `https://sistema-restaurante-app.vercel.app`
