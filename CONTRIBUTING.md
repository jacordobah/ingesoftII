# Guía de Contribución - UIFCE Support System

## 📋 Estructura del Proyecto

```
ingesoftII/
├── uifce-support-system/          # Proyecto principal
│   ├── src/                      # Backend Spring Boot
│   │   └── main/java/uifce/support/api/
│   ├── frontend/                 # Frontend React + TypeScript
│   ├── pom.xml                   # Configuración Maven
│   └── docker-compose.yml        # Configuración Docker
├── .gitignore                    # Archivos ignorados por Git
└── CONTRIBUTING.md              # Este archivo
```

## 🌿 Mejores Prácticas de Git

### Flujo de Trabajo

1. **Mantener `main` siempre estable**: La rama `main` debe estar siempre en estado funcional y listo para producción.

2. **Usar ramas de features**: Para cada nueva funcionalidad o corrección de bug, crear una rama desde `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nombre-funcionalidad
   ```

3. **Commits atómicos**: Cada commit debe representar un cambio lógico completo:
   - ✅ Buen commit: "feat: agregar endpoint de autenticación"
   - ❌ Mal commit: "arreglar cosas"

4. **Mensajes de commit convencionales**: Usar el formato Conventional Commits:
   ```
   feat: nueva funcionalidad
   fix: corrección de bug
   docs: cambios en documentación
   style: formato de código (sin lógica)
   refactor: refactorización de código
   test: agregar o modificar tests
   chore: cambios en build/configuración
   ```

### Ramas

**Ramas principales:**
- `main`: Rama de producción estable

**Ramas de features:**
- `feature/nombre-funcionalidad`: Nuevas funcionalidades
- `fix/nombre-correccion`: Correcciones de bugs
- `hotfix/nombre-correccion`: Correcciones urgentes en producción

**Ejemplo de creación de rama:**
```bash
git checkout -b feature/agregar-auditoria
```

### Pull Requests

1. **Antes de crear PR:**
   - Actualizar tu rama con los últimos cambios de `main`
   - Resolver conflictos si existen
   - Asegurarse que el código compile y pase tests

2. **Título de PR:** Seguir el formato de commits convencionales
   ```
   feat: agregar sistema de auditoría
   ```

3. **Descripción de PR:** Incluir:
   - Descripción de los cambios
   - Cómo probar los cambios
   - Capturas de pantalla si aplica
   - Referencias a issues relacionados

### Code Review

- **Revisar código antes de aprobar**: Verificar:
  - Funcionalidad correcta
  - Estilo de código consistente
  - Sin bugs obvios
  - Tests adecuados

- **Comentarios constructivos**: Ser específico y respetuoso

## 🔧 Comandos Útiles

### Estado del repositorio
```bash
git status                    # Ver estado de archivos
git branch -a                 # Ver todas las ramas
git log --oneline -10         # Ver últimos 10 commits
```

### Trabajo con ramas
```bash
git checkout -b nueva-rama    # Crear y cambiar a nueva rama
git branch -d rama-local      # Eliminar rama local
git push origin --delete rama-remota  # Eliminar rama remota
```

### Sincronización
```bash
git fetch origin              # Obtener cambios remotos
git pull origin main          # Actualizar rama local
git push origin feature-rama  # Subir rama a remoto
```

### Resolución de conflictos
```bash
git status                    # Ver archivos en conflicto
# Editar archivos en conflicto
git add archivo-en-conflicto  # Marcar como resuelto
git commit                    # Completar merge
```

## 📝 Convenciones de Nomenclatura

### Archivos
- **Java:** PascalCase (ej: `UserService.java`)
- **TypeScript/React:** PascalCase para componentes, camelCase para funciones (ej: `UserService.ts`, `getUserData()`)
- **SQL:** snake_case (ej: `user_profiles`)

### Variables
- **Java:** camelCase (ej: `userName`, `isActive`)
- **TypeScript:** camelCase (ej: `userName`, `isActive`)
- **Constantes:** UPPER_SNAKE_CASE (ej: `API_BASE_URL`)

### Rutas de API
- **REST:** kebab-case (ej: `/api/v1/user-profiles`)
- **Parámetros de query:** snake_case (ej: `?user_name=john`)

## 🚀 Proceso de Despliegue

### Desarrollo
1. Crear rama de feature
2. Implementar cambios
3. Hacer commits atómicos
4. Crear Pull Request
5. Esperar code review
6. Hacer cambios solicitados
7. Aprobar y merge a `main`

### Producción
1. `main` se despliega automáticamente
2. Verificar en ambiente de producción
3. Monitorear logs y errores

## 🐛 Reporte de Bugs

### Formato de Issue
```
**Título:** [Tipo] Descripción breve

**Descripción:**
Descripción detallada del problema

**Pasos para reproducir:**
1. Paso 1
2. Paso 2
3. Paso 3

**Comportamiento esperado:**
Lo que debería pasar

**Comportamiento actual:**
Lo que realmente pasa

**Entorno:**
- OS: [ej: Windows 11]
- Navegador: [ej: Chrome 120]
- Versión: [ej: v1.0.0]

**Capturas:**
Adjuntar capturas si aplica
```

## ✅ Checklist antes de Commit

- [ ] Código compila sin errores
- [ ] Tests pasan exitosamente
- [ ] No hay console.log o código de debug
- [ ] Mensaje de commit sigue convenciones
- [ ] Cambios relevantes están documentados
- [ ] No hay archivos innecesarios en el commit
- [ ] .gitignore está actualizado

## 📚 Recursos Adicionales

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Spring Boot Best Practices](https://spring.io/guides)
- [React Best Practices](https://react.dev/learn)

## 🤝 Contacto

Para preguntas sobre contribuciones, contactar al equipo de desarrollo o abrir un issue en el repositorio.
