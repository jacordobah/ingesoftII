# Workshop-1 — Análisis del Proyecto

**Asignatura:** Ingeniería de Software II  
**Docente:** Liliana Marcela Olarte Mesa  
**Institución:** Universidad Nacional de Colombia — Sede Bogotá, Facultad de Ingeniería  
**Semestre:** 2026-01

**Integrantes:**
- Nicole Ariadna Celemin Triana
- Diego Fernando Quintero Gomez
- Nicolas Fernando Davila Penuela
- Jose Alberto Cordoba Higuera
- Rene Alejandro Barrero Gonzalez
- Pablo Andres Bueno Lopez

---

## Descripción del Proyecto

Sistema de gestión de tickets de soporte técnico para la Facultad de Ciencias Económicas de la Universidad Nacional de Colombia. Permite a los usuarios registrar incidentes de IT, a los técnicos gestionarlos y a los administradores supervisar el desempeño del equipo mediante métricas y configuraciones.

---

## Contenido del Repositorio

```
Workshop-1/
├── README.md
└── Entrega 2 Analisis del proyecto grupo 8.pdf
```

---

## Secciones del Documento

### 1. [Documentación de Requisitos](#1-documentación-de-requisitos)

Descripción detallada de los requisitos del sistema, divididos en:

- **Requisitos Funcionales (RF-01 a RF-08):** Registro de tickets, supervisión, autenticación OAuth, priorización automática, notificaciones, envío de correos, exportación de estadísticas e historial de tickets.
- **Requisitos No Funcionales (RNF-01 a RNF-09):** Rendimiento, disponibilidad (99% en horario laboral), seguridad, usabilidad, escalabilidad, mantenibilidad, compatibilidad, portabilidad y trazabilidad.

---

### 2. [Historias de Usuario](#2-historias-de-usuario)

Definición de las historias de usuario organizadas por rol:

- **HU - Usuario:** HU01 (Reservar Ticket), HU02 (Correo de Confirmación)
- **HU - Técnico de Soporte:** HU03 (Visualización de Tickets), HU04 (Asignación), HU05 (Actualizar Estado), HU06 (Historial de Soluciones)
- **HU - Administrador:** HU07 (Métricas de Eficiencia), HU08 (Priorización Automática), HU09 (Configuración de Categorías), HU10 (Reasignación de Tickets)

---

### 3. [Mapa de Historias de Usuario](#3-mapa-de-historias-de-usuario)

Organización de las historias en tres sprints:

| Sprint | Semanas | Historias de Usuario |
|--------|---------|----------------------|
| Sprint 1 — MVP | 1–4 | HU01, HU03, HU04, HU05, HU07, HU08 |
| Sprint 2 — Funcionalidades Intermedias | 5–6 | HU02, HU09, HU10 |
| Sprint 3 — Mejoras y Reportes | 7–8 | HU06 |

---

### 4. [Anexos: Tabla de Puntajes](#4-anexos-tabla-de-puntajes)

Tablas utilizadas para la priorización automática de tickets, basadas en:

- **Árbol de Servicios:** Categorías y subcategorías de incidentes (conceptos técnicos, impresoras, PCs, software, telefonía, servidores, entre otros) con puntajes asignados.
- **Lista de Ubicaciones:** Edificios 311, 310 y 238, con puntajes por oficina o sala.
- **Cantidad de Equipos:** Rangos de 1 a más de 30 equipos con puntajes correspondientes.
- **Tiempos de Respuesta:** Desde 24 horas hasta "durante el semestre académico", cada uno con su puntaje para calcular la prioridad del ticket.

---

### 5. [Referencias](#5-referencias)

Bibliografía consultada para el desarrollo del análisis:

- Cohn, M. (2004). *User stories applied.* Addison-Wesley.
- Patton, J. (2014). *User story mapping.* O'Reilly Media.
- Schwaber, K. & Sutherland, J. (2020). *The Scrum Guide.* Scrum.org.
- Meta Platforms. (2024). *React.* https://react.dev
- VMware Tanzu. (2024). *Spring Boot Reference Documentation.* https://spring.io

---

## Tecnologías Previstas

| Capa | Tecnología |
|------|-----------|
| Frontend | React |
| Backend | Spring Boot |
| Autenticación | OAuth con correo institucional UNAL |
| Compatibilidad | Chrome, Firefox, Edge (últimas 2 versiones) |
