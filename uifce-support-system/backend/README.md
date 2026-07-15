# Backend UIFCE Support

API REST para conectar el frontend Vite/React con una capa de datos.

## Ejecutar

```bash
npm run backend
```

El servidor levanta por defecto en `http://localhost:3001/api`.

## Sobre `dumpDB.rar`

El RAR fue extraido en `../dumpDB` y contiene el esquema MySQL original:

- `usuarios`
- `tickets`
- `categorias`
- `subcategorias`
- `edificios`
- `oficinas`
- `asignaciones`
- `auditoria`

El dump no trae inserts, contrasenas/hash de usuario, telefono de contacto ni tabla de comentarios. Por eso este backend expone un contrato compatible con el frontend actual usando almacenamiento en memoria y datos seed de desarrollo. La capa queda lista para reemplazarse por MySQL manteniendo los mismos endpoints.

## Endpoints principales

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/usuarios`
- `GET /api/tickets`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `POST /api/tickets/:id/comentarios`
- `GET /api/categorias`
- `GET /api/ubicaciones`
- `GET /api/auditoria`
