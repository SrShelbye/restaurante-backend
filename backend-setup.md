# 🚀 Guía Completa: Backend API para Sistema Restaurante

## 📋 Opciones de Backend

### Opción 1: Node.js + Express + MongoDB (Recomendado)
- Completo y escalable
- Base de datos real
- Autenticación JWT
- WebSocket para tiempo real

### Opción 2: Firebase Backend
- Más rápido de configurar
- Base de datos NoSQL incluida
- Autenticación integrada

### Opción 3: Supabase
- Alternativa a Firebase
- PostgreSQL real
- API REST automática

## 🛠️ Opción 1: Node.js + Express + MongoDB

### Paso 1: Crear Proyecto Backend
```bash
# En una nueva carpeta
mkdir restaurante-backend
cd restaurante-backend
npm init -y
```

### Paso 2: Instalar Dependencias
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken socket.io
npm install -D nodemon @types/node typescript ts-node
```

### Paso 3: Estructura del Proyecto
```
restaurante-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── app.ts
├── .env
├── package.json
└── tsconfig.json
```

### Paso 4: Configuración Básica
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://srshelbye.github.io/sistema-restaurante-app"
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

export { app, server, io };
```

## 🌐 Opción 2: Firebase (Más Rápido)

### Paso 1: Crear Proyecto Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. "Add project" → "restaurante-app"
3. Habilita Authentication, Firestore, Hosting

### Paso 2: Configurar Firebase en Frontend
```typescript
// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "restaurante-app.firebaseapp.com",
  projectId: "restaurante-app",
  storageBucket: "restaurante-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🚀 Opción 3: Supabase (Alternativa Moderna)

### Paso 1: Crear Proyecto Supabase
1. Ve a [supabase.com](https://supabase.com)
2. "Start your project"
3. Crea proyecto "restaurante-app"

### Paso 2: Configurar Cliente
```typescript
// src/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tu-project.supabase.co';
const supabaseKey = 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 🎯 ¿Cuál Elegir?

### Node.js + Express si:
- ✅ Quieres control total
- ✅ Necesitas lógica personalizada
- ✅ Quieres aprender backend completo

### Firebase si:
- ✅ Quieres rapidez
- ✅ No quieres configurar servidor
- ✅ Prefieres todo en uno

### Supabase si:
- ✅ Quieres PostgreSQL real
- ✅ API REST automática
- ✅ Alternativa a Firebase

## 🚀 ¿Quieres que Creemos el Backend Completo?

**Dime qué opción prefieres y te creo:**
1. **Backend Node.js completo** con todas las APIs
2. **Configuración Firebase** para tu proyecto
3. **Setup Supabase** con base de datos

**¿Cuál prefieres? ¿O quieres que te explique más sobre alguna opción?**
