# Requerimientos Detallados del Sistema de Soporte UIFCE

## 📋 Requerimientos Funcionales

### 🔐 Autenticación y Autorización (20 requerimientos)

**Login y Seguridad:**
- Login de usuarios con email y contraseña
- Validación de credenciales en backend
- Generación de token JWT al login
- Almacenamiento de token en localStorage
- Verificación de token en cada petición
- Logout y limpieza de token
- Sesión expirada por token inválido
- Manejo de errores de autenticación

**Registro y Usuarios:**
- Registro de nuevos usuarios (admin)
- Validación de formato de email
- Validación de longitud de contraseña
- Hash de contraseñas con bcrypt
- Validación de email institucional @unal.edu.co

**Roles y Permisos:**
- Roles de usuario: usuario, técnico, admin
- Verificación de rol para acceso a rutas
- Protección de rutas por rol
- Redirección por rol después de login

### 🎫 Gestión de Tickets - Usuario (24 requerimientos)

**Creación de Tickets:**
- Crear nuevo ticket
- Seleccionar categoría del ticket
- Seleccionar subcategoría del ticket
- Seleccionar ubicación del ticket
- Ingresar descripción del problema
- Seleccionar prioridad (baja, media, crítica)
- Cálculo automático de puntaje
- Validación de campos obligatorios
- Confirmación de creación de ticket

**Visualización de Tickets:**
- Ver historial de tickets propios
- Ver detalles de ticket propio
- Ver estado actual del ticket
- Ver técnico asignado
- Ver comentarios del ticket
- Ver fecha de creación
- Ver fecha de asignación
- Ver fecha de resolución

**Interacción con Tickets:**
- Agregar comentarios propios
- Filtrar tickets por estado
- Ordenar tickets por fecha
- Búsqueda de tickets por ID
- Paginación de historial

### 🔧 Gestión de Tickets - Técnico (22 requerimientos)

**Visualización de Cola:**
- Ver cola de tickets pendientes
- Ver tickets asignados
- Ver detalles de ticket
- Ver información del solicitante
- Ver categoría y subcategoría
- Ver ubicación del problema
- Ver prioridad del ticket

**Gestión de Tickets:**
- Cambiar estado de ticket
- Asignar ticket a sí mismo
- Marcar ticket como en proceso
- Marcar ticket como resuelto
- Reabrir ticket cerrado

**Filtros y Búsqueda:**
- Ver tickets por estado
- Ver tickets por prioridad
- Ver tickets por categoría
- Ver tickets por ubicación
- Filtrar por fecha de creación
- Ordenar por prioridad

**Comentarios:**
- Agregar comentarios
- Ver comentarios existentes
- Ver historial de cambios

### 👨‍💼 Gestión de Tickets - Admin (28 requerimientos)

**Gestión Completa:**
- Ver todos los tickets del sistema
- Ver detalles completos de ticket
- Asignar técnico a ticket
- Reasignar técnico
- Cambiar estado de ticket
- Cambiar prioridad de ticket
- Modificar categoría de ticket
- Modificar subcategoría de ticket
- Modificar ubicación de ticket
- Eliminar ticket

**Métricas y Estadísticas:**
- Ver métricas de tickets
- Ver tiempo promedio de respuesta
- Ver tiempo promedio de resolución
- Ver tickets sin asignar
- Ver tickets por semana
- Ver estadísticas generales

**Filtros Avanzados:**
- Ver tickets por estado
- Ver tickets por prioridad
- Ver tickets por técnico
- Ver tickets por categoría
- Ver tickets por ubicación
- Filtrar por rango de fechas
- Filtrar por técnico
- Filtrar por estado
- Filtrar por categoría
- Filtrar por edificio
- Exportar lista de tickets

### 📊 Dashboard de Administración (24 requerimientos)

**Métricas Generales:**
- Ver total de tickets
- Ver tickets abiertos
- Ver tickets en proceso
- Ver tickets cerrados

**Gráficos y Visualizaciones:**
- Ver gráfico de tickets por estado
- Ver gráfico de tickets por prioridad
- Ver gráfico de tickets por semana

**Rendimiento por Técnico:**
- Ver rendimiento por técnico
- Ver tickets asignados por técnico
- Ver tickets resueltos por técnico
- Ver eficiencia por técnico
- Ver tickets pendientes por técnico

**Filtros del Dashboard:**
- Ver tickets por categoría
- Ver tickets por edificio
- Aplicar filtros de fecha
- Aplicar filtros de categoría
- Aplicar filtros de edificio
- Aplicar filtros de estado
- Aplicar filtros de técnico
- Limpiar todos los filtros
- Actualizar métricas en tiempo real

### 📁 Gestión de Categorías (19 requerimientos)

**Gestión de Categorías:**
- Ver lista de categorías
- Crear nueva categoría
- Editar categoría existente
- Eliminar categoría
- Activar/desactivar categoría
- Validar nombre único de categoría
- Ordenar categorías alfabéticamente
- Ver cantidad de tickets por categoría

**Gestión de Subcategorías:**
- Ver subcategorías por categoría
- Crear subcategoría
- Editar subcategoría
- Eliminar subcategoría
- Activar/desactivar subcategoría
- Asignar puntaje a subcategoría
- Modificar puntaje de subcategoría
- Validar nombre único de subcategoría
- Ordenar subcategorías alfabéticamente
- Ver cantidad de tickets por subcategoría

### 🏢 Gestión de Ubicaciones (18 requerimientos)

**Gestión de Edificios:**
- Ver lista de edificios
- Crear nuevo edificio
- Editar edificio existente
- Eliminar edificio
- Activar/desactivar edificio
- Validar nombre único de edificio
- Ordenar edificios alfabéticamente
- Ver cantidad de tickets por edificio

**Gestión de Ubicaciones:**
- Ver ubicaciones por edificio
- Crear ubicación
- Editar ubicación
- Eliminar ubicación
- Activar/desactivar ubicación
- Asignar puntaje a ubicación
- Modificar puntaje de ubicación
- Validar nombre único de ubicación
- Ordenar ubicaciones alfabéticamente
- Ver cantidad de tickets por ubicación

### 👥 Gestión de Usuarios (18 requerimientos)

**Gestión Básica:**
- Ver lista de usuarios
- Ver detalles de usuario
- Crear nuevo usuario
- Editar usuario existente
- Eliminar usuario
- Activar/desactivar usuario

**Roles y Permisos:**
- Asignar rol a usuario
- Cambiar rol de usuario
- Validar email único
- Validar formato de email
- Ver usuarios por rol
- Filtrar usuarios por rol

**Búsqueda e Información:**
- Buscar usuario por nombre
- Buscar usuario por email
- Ver fecha de creación de usuario
- Ver estado de usuario
- Ver historial de tickets de usuario
- Resetear contraseña de usuario

### 📝 Auditoría (22 requerimientos)

**Visualización de Registros:**
- Ver registro de auditoría
- Ver últimos 20 registros
- Ver todos los registros
- Exportar registros a CSV

**Detalles de Acciones:**
- Ver acción realizada
- Ver usuario que realizó acción
- Ver rol del usuario
- Ver ticket afectado
- Ver fecha y hora de acción
- Ver detalles de acción

**Filtros de Auditoría:**
- Filtrar por tipo de acción
- Filtrar por usuario
- Filtrar por ticket
- Filtrar por rango de fechas
- Ordenar por fecha

**Tipos de Acciones:**
- Ver acciones de creación
- Ver acciones de asignación
- Ver acciones de reasignación
- Ver acciones de cambio de estado
- Ver acciones de modificación
- Ver acciones de comentarios
- Ver acciones de cierre
- Color por tipo de acción

### 💬 Comentarios (12 requerimientos)

**Gestión de Comentarios:**
- Agregar comentario a ticket
- Ver comentarios de ticket
- Ver autor del comentario
- Ver fecha del comentario
- Editar comentario propio
- Eliminar comentario propio
- Ver comentarios en orden cronológico

**Validación y Notificaciones:**
- Notificar nuevo comentario
- Validar longitud de comentario
- Formato de texto en comentarios

### 🔔 Notificaciones (11 requerimientos)

**Tipos de Notificaciones:**
- Notificar asignación de ticket
- Notificar cambio de estado
- Notificar nuevo comentario
- Notificar reasignación
- Notificar cierre de ticket

**Gestión de Notificaciones:**
- Ver notificaciones
- Marcar notificación como leída
- Eliminar notificación
- Contador de notificaciones
- Sonido de notificación

### 🎨 Interfaz de Usuario (22 requerimientos)

**Diseño Responsive:**
- Diseño responsive
- Navegación por sidebar
- Menú por rol
- Tema de colores institucional
- Iconos en menú
- Breadcrumbs de navegación

**Estados de la UI:**
- Loading states
- Error states
- Empty states
- Modales de confirmación
- Tooltips informativos

**Interactividad:**
- Validación visual de formularios
- Feedback de acciones
- Animaciones suaves
- Transiciones entre páginas
- Scroll suave
- Paginación
- Búsqueda en tiempo real
- Filtros visuales
- Ordenamiento interactivo

### 🗄️ Base de Datos (17 requerimientos)

**Conexión y Gestión:**
- Conexión a MySQL
- Pool de conexiones
- Manejo de errores de conexión
- Transacciones ACID
- Rollback en errores

**Optimización:**
- Índices optimizados
- Backups automáticos
- Migraciones de schema
- Seed de datos iniciales
- Relaciones entre tablas
- Constraints de integridad
- Timestamps automáticos
- Soft deletes
- Consultas optimizadas
- Paginación en queries

### 🔌 API (17 requerimientos)

**Arquitectura REST:**
- Endpoints RESTful
- Validación de inputs
- Sanitización de datos
- Rate limiting
- CORS configurado
- Documentación de endpoints
- Versionado de API

**Error Handling:**
- Error handling
- Logging de errores
- Logging de accesos
- Status codes correctos
- Response format consistente

**Features:**
- Paginación en responses
- Filtros en queries
- Ordenamiento en queries

### 🔒 Seguridad (16 requerimientos)

**Autenticación:**
- Hash de contraseñas
- JWT tokens
- Refresh tokens
- Expiración de tokens

**Protección:**
- HTTPS en producción
- Sanitización de inputs
- Prevención de SQL injection
- Prevención de XSS
- CSRF protection
- Rate limiting
- Headers de seguridad

**Auditoría:**
- Validación de roles
- Auditoría de accesos
- Logs de seguridad
- Manejo de errores seguros

### 🧪 Testing (10 requerimientos)

**Tipos de Tests:**
- Tests unitarios de componentes
- Tests de integración
- Tests de API
- Tests de base de datos
- Tests E2E
- Coverage de código
- Tests de autenticación
- Tests de autorización
- Tests de validación
- Tests de error handling

### 🚀 Despliegue (15 requerimientos)

**Configuración:**
- Configuración de producción
- Variables de entorno
- Build de frontend
- Build de backend
- Configuración de nginx
- SSL/TLS
- Dominio configurado
- CDN para assets

**Monitoreo y Escalabilidad:**
- Monitoreo de errores
- Logs centralizados
- Backups automatizados
- Escalabilidad
- Load balancing
- Health checks

---

## 🌐 API Endpoints Detallados

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación | Roles Permitidos |
|--------|----------|-------------|---------------|------------------|
| POST | `/api/auth/login` | Iniciar sesión con email y contraseña | No | Todos |
| POST | `/api/auth/register` | Registrar nuevo usuario | Sí | Admin |
| POST | `/api/auth/logout` | Cerrar sesión | Sí | Todos |
| GET | `/api/auth/verify` | Verificar token JWT | Sí | Todos |

**Detalles de Login:**
- Valida email institucional @unal.edu.co
- Verifica usuario activo
- Compara contraseña con hash bcrypt
- Genera token JWT con expiración de 24h
- Retorna token y datos del usuario

**Detalles de Registro:**
- Solo administradores pueden crear usuarios
- Valida email institucional
- Valida rol (usuario, técnico, admin)
- Verifica email único
- Hashea contraseña con bcrypt

### 🎫 Tickets (`/api/tickets`)

| Método | Endpoint | Descripción | Autenticación | Roles Permitidos |
|--------|----------|-------------|---------------|------------------|
| GET | `/api/tickets` | Obtener todos los tickets con filtros | Sí | Todos |
| GET | `/api/tickets/:id` | Obtener ticket por ID con comentarios | Sí | Todos |
| POST | `/api/tickets` | Crear nuevo ticket | Sí | Usuario |
| PUT | `/api/tickets/:id` | Actualizar ticket (estado, técnico, etc.) | Sí | Técnico, Admin |
| POST | `/api/tickets/:id/comentarios` | Agregar comentario a ticket | Sí | Todos |
| DELETE | `/api/tickets/:id` | Eliminar ticket | Sí | Admin |

**Detalles de GET `/api/tickets`:**
- Filtros opcionales: estado, prioridad, usuario_id
- Usuarios solo ven sus propios tickets
- Técnicos y admins ven todos los tickets
- Ordenado por fecha de creación descendente

**Detalles de POST `/api/tickets`:**
- Campos requeridos: categoria, subcategoria, ubicacion, edificio, descripcion
- Genera ID único de ticket (TKT-XXXXX-XXXXX)
- Calcula prioridad automáticamente (actualmente fija en 'media')
- Tiempo estimado: 24 horas
- Estado inicial: 'abierto'

**Detalles de PUT `/api/tickets/:id`:**
- Usuarios no pueden actualizar tickets
- Puede cambiar: estado, tecnico_asignado, categoria, subcategoria, ubicacion, edificio
- Auto-asigna técnico si estado cambia a 'en_proceso'
- Registra fecha de asignación
- Registra fecha de resolución si estado es 'cerrado'

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación | Roles Permitidos |
|--------|----------|-------------|---------------|------------------|
| GET | `/api/users` | Obtener todos los usuarios | Sí | Admin |
| GET | `/api/users/:id` | Obtener usuario por ID | Sí | Admin, Propio usuario |
| POST | `/api/users` | Crear nuevo usuario | Sí | Admin |
| PUT | `/api/users/:id` | Actualizar usuario | Sí | Admin, Propio usuario |
| DELETE | `/api/users/:id` | Eliminar usuario | Sí | Admin |

**Detalles de GET `/api/users`:**
- Filtro opcional: rol
- Solo administradores pueden ver todos los usuarios
- Ordenado por nombre alfabéticamente
- No retorna contraseña

**Detalles de PUT `/api/users/:id`:**
- Admin puede cambiar: nombre, password, rol, activo
- Usuario propio puede cambiar: nombre, password
- Valida email institucional
- Hashea nueva contraseña si se proporciona

**Detalles de DELETE `/api/users/:id`:**
- Solo administradores pueden eliminar
- No se puede eliminar propio usuario
- Protección especial para admin principal (uniic_bog@unal.edu.co)

### 📁 Categorías (`/api/categorias`)

| Método | Endpoint | Descripción | Autenticación | Roles Permitidos |
|--------|----------|-------------|---------------|------------------|
| GET | `/api/categorias` | Obtener todas las categorías | Sí | Todos |
| GET | `/api/categorias/:id` | Obtener categoría con subcategorías | Sí | Todos |
| POST | `/api/categorias` | Crear nueva categoría | Sí | Admin |
| PUT | `/api/categorias/:id` | Actualizar categoría | Sí | Admin |
| DELETE | `/api/categorias/:id` | Eliminar categoría | Sí | Admin |

**Detalles de GET `/api/categorias`:**
- Retorna categorías con conteo de subcategorías
- Ordenado por nombre alfabéticamente

**Detalles de GET `/api/categorias/:id`:**
- Retorna categoría completa con todas sus subcategorías
- Subcategorías ordenadas alfabéticamente

### 🏢 Ubicaciones (`/api/ubicaciones`)

| Método | Endpoint | Descripción | Autenticación | Roles Permitidos |
|--------|----------|-------------|---------------|------------------|
| GET | `/api/ubicaciones` | Obtener todas las ubicaciones | Sí | Todos |
| GET | `/api/ubicaciones/edificios/all` | Obtener todos los edificios | Sí | Todos |
| GET | `/api/ubicaciones/:id` | Obtener ubicación por ID | Sí | Todos |
| POST | `/api/ubicaciones` | Crear nueva ubicación | Sí | Admin |
| POST | `/api/ubicaciones/edificios` | Crear nuevo edificio | Sí | Admin |
| PUT | `/api/ubicaciones/:id` | Actualizar ubicación | Sí | Admin |
| DELETE | `/api/ubicaciones/:id` | Eliminar ubicación | Sí | Admin |

**Detalles de GET `/api/ubicaciones`:**
- Filtro opcional: edificio
- Ordenado por edificio y nombre
- Incluye puntaje de ubicación

**Detalles de POST `/api/ubicaciones`:**
- Campos requeridos: nombre, edificio, puntaje
- Puntaje debe estar entre 1 y 10
- Valida rango de puntaje

**Detalles de POST `/api/ubicaciones/edificios`:**
- Crea nuevo edificio
- Valida nombre único

---

## 📊 Resumen de Requerimientos

- **Total de Requerimientos Funcionales:** 262
- **Total de Endpoints API:** 24
- **Módulos Principales:** 9 (Autenticación, Tickets, Usuarios, Categorías, Ubicaciones, Dashboard, Auditoría, Comentarios, Notificaciones)
- **Roles de Usuario:** 3 (Usuario, Técnico, Admin)
- **Base de Datos:** MySQL con 8 tablas principales

## 🗂️ Estructura de Base de Datos

### Tablas Principales:

1. **usuarios** - Información de usuarios y autenticación
2. **tickets** - Tickets de soporte técnico
3. **comentarios** - Comentarios en tickets
4. **categorias** - Categorías de problemas
5. **subcategorias** - Subcategorías detalladas
6. **ubicaciones** - Ubicaciones físicas
7. **edificios** - Edificios del campus
8. **auditoria** - Registro de acciones del sistema

## 🔐 Usuario Admin Por Defecto

- **Email:** `uniic_bog@unal.edu.co`
- **Contraseña:** `Admin123!`
- **Rol:** admin
- **Estado:** Bloqueado (protegido contra eliminación)
- **Propósito:** Usuario administrador principal del sistema

## 🎨 Stack Tecnológico

### Backend:
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** MySQL
- **Autenticación:** JWT + bcrypt
- **ORM:** Consultas nativas MySQL

### Frontend:
- **Framework:** React
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router
- **State Management:** Context API

## 🚀 Estados de Ticket

- **abierto** - Ticket creado y pendiente de asignación
- **en_proceso** - Ticket asignado y siendo atendido
- **cerrado** - Ticket resuelto y finalizado
- **reabierto** - Ticket cerrado que necesita atención adicional

## 🎯 Prioridades de Ticket

- **baja** - Problemas menores, sin impacto crítico
- **media** - Problemas que afectan parcialmente operaciones
- **crítica** - Problemas que afectan críticamente operaciones

## 👥 Roles de Usuario

- **usuario** - Usuarios que crean tickets de soporte
- **tecnico** - Técnicos que atienden y resuelven tickets
- **admin** - Administradores con acceso completo al sistema
