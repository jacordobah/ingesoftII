# Configuración de OAuth2 con Google

Esta guía explica cómo configurar el login con Google OAuth2 para el sistema UIFCE Support System.

## Requisitos Previos

- Cuenta de Google
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)

## Pasos de Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** (lo necesitarás más tarde)

### 2. Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google+ API" y habilítala
3. También habilita "Google Identity"

### 3. Configurar Pantalla de Consentimiento

1. Ve a **APIs & Services** > **OAuth consent screen**
2. Selecciona **External** (para usuarios externos) o **Internal** (solo para tu organización)
3. Completa la información requerida:
   - **Nombre de la aplicación**: UIFCE Support System
   - **Email de soporte**: tu email
   - **Logo**: (opcional)
   - **Dominios autorizados**: Agrega tu dominio si es necesario
4. En **Scopes**, agrega:
   - `email`
   - `profile`
5. En **Test users**, agrega tu email de Google para pruebas
6. Guarda y espera la revisión (para producción)

### 4. Crear Credenciales OAuth2

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ Create Credentials** > **OAuth client ID**
3. Selecciona **Web application**
4. Configura:
   - **Name**: UIFCE Support System Web
   - **Authorized redirect URIs**:
     - Desarrollo: `http://localhost:8080/login/oauth2/code/google`
     - Producción: `https://tu-dominio.com/login/oauth2/code/google`
5. Haz clic en **Create**
6. Copia el **Client ID** y **Client Secret** (no los compartirás)

### 5. Configurar Variables de Entorno

En tu archivo `src/main/resources/application.yaml`, reemplaza los placeholders:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: TU_GOOGLE_CLIENT_ID
            client-secret: TU_GOOGLE_CLIENT_SECRET
```

O usa variables de entorno:

```bash
export GOOGLE_CLIENT_ID=tu-client-id
export GOOGLE_CLIENT_SECRET=tu-client-secret
```

### 6. Probar la Configuración

1. Reinicia el backend Spring Boot
2. Ve a `http://localhost:3000/login`
3. Haz clic en "Continuar con Google"
4. Deberías ser redirigido a Google para autenticarte
5. Después del login, serás redirigido de vuelta a la aplicación

## Solución de Problemas

### Error: "redirect_uri_mismatch"

- Verifica que el URI de redirección coincida exactamente con el configurado en Google Cloud Console
- Asegúrate de incluir el protocolo (http/https) y el puerto

### Error: "access_denied"

- Verifica que tu email esté en la lista de usuarios de prueba
- Asegúrate de que la pantalla de consentimiento esté configurada correctamente

### Error: "invalid_client"

- Verifica que el Client ID y Client Secret sean correctos
- Asegúrate de que las credenciales estén activas

## Seguridad

- **Nunca** compartas tu Client Secret
- Usa variables de entorno para credenciales en producción
- Limita los dominios autorizados en Google Cloud Console
- Revisa regularmente las credenciales y revoca las que no se usen

## Información Adicional

- [Documentación oficial de Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [Spring Security OAuth2 Guide](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
