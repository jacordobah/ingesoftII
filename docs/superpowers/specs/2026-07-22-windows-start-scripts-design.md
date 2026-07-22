# Scripts de arranque para Windows 11 — Diseño

Fecha: 2026-07-22

## Contexto

El proyecto se levanta hoy con `docker compose up -d --build` usando
`docker-compose.yml` (servicios `backend`, `mysql`, `frontend`). No existe
ningún script de conveniencia para desarrolladores en Windows 11, ni un
archivo `.env.example` — los valores por defecto (`MYSQL_ROOT_PASSWORD`,
`MYSQL_DATABASE`, `MYSQL_PORT`, `FRONTEND_PORT`, `SPRING_DATASOURCE_*`) solo
existen como fallback embebido en `docker-compose.yml` vía sintaxis
`${VAR:-default}`.

Se pidió replicar, para Windows 11, el patrón de un proyecto de referencia
(`~/am4-drones/scripts/start.sh` + `sync-tunnels.sh`): un script de entrada
único que levanta el stack, más un script de sincronización que corre como
parte del flujo. Ese proyecto de referencia sincroniza URLs de Cloudflare
Quick Tunnel — este proyecto no usa túneles, así que el paso de
sincronización se adapta a generar/validar el archivo `.env`.

## Decisiones (confirmadas con el usuario)

- **Sin automatismo de arranque de Windows.** No se registra ninguna tarea
  programada ni arranque con el login. Es un flujo manual: el usuario
  ejecuta el script cuando quiere levantar el stack.
- **Alcance de "sincronización":** generar/verificar el archivo `.env` a
  partir de una plantilla, no túneles ni otra cosa.
- Los scripts deben quedar en PowerShell (`.ps1`), con un wrapper `.bat`
  para permitir doble clic sin fricción de política de ejecución.

## Componentes

### 1. `scripts/.env.example`

Plantilla de variables de entorno con los mismos defaults que hoy están
hardcodeados en `docker-compose.yml`:

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/uifce_support
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
SPRING_PROFILES_ACTIVE=production
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=uifce_support
MYSQL_PORT=3306
FRONTEND_PORT=8080
```

### 2. `scripts/sync-env.ps1`

Equivalente de `sync-tunnels.sh`, adaptado a `.env` en vez de túneles
Cloudflare:

- Resuelve la raíz del repo relativa a la ubicación del script.
- Si `.env` no existe en la raíz del repo: lo copia desde
  `scripts/.env.example` y muestra un mensaje pidiendo al usuario que
  revise los valores (especialmente contraseñas) antes de continuar.
- Si `.env` existe: lee sus claves, compara contra `.env.example`, y agrega
  al final del archivo cualquier clave faltante con su valor default —
  sin pisar ni reordenar lo que el usuario ya tiene configurado.
- Es idempotente: correrlo dos veces seguidas no debe duplicar claves ni
  cambiar valores ya presentes.

### 3. `scripts/start.ps1`

Equivalente de `start.sh`, punto de entrada único:

1. Resuelve la raíz del repo relativa a la ubicación del script y hace
   `cd` ahí (igual que `start.sh`).
2. Verifica si el daemon de Docker responde (`docker info`). Si no:
   - Intenta lanzar Docker Desktop (`Docker Desktop.exe` en la ruta de
     instalación estándar, `$env:ProgramFiles\Docker\Docker\`).
   - Espera en un loop con timeout (p. ej. 120s, sondeando cada 3s) a que
     `docker info` responda, mostrando progreso.
   - Si se agota el timeout, corta con mensaje de error claro y exit code
     distinto de 0.
3. Corre `scripts/sync-env.ps1`. A diferencia de `start.sh` (que sincroniza
   *después* de levantar los contenedores porque las URLs de túnel solo
   existen una vez que los contenedores loguean su salida), acá la
   sincronización va **antes** de `docker compose up`, porque Compose lee
   `.env` al momento de levantar los servicios.
4. Ejecuta `docker compose up -d --build`.
5. Espera los healthchecks ya definidos en `docker-compose.yml` para
   `backend` y `frontend` (poll de `docker inspect --format
   '{{.State.Health.Status}}'` con timeout, similar a `verify_url` en
   `sync-tunnels.sh` pero contra el estado de salud de Docker en vez de
   HTTP).
6. Imprime un resumen final con las URLs locales
   (`http://localhost:<FRONTEND_PORT>`) leyendo `FRONTEND_PORT` desde
   `.env` (con default 8080 si no está seteado).

Manejo de errores: `$ErrorActionPreference = "Stop"` con try/catch en los
pasos críticos, mensajes en español, exit code no-cero en cualquier
fallo para que sea usable desde otra automatización si hiciera falta.

### 4. `scripts/start.bat`

Wrapper de una línea:

```bat
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
```

Permite doble clic sin que el usuario tenga que cambiar la política de
ejecución de PowerShell de su sistema.

## Fuera de alcance

- Tareas programadas / arranque automático con Windows (confirmado que no
  se necesita).
- Sincronización de túneles Cloudflare (no aplica a este proyecto).
- Script de `stop`/`down` — no fue pedido; se puede agregar después si
  hace falta.

## Testing

- Ejecutar `scripts/start.ps1` en una máquina Windows 11 con Docker
  Desktop instalado, con y sin `.env` preexistente, y verificar:
  - Se crea `.env` correctamente la primera vez.
  - Correr `sync-env.ps1` dos veces no duplica ni reordena claves.
  - El script espera a Docker Desktop si está apagado.
  - Al final se ven los healthchecks en verde y la URL correcta.
- Validar sintaxis de PowerShell con `powershell -NoProfile -Command
  "Get-Content <script> | Out-Null"` o similar análisis estático, dado que
  no hay entorno Windows real disponible en este sandbox Linux/WSL para
  correr Docker Desktop.
