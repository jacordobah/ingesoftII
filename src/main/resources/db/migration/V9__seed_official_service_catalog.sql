-- Catálogos oficiales de servicio y ubicación.
-- El modelo actual tiene un solo nivel de subcategoría; cuando la matriz
-- oficial define dos niveles distintos se conserva la ruta completa.

INSERT INTO categorias (nombre, descripcion, activo)
SELECT seed.nombre, seed.descripcion, TRUE
FROM (
    SELECT 'Conceptos técnicos' AS nombre, 'Bajas, compras y directrices técnicas.' AS descripcion
    UNION ALL SELECT 'Impresoras', 'Soporte y mantenimiento de impresoras.'
    UNION ALL SELECT 'PC y portátiles', 'Soporte de equipos de cómputo y conectividad.'
    UNION ALL SELECT 'Software', 'Soporte de aplicaciones y acceso remoto.'
    UNION ALL SELECT 'Telefonía', 'Soporte del servicio telefónico y su cableado.'
    UNION ALL SELECT 'Video, proyectores o pantallas', 'Soporte de equipos audiovisuales.'
    UNION ALL SELECT 'Servidores', 'Soporte de servidores web y bases de datos.'
) seed
LEFT JOIN categorias existing ON existing.nombre = seed.nombre
WHERE existing.id IS NULL;

INSERT INTO subcategorias (categoria_id, nombre, puntaje, activo)
SELECT category.id, seed.nombre, seed.puntaje, TRUE
FROM (
    SELECT 'Conceptos técnicos' AS categoria, 'Bajas' AS nombre, 50 AS puntaje
    UNION ALL SELECT 'Conceptos técnicos', 'Compras', 70
    UNION ALL SELECT 'Conceptos técnicos', 'Directrices técnicas', 70

    UNION ALL SELECT 'Impresoras', 'Mantenimiento preventivo', 30
    UNION ALL SELECT 'Impresoras', 'Instalación o conexión', 10
    UNION ALL SELECT 'Impresoras', 'Instalación de tóner', 10
    UNION ALL SELECT 'Impresoras', 'Falla de red', 10
    UNION ALL SELECT 'Impresoras', 'Otro', 20

    UNION ALL SELECT 'PC y portátiles', 'Instalación y alistamiento', 25
    UNION ALL SELECT 'PC y portátiles', 'Movimiento de equipos entre oficinas', 20
    UNION ALL SELECT 'PC y portátiles', 'Limpieza interna y externa', 25
    UNION ALL SELECT 'PC y portátiles', 'Hardware / Equipo no enciende', 5
    UNION ALL SELECT 'PC y portátiles', 'Hardware / Daño en periféricos', 5
    UNION ALL SELECT 'PC y portátiles', 'Software / Equipo no inicia, pantalla negra', 5
    UNION ALL SELECT 'PC y portátiles', 'Software / Equipo lento', 10
    UNION ALL SELECT 'PC y portátiles', 'Software / Software con fallas', 5
    UNION ALL SELECT 'PC y portátiles', 'Internet y conectividad / Equipo sin internet, no navega', 5
    UNION ALL SELECT 'PC y portátiles', 'Internet y conectividad / Acceso a servidor de archivos', 10

    UNION ALL SELECT 'Software', 'Office', 10
    UNION ALL SELECT 'Software', 'VPN', 10
    UNION ALL SELECT 'Software', 'Otro', 10

    UNION ALL SELECT 'Telefonía', 'Teléfono sin servicio', 10
    UNION ALL SELECT 'Telefonía', 'Cambio o reparación de cables', 10

    UNION ALL SELECT 'Video, proyectores o pantallas', 'Mantenimiento preventivo', 10
    UNION ALL SELECT 'Video, proyectores o pantallas', 'No proyecta, imagen con problemas', 5
    UNION ALL SELECT 'Video, proyectores o pantallas', 'Otro', 10

    UNION ALL SELECT 'Servidores', 'Servidor web y bases de datos / Instalación / actualización de paquetes', 10
    UNION ALL SELECT 'Servidores', 'Servidor web y bases de datos / Carga de archivos', 10
    UNION ALL SELECT 'Servidores', 'Servidor web y bases de datos / Backups', 10
) seed
JOIN categorias category ON category.nombre = seed.categoria
LEFT JOIN subcategorias existing
    ON existing.categoria_id = category.id
    AND existing.nombre = seed.nombre
WHERE existing.id IS NULL;

INSERT INTO edificios (numero, nombre, activo)
SELECT seed.numero, seed.nombre, TRUE
FROM (
    SELECT 311 AS numero, 'Edificio 311' AS nombre
    UNION ALL SELECT 310, 'Edificio 310'
    UNION ALL SELECT 238, 'Edificio 238'
) seed
LEFT JOIN edificios existing
    ON existing.numero = seed.numero
    OR existing.nombre = seed.nombre
WHERE existing.id IS NULL;

INSERT INTO oficinas (edificio_id, nombre, puntaje, activo)
SELECT building.id, seed.nombre, seed.puntaje, TRUE
FROM (
    SELECT 311 AS edificio, 'Archivo 311' AS nombre, 10 AS puntaje
    UNION ALL SELECT 311, 'Decanatura', 1
    UNION ALL SELECT 311, 'Oficina de Apoyo Docente 311', 20
    UNION ALL SELECT 311, 'Oficina de Calificaciones', 10
    UNION ALL SELECT 311, 'Oficinas Docentes', 20
    UNION ALL SELECT 311, 'Salones 311', 10
    UNION ALL SELECT 311, 'Secretaría Académica', 5
    UNION ALL SELECT 311, 'Unidad Administrativa', 5
    UNION ALL SELECT 311, 'Vicedecanatura', 1

    UNION ALL SELECT 310, 'Auditorio Principal', 10
    UNION ALL SELECT 310, 'Auditorios Auxiliares', 10
    UNION ALL SELECT 310, 'Biblioteca', 20
    UNION ALL SELECT 310, 'CADE - Oficinas Programas Curriculares', 10
    UNION ALL SELECT 310, 'Oficina Apoyo a la Gestión', 20
    UNION ALL SELECT 310, 'Oficina Área C. de Contabilidad y Finanzas', 10
    UNION ALL SELECT 310, 'Oficina Área C. de Economía y Desarrollo', 10
    UNION ALL SELECT 310, 'Oficina Área C. de Gestión y Organizaciones', 10
    UNION ALL SELECT 310, 'Oficina Bienestar', 10
    UNION ALL SELECT 310, 'Oficina de Soporte Técnico', 20
    UNION ALL SELECT 310, 'Oficina ORI', 10
    UNION ALL SELECT 310, 'Sala 1', 20
    UNION ALL SELECT 310, 'Sala 2', 20
    UNION ALL SELECT 310, 'Sala 3', 20
    UNION ALL SELECT 310, 'Sala de Juntas', 5
    UNION ALL SELECT 310, 'Sala de Videoconferencias', 5
    UNION ALL SELECT 310, 'Salones 310', 10
    UNION ALL SELECT 310, 'UACE - Salón 205', 20
    UNION ALL SELECT 310, 'Unidad de Informática', 10

    UNION ALL SELECT 238, 'Archivo 238', 20
    UNION ALL SELECT 238, 'Centro Editorial', 20
    UNION ALL SELECT 238, 'Comunicaciones', 20
    UNION ALL SELECT 238, 'Oficina de Apoyo Docente 238', 20
    UNION ALL SELECT 238, 'Oficinas Docentes', 10
) seed
JOIN edificios building ON building.numero = seed.edificio
LEFT JOIN oficinas existing
    ON existing.edificio_id = building.id
    AND existing.nombre = seed.nombre
WHERE existing.id IS NULL;
