param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$MysqlUser = "root",
    [string]$MysqlPassword = "root",
    [string]$MysqlDatabase = "uifce_support"
)

$ErrorActionPreference = "Stop"
$script:Passed = 0
$script:Tag = "smoke_$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
$script:AdminEmail = "uniic_bog@unal.edu.co"
$script:Password = "Admin123!"
$script:TechnicianEmail = "$($script:Tag)_tech@unal.edu.co"
$script:UserEmail = "$($script:Tag)_user@unal.edu.co"
$script:CategoryId = $null
$script:BuildingId = $null

function Invoke-Api {
    param(
        [Microsoft.PowerShell.Commands.WebRequestSession]$Session,
        [string]$Method,
        [string]$Path,
        $Body,
        [int[]]$Expected = @(200)
    )

    $headers = @{}
    if ($Method -notin @("GET", "HEAD", "OPTIONS")) {
        $csrf = Invoke-RestMethod -Uri "$BaseUrl/api/auth/csrf" -WebSession $Session
        $headers["X-XSRF-TOKEN"] = $csrf.token
    }

    try {
        $request = @{
            Uri         = "$BaseUrl$Path"
            Method      = $Method
            WebSession  = $Session
            Headers     = $headers
            ContentType = "application/json"
        }
        if ($null -ne $Body) {
            $request.Body = $Body | ConvertTo-Json -Depth 8 -Compress
        }
        $response = Invoke-WebRequest @request -UseBasicParsing
        $status = [int]$response.StatusCode
        $content = $response.Content
    } catch {
        if ($null -eq $_.Exception.Response) { throw }
        $status = [int]$_.Exception.Response.StatusCode
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
    }

    if ($status -notin $Expected) {
        throw "$Method $Path devolvió HTTP $status; se esperaba $($Expected -join '/'). Respuesta: $content"
    }

    $script:Passed++
    Write-Host "[OK] $Method $Path -> $status"
    return [pscustomobject]@{
        Status = $status
        Json   = if ($content) { $content | ConvertFrom-Json } else { $null }
    }
}

function New-AuthenticatedSession {
    param([string]$Email)
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $login = Invoke-Api -Session $session -Method POST -Path "/api/auth/login" -Body @{
        email = $Email
        password = $script:Password
    }
    if ($login.Json.user.email -ne $Email) {
        throw "La sesión autenticada no corresponde a $Email"
    }
    return $session
}

function Assert-SpaRoute {
    param([string]$Path)
    $response = Invoke-WebRequest -Uri "$BaseUrl$Path" -UseBasicParsing
    if ($response.StatusCode -ne 200 -or $response.Content -notmatch '<div id="root"') {
        throw "La ruta SPA $Path no devolvio la aplicacion"
    }
    $script:Passed++
    Write-Host "[OK] SPA $Path -> 200"
    return $response
}

function Invoke-Mysql {
    param([string]$Sql)
    $passwordArgument = "-p$MysqlPassword"
    & docker exec uifce-mysql mysql "-u$MysqlUser" $passwordArgument -D $MysqlDatabase -e $Sql
    if ($LASTEXITCODE -ne 0) { throw "Falló la preparación/limpieza de MySQL" }
}

try {
    Write-Host "== UIFCE smoke test: $($script:Tag) =="

    $index = Assert-SpaRoute "/login"
    foreach ($route in @(
        "/auth/callback",
        "/usuario/nuevo",
        "/usuario/confirmacion",
        "/usuario/historial",
        "/tecnico/cola",
        "/tecnico/asignaciones",
        "/admin/dashboard",
        "/admin/cola",
        "/admin/auditoria",
        "/admin/categorias",
        "/admin/ubicaciones",
        "/admin/usuarios"
    )) {
        Assert-SpaRoute $route | Out-Null
    }
    $mainScript = [regex]::Match($index.Content, 'src="([^"]+\.js)"').Groups[1].Value
    if (!$mainScript) { throw "index.html no referencia el bundle JavaScript" }
    $asset = Invoke-WebRequest -Uri "$BaseUrl$mainScript" -UseBasicParsing
    if ($asset.StatusCode -ne 200 -or $asset.Headers["Content-Type"] -notmatch "javascript") {
        throw "El bundle JavaScript principal no esta disponible"
    }
    $script:Passed++
    Write-Host "[OK] ASSET $mainScript -> 200"

    $anonymous = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    Invoke-Api -Session $anonymous -Method GET -Path "/api/v1/categoria" -Body $null -Expected @(401) | Out-Null
    Invoke-Api -Session $anonymous -Method POST -Path "/api/auth/login" -Body @{
        email = $script:AdminEmail
        password = "incorrecta"
    } -Expected @(400) | Out-Null

    $admin = New-AuthenticatedSession -Email $script:AdminEmail
    $me = Invoke-Api -Session $admin -Method GET -Path "/api/v1/usuarios/me" -Body $null
    if ($me.Json.rol -ne "Administrador") { throw "El usuario admin no tiene el rol esperado" }

    $officialCategoryNames = @(
        "Conceptos técnicos",
        "Impresoras",
        "PC y portátiles",
        "Software",
        "Telefonía",
        "Video, proyectores o pantallas",
        "Servidores"
    )
    $officialCategories = Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria" -Body $null
    $officialSubcategoryCount = 0
    foreach ($categoryName in $officialCategoryNames) {
        $category = @($officialCategories.Json) | Where-Object { $_.nombre -eq $categoryName }
        if (!$category) { throw "Falta la categoría oficial: $categoryName" }
        $subcategories = Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria/$($category.id)/subcategorias" -Body $null
        $officialSubcategoryCount += @($subcategories.Json).Count
    }
    if ($officialSubcategoryCount -lt 29) { throw "Faltan subcategorías oficiales" }

    $officialBuildings = Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios" -Body $null
    $officialOfficeCount = 0
    foreach ($buildingNumber in @(311, 310, 238)) {
        $building = @($officialBuildings.Json) | Where-Object { $_.numero -eq $buildingNumber }
        if (!$building) { throw "Falta el edificio oficial: $buildingNumber" }
        $offices = Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios/$($building.id)/oficinas" -Body $null
        $officialOfficeCount += @($offices.Json).Count
    }
    if ($officialOfficeCount -lt 33) { throw "Faltan ubicaciones oficiales" }

    Invoke-Api -Session $admin -Method POST -Path "/api/v1/usuarios" -Body @{
        nombre = ""
        email = ""
        rol = "Tecnico"
    } -Expected @(400) | Out-Null

    $technician = Invoke-Api -Session $admin -Method POST -Path "/api/v1/usuarios" -Body @{
        nombre = "$($script:Tag) tech"
        email = $script:TechnicianEmail
        rol = "Tecnico"
    } -Expected @(201)
    $technicianId = [long]$technician.Json.id

    Invoke-Api -Session $admin -Method POST -Path "/api/v1/usuarios" -Body @{
        nombre = "$($script:Tag) duplicado"
        email = $script:TechnicianEmail
        rol = "Tecnico"
    } -Expected @(409) | Out-Null
    Invoke-Api -Session $admin -Method PATCH -Path "/api/v1/usuarios/$technicianId/rol?rol=Administrador" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method PATCH -Path "/api/v1/usuarios/$technicianId/rol?rol=Tecnico" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method PATCH -Path "/api/v1/usuarios/$($me.Json.id)/rol?rol=Tecnico" -Body $null -Expected @(400) | Out-Null

    $user = Invoke-Api -Session $admin -Method POST -Path "/api/v1/usuarios" -Body @{
        nombre = "$($script:Tag) user"
        email = $script:UserEmail
        rol = "Usuario"
    } -Expected @(201)
    $registeredUsers = Invoke-Api -Session $admin -Method GET -Path "/api/v1/usuarios/usuarios_registrados?size=100" -Body $null
    $registeredUser = @($registeredUsers.Json.content) | Where-Object { $_.id -eq $user.Json.id }
    if (!$registeredUser -or $registeredUser.rol -ne "Usuario") {
        throw "El usuario registrado no aparece en la vista administrativa"
    }

    $hash = '$2a$10$yzAJ0Z1U.lIcTJmzIm4PAOsbnTRLqPLw2iI7B8nn/4C3Q8LiqEpK2'
    Invoke-Mysql "UPDATE usuarios SET password='$hash' WHERE email IN ('$($script:TechnicianEmail)','$($script:UserEmail)');"

    $techSession = New-AuthenticatedSession -Email $script:TechnicianEmail
    $userSession = New-AuthenticatedSession -Email $script:UserEmail
    Invoke-Api -Session $userSession -Method GET -Path "/api/v1/usuarios" -Body $null -Expected @(403) | Out-Null
    Invoke-Api -Session $techSession -Method GET -Path "/api/v1/usuarios" -Body $null | Out-Null
    Invoke-Api -Session $techSession -Method GET -Path "/api/v1/usuarios/usuarios_registrados" -Body $null | Out-Null
    Invoke-Api -Session $techSession -Method PATCH -Path "/api/v1/usuarios/$technicianId/rol?rol=Administrador" -Body $null -Expected @(403) | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/usuarios/$technicianId" -Body $null | Out-Null

    $category = Invoke-Api -Session $admin -Method POST -Path "/api/v1/categoria" -Body @{
        nombre = "$($script:Tag) categoria"
        descripcion = "Prueba automática"
    } -Expected @(201)
    $script:CategoryId = [long]$category.Json.id

    $subcategory = Invoke-Api -Session $admin -Method POST -Path "/api/v1/categoria/$($script:CategoryId)/subcategoria" -Body @{
        nombre = "$($script:Tag) subcategoria"
        puntaje = 10
    } -Expected @(201)
    $subcategoryId = [long]$subcategory.Json.id

    Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria/$($script:CategoryId)" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria/$($script:CategoryId)/subcategorias" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/categoria/subcategoria/$subcategoryId" -Body $null | Out-Null
    Invoke-Api -Session $userSession -Method GET -Path "/api/v1/categoria" -Body $null | Out-Null
    Invoke-Api -Session $userSession -Method GET -Path "/api/v1/categoria/$($script:CategoryId)/subcategorias" -Body $null | Out-Null
    Invoke-Api -Session $techSession -Method POST -Path "/api/v1/categoria" -Body @{
        nombre = "$($script:Tag) prohibida"
        descripcion = "No debe crearse"
    } -Expected @(403) | Out-Null
    $updatedCategory = Invoke-Api -Session $admin -Method PUT -Path "/api/v1/categoria" -Body @{
        id = $script:CategoryId
        nombre = "$($script:Tag) categoria editada"
        descripcion = "Prueba automática editada"
    }
    if ($updatedCategory.Json.descripcion -notmatch "editada") { throw "La descripcion de la categoria no se actualizo" }
    Invoke-Api -Session $admin -Method PUT -Path "/api/v1/categoria/subcategoria" -Body @{
        id = $subcategoryId
        nombre = "$($script:Tag) subcategoria editada"
        puntaje = 11
    } | Out-Null

    Invoke-Api -Session $admin -Method POST -Path "/api/v1/edificios" -Body @{
        numero = 0
        nombre = "$($script:Tag) edificio invalido"
    } -Expected @(400) | Out-Null

    $building = Invoke-Api -Session $admin -Method POST -Path "/api/v1/edificios" -Body @{
        numero = [int]([DateTimeOffset]::UtcNow.ToUnixTimeSeconds() % 1000000)
        nombre = "$($script:Tag) edificio"
    } -Expected @(201)
    $script:BuildingId = [long]$building.Json.id

    $office = Invoke-Api -Session $admin -Method POST -Path "/api/v1/edificios/$($script:BuildingId)/oficinas" -Body @{
        nombre = "$($script:Tag) oficina"
        puntaje = 10
    } -Expected @(201)
    $officeId = [long]$office.Json.id

    Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios/$($script:BuildingId)" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios/$($script:BuildingId)/oficinas" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/edificios/oficinas/$officeId" -Body $null | Out-Null
    Invoke-Api -Session $userSession -Method GET -Path "/api/v1/edificios" -Body $null | Out-Null
    Invoke-Api -Session $userSession -Method GET -Path "/api/v1/edificios/$($script:BuildingId)/oficinas" -Body $null | Out-Null
    $updatedBuildingNumber = [int]$building.Json.numero + 1
    $updatedBuilding = Invoke-Api -Session $admin -Method PUT -Path "/api/v1/edificios" -Body @{
        id = $script:BuildingId
        numero = $updatedBuildingNumber
        nombre = "$($script:Tag) edificio editado"
    }
    if ([int]$updatedBuilding.Json.numero -ne $updatedBuildingNumber) { throw "El numero del edificio no se actualizo" }
    Invoke-Api -Session $admin -Method PUT -Path "/api/v1/edificios/oficinas" -Body @{
        id = $officeId
        nombre = "$($script:Tag) oficina editada"
        puntaje = 12
    } | Out-Null

    $ticket = Invoke-Api -Session $userSession -Method POST -Path "/api/v1/tickets" -Body @{
        subcategoriaId = $subcategoryId
        oficinaId = $officeId
        descripcion = "$($script:Tag) ticket"
        cantidadEquipos = 2
    } -Expected @(201)
    $ticketId = [string]$ticket.Json.id

    $ownTickets = Invoke-Api -Session $userSession -Method GET -Path "/api/v1/tickets" -Body $null
    if ($ticketId -notin @($ownTickets.Json.content.id)) { throw "El usuario no ve su ticket" }
    Invoke-Api -Session $techSession -Method GET -Path "/api/v1/tickets" -Body $null | Out-Null
    Invoke-Api -Session $techSession -Method PATCH -Path "/api/v1/tickets/asignar-tecnico" -Body @{
        ticketId = $ticketId
        tecnicoID = $technicianId
    } -Expected @(403) | Out-Null
    Invoke-Api -Session $admin -Method PATCH -Path "/api/v1/tickets/asignar-tecnico" -Body @{
        ticketId = $ticketId
        tecnicoID = $technicianId
    } | Out-Null
    Invoke-Api -Session $techSession -Method PATCH -Path "/api/v1/tickets/cambiar-estado" -Body @{
        id = $ticketId
        tecnicoId = $technicianId
        estado = "En_proceso"
        comentario = ""
    } | Out-Null
    Invoke-Api -Session $techSession -Method PATCH -Path "/api/v1/tickets/cambiar-estado" -Body @{
        id = $ticketId
        tecnicoId = $technicianId
        estado = "Cerrado"
        comentario = "Cierre de prueba"
    } | Out-Null

    Invoke-Api -Session $techSession -Method GET -Path "/api/v1/auditoria" -Body $null -Expected @(403) | Out-Null
    $audit = Invoke-Api -Session $admin -Method GET -Path "/api/v1/auditoria?size=100" -Body $null
    if ($ticketId -notin @($audit.Json.content.ticketId)) { throw "La auditoria no contiene el ticket de prueba" }
    Invoke-Api -Session $admin -Method GET -Path "/api/v1/auditoria/ticket/$ticketId" -Body $null | Out-Null

    Invoke-Api -Session $admin -Method DELETE -Path "/api/v1/usuarios/$technicianId" -Body $null -Expected @(204) | Out-Null
    $activeUsers = Invoke-Api -Session $admin -Method GET -Path "/api/v1/usuarios?size=100" -Body $null
    if ($technicianId -in @($activeUsers.Json.content.id)) { throw "El usuario desactivado sigue apareciendo como activo" }
    $disabledSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    Invoke-Api -Session $disabledSession -Method POST -Path "/api/auth/login" -Body @{
        email = $script:TechnicianEmail
        password = $script:Password
    } -Expected @(403) | Out-Null
    Invoke-Api -Session $admin -Method DELETE -Path "/api/v1/categoria/subcategoria/$subcategoryId" -Body $null -Expected @(204) | Out-Null
    Invoke-Api -Session $admin -Method DELETE -Path "/api/v1/categoria/$($script:CategoryId)" -Body $null -Expected @(204) | Out-Null
    Invoke-Api -Session $admin -Method DELETE -Path "/api/v1/edificios/oficinas/$officeId" -Body $null -Expected @(204) | Out-Null
    Invoke-Api -Session $admin -Method PATCH -Path "/api/v1/edificios/oficinas/$officeId" -Body $null | Out-Null
    Invoke-Api -Session $admin -Method DELETE -Path "/api/v1/edificios/$($script:BuildingId)" -Body $null -Expected @(204) | Out-Null

    Write-Host "RESULTADO: $($script:Passed) comprobaciones superadas."
} finally {
    $cleanup = @"
DELETE FROM usuarios WHERE email IN ('$($script:TechnicianEmail)','$($script:UserEmail)');
DELETE FROM categorias WHERE nombre LIKE '$($script:Tag)%';
DELETE FROM edificios WHERE nombre LIKE '$($script:Tag)%';
"@
    try {
        Invoke-Mysql $cleanup
        Write-Host "Datos temporales eliminados."
    } catch {
        Write-Warning "No se pudo completar la limpieza automática: $($_.Exception.Message)"
    }
}
