# UIFCE Support System

Sistema de soporte técnico para UIFCE con backend en Express + TypeScript, base de datos MySQL y frontend en React + TypeScript.

## Estructura del Proyecto

- `server/` - Backend Express + TypeScript
  - `src/` - Código fuente del backend
  - `database/` - Esquema y migraciones de base de datos
  - `package.json` - Dependencias del backend
- `src/` - Frontend React + TypeScript
  - `components/` - Componentes de UI
  - `pages/` - Páginas de la aplicación
  - `contexts/` - Contextos de React
  - `hooks/` - Hooks personalizados
  - `utils/` - Utilidades
  - `types/` - Definiciones de tipos TypeScript

## Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)

### Instalación del Backend

```bash
cd server
npm install
```

### Instalación del Frontend

```bash
npm install
```

### Configuración de Base de Datos

1. Crear base de datos MySQL:
```sql
CREATE DATABASE uifce_support;
```

2. Configurar variables de entorno:
```bash
cd server
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

3. Ejecutar esquema de base de datos:
```bash
mysql -u root -p uifce_support < database/schema.sql
```

4. Ejecutar migración de datos:
```bash
npm run seed
```

### Ejecutar el Servidor

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001` y el frontend en `http://localhost:5173`

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Tickets
- `GET /api/tickets` - Obtener todos los tickets
- `GET /api/tickets/:id` - Obtener ticket por ID
- `POST /api/tickets` - Crear nuevo ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket
- `POST /api/tickets/:id/comentarios` - Agregar comentario

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría (admin)
- `PUT /api/categorias/:id` - Actualizar categoría (admin)
- `DELETE /api/categorias/:id` - Eliminar categoría (admin)

### Ubicaciones
- `GET /api/ubicaciones` - Obtener todas las ubicaciones
- `GET /api/ubicaciones/:id` - Obtener ubicación por ID
- `POST /api/ubicaciones` - Crear ubicación (admin)
- `PUT /api/ubicaciones/:id` - Actualizar ubicación (admin)
- `DELETE /api/ubicaciones/:id` - Eliminar ubicación (admin)
- `GET /api/ubicaciones/edificios/all` - Obtener todos los edificios
- `POST /api/ubicaciones/edificios` - Crear edificio (admin)

## Usuario Admin Por Defecto

- Email: `uniic_bog@unal.edu.co`
- Contraseña: `Admin123!`
- Estado: Bloqueado (protegido contra eliminación)

## Licencia

MIT
