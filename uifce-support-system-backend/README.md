# UIFCE Support System

Sistema de soporte técnico para UIFCE con backend en Spring Boot + Java, base de datos MySQL y frontend en React + TypeScript.

## Estructura del Proyecto

- `src/` - Backend Spring Boot
  - `main/java/uifce/support/api/` - Código fuente del backend
  - `main/resources/` - Recursos y configuración
  - `test/` - Tests del backend
- `frontend/` - Frontend React + TypeScript
  - `src/` - Código fuente del frontend
  - `components/` - Componentes de UI
  - `pages/` - Páginas de la aplicación
  - `contexts/` - Contextos de React
  - `hooks/` - Hooks personalizados
  - `utils/` - Utilidades
  - `types/` - Definiciones de tipos TypeScript

## Configuración

### Requisitos Previos

- Java 21
- Maven 3.8+
- Node.js (v18 o superior)
- MySQL (v8.0 o superior)

### Instalación del Backend

```bash
# Instalar dependencias de Maven
./mvnw clean install

# O usando Maven local
mvn clean install
```

### Instalación del Frontend

```bash
cd frontend
npm install
```

### Configuración de Base de Datos

1. Crear base de datos MySQL:
```sql
CREATE DATABASE uifce_support;
```

2. Configurar variables de entorno en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/uifce_support
spring.datasource.username=root
spring.datasource.password=tu_password
```

3. Las migraciones de Flyway se ejecutan automáticamente al iniciar el backend

### Ejecutar el Servidor

**Backend (Spring Boot):**
```bash
./mvnw spring-boot:run

# O usando Maven local
mvn spring-boot:run
```

**Frontend (React):**
```bash
cd frontend
npm run dev
```

El backend estará disponible en `http://localhost:8080` y el frontend en `http://localhost:3000`

## Docker

El proyecto puede ejecutarse con Docker Compose:

```bash
docker compose up --build -d
```

URLs locales:

- App: `http://localhost:8080`
- API: `http://localhost:8080/api/v1`

Variables opcionales:

```bash
FRONTEND_PORT=8080
SPRING_DATASOURCE_PASSWORD=change-me-in-production
```

## API Endpoints

### Tickets
- `POST /api/v1/tickets` - Crear nuevo ticket
- `GET /api/v1/tickets` - Obtener todos los tickets (paginado)
- `PATCH /api/v1/tickets/cambiar-estado` - Cambiar estado de ticket
- `PATCH /api/v1/tickets/asignar-tecnico` - Asignar técnico a ticket

### Usuarios
- `GET /api/v1/usuarios` - Obtener todos los usuarios
- `GET /api/v1/usuarios/{id}` - Obtener usuario por ID
- `POST /api/v1/usuarios` - Crear usuario
- `DELETE /api/v1/usuarios/{id}` - Eliminar usuario

### Categorías
- `GET /api/v1/categoria` - Obtener todas las categorías
- `GET /api/v1/categoria/{id}` - Obtener categoría por ID
- `POST /api/v1/categoria` - Crear categoría
- `PUT /api/v1/categoria` - Actualizar categoría
- `DELETE /api/v1/categoria/{id}` - Eliminar categoría
- `GET /api/v1/categoria/{id}/subcategorias` - Obtener subcategorías
- `POST /api/v1/categoria/{id}/supcategoria` - Crear subcategoría
- `PUT /api/v1/categoria/subcategoria` - Actualizar subcategoría
- `DELETE /api/v1/categoria/subcategoria/{id}` - Eliminar subcategoría

### Ubicaciones
- `GET /api/v1/edificios` - Obtener todos los edificios
- `GET /api/v1/edificios/{id}` - Obtener edificio por ID
- `POST /api/v1/edificios` - Crear edificio
- `PUT /api/v1/edificios` - Actualizar edificio
- `DELETE /api/v1/edificios/{id}` - Eliminar edificio
- `GET /api/v1/edificios/{id}/oficinas` - Obtener oficinas de edificio
- `POST /api/v1/edificios/{id}/oficinas` - Crear oficina
- `PUT /api/v1/edificios/oficinas` - Actualizar oficina
- `DELETE /api/v1/edificios/oficinas/{id}` - Eliminar oficina

### Auditoría
- `GET /api/v1/auditoria` - Obtener registros de auditoría
- `GET /api/v1/auditoria/ticket/{ticketId}` - Obtener auditoría por ticket

## Usuario Admin Por Defecto

- Email: `uniic_bog@unal.edu.co`
- Contraseña: `Admin123!`
- Estado: Bloqueado (protegido contra eliminación)

## Licencia

MIT
