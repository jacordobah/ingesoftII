# Backend - Sistema de Soporte UIFCE

Backend en Node.js/Express con MySQL para el sistema de gestión de tickets de soporte.

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Instalación

1. **Clonar el repositorio y navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con tus credenciales de MySQL:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=uifce_support
   DB_PORT=3306
   PORT=3001
   JWT_SECRET=tu_jwt_secret_secreto
   ```

4. **Crear la base de datos:**
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```

   O ejecutar el script SQL directamente en MySQL Workbench o phpMyAdmin.

## Ejecutar el Servidor

**Modo desarrollo (con recarga automática):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (solo desarrollo)

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Tickets
- `GET /api/tickets` - Obtener todos los tickets (con filtros opcionales)
- `GET /api/tickets/:id` - Obtener ticket por ID con comentarios
- `POST /api/tickets` - Crear ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/comentarios` - Agregar comentario
- `DELETE /api/tickets/:id` - Eliminar ticket

### Categorías
- `GET /api/categorias` - Obtener todas las categorías con subcategorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría
- `POST /api/categorias/:id/subcategorias` - Crear subcategoría
- `PUT /api/categorias/subcategorias/:id` - Actualizar subcategoría
- `DELETE /api/categorias/subcategorias/:id` - Eliminar subcategoría

### Ubicaciones
- `GET /api/ubicaciones` - Obtener todos los edificios con ubicaciones
- `GET /api/ubicaciones/edificios/:id` - Obtener edificio por ID
- `POST /api/ubicaciones/edificios` - Crear edificio
- `PUT /api/ubicaciones/edificios/:id` - Actualizar edificio
- `DELETE /api/ubicaciones/edificios/:id` - Eliminar edificio
- `POST /api/ubicaciones/edificios/:id/ubicaciones` - Crear ubicación
- `PUT /api/ubicaciones/ubicaciones/:id` - Actualizar ubicación
- `DELETE /api/ubicaciones/ubicaciones/:id` - Eliminar ubicación

### Auditoría
- `GET /api/auditoria` - Obtener registros de auditoría
- `GET /api/auditoria/:id` - Obtener registro por ID
- `GET /api/auditoria/ticket/:ticketId` - Obtener auditoría de un ticket
- `POST /api/auditoria` - Crear registro de auditoría

## Estructura de la Base de Datos

### Tablas Principales
- `usuarios` - Información de usuarios
- `tickets` - Tickets de soporte
- `categorias` - Categorías de tickets
- `subcategorias` - Subcategorías con puntajes
- `edificios` - Edificios del campus
- `ubicaciones` - Ubicaciones específicas
- `comentarios` - Comentarios de tickets
- `auditoria` - Registro de acciones del sistema

## Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- JWT para autenticación
- CORS configurado para permitir peticiones del frontend
- Validación de datos en todos los endpoints

## Desarrollo

El backend utiliza:
- Express.js - Framework web
- mysql2 - Cliente MySQL con promesas
- bcryptjs - Hash de contraseñas
- jsonwebtoken - Autenticación JWT
- cors - Manejo de CORS
- dotenv - Variables de entorno
- uuid - Generación de IDs únicos
- nodemon - Recarga automática en desarrollo

## Troubleshooting

**Error de conexión a MySQL:**
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `uifce_support` exista

**Error de puerto en uso:**
- Cambia el puerto en `.env` o detén el proceso que usa el puerto 3001

**Error de dependencias:**
- Ejecuta `npm install` nuevamente
- Borra `node_modules` y `package-lock.json` y reinstala
