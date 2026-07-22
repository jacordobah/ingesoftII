# Genera o completa el .env de la raiz del repo a partir de scripts/.env.example.
# Debe correr ANTES de `docker compose up`, porque Compose lee .env al levantar
# los servicios (a diferencia del start.sh de referencia, que sincroniza
# despues, porque ahi se esperaban URLs de tunel que solo existen una vez
# que los contenedores ya estan arriba).
$ErrorActionPreference = "Stop"

$ScriptDir = $PSScriptRoot
$RepoRoot = Split-Path -Parent $ScriptDir
$EnvFile = Join-Path $RepoRoot ".env"
$EnvExample = Join-Path $ScriptDir ".env.example"

function Get-EnvKeys {
    param([string]$Path)
    $envKeys = @{}
    if (-not (Test-Path $Path)) {
        return $envKeys
    }
    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "" -or $trimmed.StartsWith("#")) {
            continue
        }
        $idx = $trimmed.IndexOf("=")
        if ($idx -lt 1) {
            continue
        }
        $key = $trimmed.Substring(0, $idx)
        $value = $trimmed.Substring($idx + 1)
        $envKeys[$key] = $value
    }
    return $envKeys
}

if (-not (Test-Path $EnvFile)) {
    Copy-Item $EnvExample $EnvFile
    Write-Host "==> .env no existia, se creo desde scripts/.env.example"
    Write-Host "    Revisa $EnvFile y ajusta contrasenas/puertos si hace falta."
    exit 0
}

$existingKeys = Get-EnvKeys -Path $EnvFile
$templateKeys = Get-EnvKeys -Path $EnvExample

$missing = @()
foreach ($key in $templateKeys.Keys) {
    if (-not $existingKeys.ContainsKey($key)) {
        $missing += $key
    }
}

if ($missing.Count -eq 0) {
    Write-Host "==> .env ya tiene todas las variables esperadas, nada que agregar."
    exit 0
}

Write-Host ("==> Agregando variables faltantes a .env: " + ($missing -join ", "))
Add-Content -Path $EnvFile -Value ""
Add-Content -Path $EnvFile -Value "# Agregado automaticamente por sync-env.ps1"
foreach ($key in $missing) {
    Add-Content -Path $EnvFile -Value ($key + "=" + $templateKeys[$key])
}
