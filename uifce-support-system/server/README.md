# Backend API - Sistema de Soporte UIFCE

Backend API Express + TypeScript para el sistema de gestión de tickets de soporte.

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar el archivo `.env` con tus credenciales de PostgreSQL:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uifce_support
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

## Configuración de Base de Datos

1. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE uifce_support;
```

2. Ejecutar el script de inicialización:
```bash
psql -U postgres -d uifce_support -f database/schema.sql
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar servidor en producción
- `npm run lint` - Ejecutar linter ESLint

## Estructura del Proyecto

```
server/
├── src/
│   ├── config/         # Configuración (base de datos, etc.)
│   ├── controllers/    # Controladores de lógica de negocio
│   ├── middleware/     # Middleware (autenticación, autorización)
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas API
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades y helpers
│   └── server.ts       # Punto de entrada del servidor
├── database/           # Scripts SQL
├── dist/               # Código compilado (generado)
├── package.json
├── tsconfig.json
└── .env.example
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### Tickets
- `GET /api/tickets` - Obtener todos los tickets
- `POST /api/tickets` - Crear nuevo ticket
- `GET /api/tickets/:id` - Obtener ticket por ID
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `POST /api/categorias` - Crear nueva categoría
- `GET /api/categorias/:id` - Obtener categoría por ID
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

### Ubicaciones
- `GET /api/ubicaciones` - Obtener todas las ubicaciones
- `POST /api/ubicaciones` - Crear nueva ubicación
- `GET /api/ubicaciones/:id` - Obtener ubicación por ID
- `PUT /api/ubicaciones/:id` - Actualizar ubicación
- `DELETE /api/ubicaciones/:id` - Eliminar ubicación

## Seguridad

- Autenticación con JWT
- Middleware de autorización por roles
- Validación de inputs con express-validator
- Hash de contraseñas con bcryptjs
- CORS configurado

## Desarrollo

El servidor se ejecuta en el puerto 3001 por defecto. El frontend debe configurarse para hacer requests a `http://localhost:3001/api`.

## Notas

- Los endpoints actualmente retornan mensajes placeholder y deben ser implementados con la lógica de negocio completa.
- La base de datos debe estar configurada antes de iniciar el servidor.
- Las contraseñas deben ser hasheadas con bcrypt antes de almacenarlas en la base de datos.
