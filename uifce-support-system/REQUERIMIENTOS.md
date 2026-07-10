# Requerimientos del Sistema de Soporte UIFCE

## Autenticación y Autorización

- [ ] Login de usuarios con email y contraseña
- [ ] Validación de credenciales en backend
- [ ] Generación de token JWT al login
- [ ] Almacenamiento de token en localStorage
- [ ] Verificación de token en cada petición
- [ ] Logout y limpieza de token
- [ ] Registro de nuevos usuarios (admin)
- [ ] Validación de formato de email
- [ ] Validación de longitud de contraseña
- [ ] Hash de contraseñas con bcrypt
- [ ] Roles de usuario: usuario, técnico, admin
- [ ] Verificación de rol para acceso a rutas
- [ ] Protección de rutas por rol
- [ ] Redirección por rol después de login
- [ ] Sesión expirada por token inválido
- [ ] Manejo de errores de autenticación

## Gestión de Tickets - Usuario

- [ ] Crear nuevo ticket
- [ ] Seleccionar categoría del ticket
- [ ] Seleccionar subcategoría del ticket
- [ ] Seleccionar ubicación del ticket
- [ ] Ingresar descripción del problema
- [ ] Seleccionar prioridad (baja, media, crítica)
- [ ] Cálculo automático de puntaje
- [ ] Validación de campos obligatorios
- [ ] Confirmación de creación de ticket
- [ ] Ver historial de tickets propios
- [ ] Ver detalles de ticket propio
- [ ] Ver estado actual del ticket
- [ ] Ver técnico asignado
- [ ] Ver comentarios del ticket
- [ ] Agregar comentarios propios
- [ ] Ver fecha de creación
- [ ] Ver fecha de asignación
- [ ] Ver fecha de resolución
- [ ] Filtrar tickets por estado
- [ ] Ordenar tickets por fecha
- [ ] Búsqueda de tickets por ID
- [ ] Paginación de historial

## Gestión de Tickets - Técnico

- [ ] Ver cola de tickets pendientes
- [ ] Ver tickets asignados
- [ ] Ver detalles de ticket
- [ ] Ver información del solicitante
- [ ] Ver categoría y subcategoría
- [ ] Ver ubicación del problema
- [ ] Ver prioridad del ticket
- [ ] Cambiar estado de ticket
- [ ] Asignar ticket a sí mismo
- [ ] Ver tickets por estado
- [ ] Ver tickets por prioridad
- [ ] Ver tickets por categoría
- [ ] Ver tickets por ubicación
- [ ] Agregar comentarios
- [ ] Ver comentarios existentes
- [ ] Ver historial de cambios
- [ ] Marcar ticket como en proceso
- [ ] Marcar ticket como resuelto
- [ ] Reabrir ticket cerrado
- [ ] Filtrar por fecha de creación
- [ ] Ordenar por prioridad

## Gestión de Tickets - Admin

- [ ] Ver todos los tickets del sistema
- [ ] Ver detalles completos de ticket
- [ ] Asignar técnico a ticket
- [ ] Reasignar técnico
- [ ] Cambiar estado de ticket
- [ ] Cambiar prioridad de ticket
- [ ] Modificar categoría de ticket
- [ ] Modificar subcategoría de ticket
- [ ] Modificar ubicación de ticket
- [ ] Eliminar ticket
- [ ] Ver métricas de tickets
- [ ] Ver tickets por estado
- [ ] Ver tickets por prioridad
- [ ] Ver tickets por técnico
- [ ] Ver tickets por categoría
- [ ] Ver tickets por ubicación
- [ ] Filtrar por rango de fechas
- [ ] Filtrar por técnico
- [ ] Filtrar por estado
- [ ] Filtrar por categoría
- [ ] Filtrar por edificio
- [ ] Exportar lista de tickets
- [ ] Ver estadísticas generales
- [ ] Ver tiempo promedio de respuesta
- [ ] Ver tiempo promedio de resolución
- [ ] Ver tickets sin asignar
- [ ] Ver tickets por semana

## Dashboard de Administración

- [ ] Ver total de tickets
- [ ] Ver tickets abiertos
- [ ] Ver tickets en proceso
- [ ] Ver tickets cerrados
- [ ] Ver gráfico de tickets por estado
- [ ] Ver gráfico de tickets por prioridad
- [ ] Ver gráfico de tickets por semana
- [ ] Ver rendimiento por técnico
- [ ] Ver tickets asignados por técnico
- [ ] Ver tickets resueltos por técnico
- [ ] Ver eficiencia por técnico
- [ ] Ver tickets pendientes por técnico
- [ ] Ver tickets por categoría
- [ ] Ver tickets por edificio
- [ ] Aplicar filtros de fecha
- [ ] Aplicar filtros de categoría
- [ ] Aplicar filtros de edificio
- [ ] Aplicar filtros de estado
- [ ] Aplicar filtros de técnico
- [ ] Limpiar todos los filtros
- [ ] Actualizar métricas en tiempo real

## Gestión de Categorías

- [ ] Ver lista de categorías
- [ ] Crear nueva categoría
- [ ] Editar categoría existente
- [ ] Eliminar categoría
- [ ] Activar/desactivar categoría
- [ ] Ver subcategorías por categoría
- [ ] Crear subcategoría
- [ ] Editar subcategoría
- [ ] Eliminar subcategoría
- [ ] Activar/desactivar subcategoría
- [ ] Asignar puntaje a subcategoría
- [ ] Modificar puntaje de subcategoría
- [ ] Validar nombre único de categoría
- [ ] Validar nombre único de subcategoría
- [ ] Ordenar categorías alfabéticamente
- [ ] Ordenar subcategorías alfabéticamente
- [ ] Ver cantidad de tickets por categoría
- [ ] Ver cantidad de tickets por subcategoría

## Gestión de Ubicaciones

- [ ] Ver lista de edificios
- [ ] Crear nuevo edificio
- [ ] Editar edificio existente
- [ ] Eliminar edificio
- [ ] Activar/desactivar edificio
- [ ] Ver ubicaciones por edificio
- [ ] Crear ubicación
- [ ] Editar ubicación
- [ ] Eliminar ubicación
- [ ] Activar/desactivar ubicación
- [ ] Asignar puntaje a ubicación
- [ ] Modificar puntaje de ubicación
- [ ] Validar nombre único de edificio
- [ ] Validar nombre único de ubicación
- [ ] Ordenar edificios alfabéticamente
- [ ] Ordenar ubicaciones alfabéticamente
- [ ] Ver cantidad de tickets por edificio
- [ ] Ver cantidad de tickets por ubicación

## Gestión de Usuarios

- [ ] Ver lista de usuarios
- [ ] Ver detalles de usuario
- [ ] Crear nuevo usuario
- [ ] Editar usuario existente
- [ ] Eliminar usuario
- [ ] Activar/desactivar usuario
- [ ] Asignar rol a usuario
- [ ] Cambiar rol de usuario
- [ ] Validar email único
- [ ] Validar formato de email
- [ ] Ver usuarios por rol
- [ ] Filtrar usuarios por rol
- [ ] Buscar usuario por nombre
- [ ] Buscar usuario por email
- [ ] Ver fecha de creación de usuario
- [ ] Ver estado de usuario
- [ ] Ver historial de tickets de usuario
- [ ] Resetear contraseña de usuario

## Auditoría

- [ ] Ver registro de auditoría
- [ ] Ver últimos 20 registros
- [ ] Ver todos los registros
- [ ] Exportar registros a CSV
- [ ] Ver acción realizada
- [ ] Ver usuario que realizó acción
- [ ] Ver rol del usuario
- [ ] Ver ticket afectado
- [ ] Ver fecha y hora de acción
- [ ] Ver detalles de acción
- [ ] Filtrar por tipo de acción
- [ ] Filtrar por usuario
- [ ] Filtrar por ticket
- [ ] Filtrar por rango de fechas
- [ ] Ordenar por fecha
- [ ] Ver acciones de creación
- [ ] Ver acciones de asignación
- [ ] Ver acciones de reasignación
- [ ] Ver acciones de cambio de estado
- [ ] Ver acciones de modificación
- [ ] Ver acciones de comentarios
- [ ] Ver acciones de cierre
- [ ] Color por tipo de acción

## Comentarios

- [ ] Agregar comentario a ticket
- [ ] Ver comentarios de ticket
- [ ] Ver autor del comentario
- [ ] Ver fecha del comentario
- [ ] Editar comentario propio
- [ ] Eliminar comentario propio
- [ ] Ver comentarios en orden cronológico
- [ ] Notificar nuevo comentario
- [ ] Validar longitud de comentario
- [ ] Formato de texto en comentarios

## Notificaciones

- [ ] Notificar asignación de ticket
- [ ] Notificar cambio de estado
- [ ] Notificar nuevo comentario
- [ ] Notificar reasignación
- [ ] Notificar cierre de ticket
- [ ] Ver notificaciones
- [ ] Marcar notificación como leída
- [ ] Eliminar notificación
- [ ] Contador de notificaciones
- [ ] Sonido de notificación

## Interfaz de Usuario

- [ ] Diseño responsive
- [ ] Navegación por sidebar
- [ ] Menú por rol
- [ ] Tema de colores institucional
- [ ] Iconos en menú
- [ ] Breadcrumbs de navegación
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Modales de confirmación
- [ ] Tooltips informativos
- [ ] Validación visual de formularios
- [ ] Feedback de acciones
- [ ] Animaciones suaves
- [ ] Transiciones entre páginas
- [ ] Scroll suave
- [ ] Paginación
- [ ] Búsqueda en tiempo real
- [ ] Filtros visuales
- [ ] Ordenamiento interactivo

## Base de Datos

- [ ] Conexión a MySQL
- [ ] Pool de conexiones
- [ ] Manejo de errores de conexión
- [ ] Transacciones ACID
- [ ] Rollback en errores
- [ ] Índices optimizados
- [ ] Backups automáticos
- [ ] Migraciones de schema
- [ ] Seed de datos iniciales
- [ ] Relaciones entre tablas
- [ ] Constraints de integridad
- [ ] Timestamps automáticos
- [ ] Soft deletes
- [ ] Consultas optimizadas
- [ ] Paginación en queries

## API

- [ ] Endpoints RESTful
- [ ] Validación de inputs
- [ ] Sanitización de datos
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Documentación de endpoints
- [ ] Versionado de API
- [ ] Error handling
- [ ] Logging de errores
- [ ] Logging de accesos
- [ ] Status codes correctos
- [ ] Response format consistente
- [ ] Paginación en responses
- [ ] Filtros en queries
- [ ] Ordenamiento en queries

## Seguridad

- [ ] Hash de contraseñas
- [ ] JWT tokens
- [ ] Refresh tokens
- [ ] Expiración de tokens
- [ ] HTTPS en producción
- [ ] Sanitización de inputs
- [ ] Prevención de SQL injection
- [ ] Prevención de XSS
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Headers de seguridad
- [ ] Validación de roles
- [ ] Auditoría de accesos
- [ ] Logs de seguridad
- [ ] Manejo de errores seguros

## Testing

- [ ] Tests unitarios de componentes
- [ ] Tests de integración
- [ ] Tests de API
- [ ] Tests de base de datos
- [ ] Tests E2E
- [ ] Coverage de código
- [ ] Tests de autenticación
- [ ] Tests de autorización
- [ ] Tests de validación
- [ ] Tests de error handling

## Despliegue

- [ ] Configuración de producción
- [ ] Variables de entorno
- [ ] Build de frontend
- [ ] Build de backend
- [ ] Configuración de nginx
- [ ] SSL/TLS
- [ ] Dominio configurado
- [ ] CDN para assets
- [ ] Monitoreo de errores
- [ ] Logs centralizados
- [ ] Backups automatizados
- [ ] Escalabilidad
- [ ] Load balancing
- [ ] Health checks
