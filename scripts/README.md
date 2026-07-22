# Scripts de arranque (Windows 11)

## Uso

Doble clic en `start.bat` (o `powershell -ExecutionPolicy Bypass -File scripts\start.ps1` desde una
terminal). El script:

1. Verifica que Docker Desktop esté corriendo; si no, lo inicia y espera
   hasta 120s a que el daemon responda.
2. Sincroniza `.env` en la raíz del repo: si no existe lo crea desde
   `scripts/.env.example`; si existe, agrega cualquier variable que falte
   sin tocar lo que ya está configurado.
3. Corre `docker compose up -d --build`.
4. Espera los healthchecks de `backend` y `frontend` y muestra la URL final
   (`http://localhost:<FRONTEND_PORT>`).

## Requisitos

- Docker Desktop instalado, con el backend de WSL2 habilitado.
- Windows PowerShell 5.1 o superior (viene de fábrica en Windows 11).

## Notas

- No hay arranque automático con el login de Windows: es un flujo manual,
  a propósito.
- Si cambiás contraseñas o puertos, editá el `.env` de la raíz del repo
  directamente — `sync-env.ps1` nunca pisa valores ya presentes.
