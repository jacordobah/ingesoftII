# Punto de entrada unico para levantar el stack completo en Windows 11:
# 1) asegura que Docker Desktop este corriendo, 2) sincroniza el .env,
# 3) docker compose up --build, 4) espera healthchecks y muestra la URL.
$ErrorActionPreference = "Stop"

$ScriptDir = $PSScriptRoot
$RepoRoot = Split-Path -Parent $ScriptDir
Set-Location $RepoRoot

function Test-DockerReady {
    docker info *> $null
    return ($LASTEXITCODE -eq 0)
}

function Wait-DockerReady {
    param([int]$TimeoutSec = 120, [int]$IntervalSec = 3)
    $waited = 0
    while ($waited -lt $TimeoutSec) {
        if (Test-DockerReady) {
            return $true
        }
        Start-Sleep -Seconds $IntervalSec
        $waited += $IntervalSec
        Write-Host ("    ...esperando a Docker (" + $waited + "s)")
    }
    return $false
}

function Wait-ContainerHealthy {
    param([string]$ContainerName, [int]$TimeoutSec = 90, [int]$IntervalSec = 3)
    $waited = 0
    while ($waited -lt $TimeoutSec) {
        $status = docker inspect --format="{{.State.Health.Status}}" $ContainerName 2>$null
        if ($status -eq "healthy") {
            return $true
        }
        Start-Sleep -Seconds $IntervalSec
        $waited += $IntervalSec
    }
    return $false
}

Write-Host "==> Verificando Docker Desktop..."
if (-not (Test-DockerReady)) {
    $dockerDesktopPath = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktopPath) {
        Write-Host "==> Docker Desktop no esta corriendo, iniciandolo..."
        Start-Process -FilePath $dockerDesktopPath
    } else {
        Write-Warning ("No se encontro Docker Desktop en '" + $dockerDesktopPath + "'. Iniciala manualmente.")
    }
    Write-Host "==> Esperando a que el daemon de Docker responda..."
    if (-not (Wait-DockerReady -TimeoutSec 120 -IntervalSec 3)) {
        Write-Error "Docker no respondio despues de 120s. Abri Docker Desktop manualmente y volve a correr este script."
        exit 1
    }
}
Write-Host "==> Docker listo."

Write-Host "==> Sincronizando .env..."
& (Join-Path $ScriptDir "sync-env.ps1")

Write-Host "==> docker compose up -d --build"
docker compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Error ("docker compose up fallo (exit code " + $LASTEXITCODE + ").")
    exit 1
}

Write-Host "==> Esperando healthcheck de backend..."
if (-not (Wait-ContainerHealthy -ContainerName "uifce-backend" -TimeoutSec 90)) {
    Write-Warning "backend no reporto 'healthy' en 90s, revisa 'docker compose logs backend'."
}

Write-Host "==> Esperando healthcheck de frontend..."
if (-not (Wait-ContainerHealthy -ContainerName "uifce-frontend" -TimeoutSec 60)) {
    Write-Warning "frontend no reporto 'healthy' en 60s, revisa 'docker compose logs frontend'."
}

$envFile = Join-Path $RepoRoot ".env"
$frontendPort = "8080"
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line.Trim() -match '^FRONTEND_PORT=(.+)$') {
            $frontendPort = $Matches[1].Trim()
        }
    }
}

Write-Host ""
Write-Host ("==> Listo. Frontend: http://localhost:" + $frontendPort)
