# Sistema de Diseño Atómico (Atomic Design) - Versión Técnica

Este proyecto implementa el **Diseño Atómico** de Brad Frost con componentes técnicos avanzados, variantes, sistema de temas y validación de tipos.

## 🧬 Jerarquía de Componentes

```
Átomos → Moléculas → Organismos → Plantillas → Páginas
```

## 🔬 Átomos Técnicos

Los átomos son los componentes más básicos e indivisibles de la interfaz.

### Átomos de UI Básicos

| Componente | Descripción | Props Principales |
|------------|-------------|-------------------|
| `PrimaryButton` | Botón primario institucional | children, onClick, variant |
| `SecondaryButton` | Botón secundario | children, onClick, variant |
| `ErrorButton` | Botón de error | children, onClick, variant |
| `StatusChip` | Chip de estado de ticket | status: 'abierto' \| 'en_proceso' \| 'cerrado' |
| `PriorityChip` | Chip de prioridad | priority: 'critica' \| 'media' \| 'baja' |

### Átomos de Formularios

| Componente | Descripción | Props Principales |
|------------|-------------|-------------------|
| `FormInput` | Input con variantes y validación | label, value, onChange, variant, size, error, helperText |
| `FormSelect` | Select con opciones y validación | label, value, options, onChange, error, helperText |

**Variantes de FormInput:** `standard`, `outlined`, `filled`
**Tamaños de FormInput:** `small`, `medium`

### Átomos de Feedback

| Componente | Descripción | Props Principales |
|------------|-------------|-------------------|
| `LoadingSpinner` | Spinner de carga | size, variant, message, fullScreen, value |
| `SkeletonLoader` | Skeleton placeholder | variant, animation, count, width, height |
| `ToastNotification` | Notificación toast | severity, variant, title, message, onClose |

**Variantes de LoadingSpinner:** `indeterminate`, `determinate`
**Tamaños de LoadingSpinner:** `small` (24px), `medium` (40px), `large` (60px)
**Variantes de SkeletonLoader:** `text`, `rectangular`, `circular`
**Animaciones de SkeletonLoader:** `pulse`, `wave`
**Severidades de ToastNotification:** `success`, `info`, `warning`, `error`
**Variantes de ToastNotification:** `filled`, `outlined`, `standard`

### Átomos de Navegación

| Componente | Descripción | Props Principales |
|------------|-------------|-------------------|
| `BreadcrumbNav` | Navegación de migas de pan | items: BreadcrumbItem[], separator |
| `TabNavigation` | Navegación por tabs | tabs: TabItem[], value, onChange, variant |

**Variantes de TabNavigation:** `standard`, `scrollable`, `fullWidth`
**Orientaciones de TabNavigation:** `horizontal`, `vertical`

## 🔗 Moléculas Técnicas

| Componente | Descripción | Átomos que contiene |
|------------|-------------|---------------------|
| `FilterBar` | Barra de filtros | Select, PrimaryButton |
| `TicketInfoCard` | Tarjeta de información de ticket | StatusChip, PriorityChip, Card |
| `PageHeader` | Encabezado de página | Typography, Box |
| `FormField` | Campo de formulario unificado | FormInput, FormSelect |
| `FormSection` | Sección de formulario | Paper, Typography, Divider |

## 🧬 Organismos Técnicos

| Componente | Descripción | Moléculas/Átomos que contiene |
|------------|-------------|------------------------------|
| `TicketTable` | Tabla de tickets básica | StatusChip, PriorityChip, Table |
| `TicketCardList` | Lista de tarjetas de tickets | TicketInfoCard |
| `DataTable` | Tabla de datos avanzada | Table, Checkbox, TablePagination |

### DataTable - Organismo Avanzado

**Características:**
- Columnas personalizables con render functions
- Selección de filas (simple y múltiple)
- Paginación integrada
- Generic types para type safety
- Accesibilidad (ARIA labels)

**Props principales:**
- `data: T[]` - Datos a mostrar
- `columns: Column<T>[]` - Definición de columnas
- `selectable?: boolean` - Habilitar selección
- `selectedRows?: Set<string | number>` - Filas seleccionadas
- `pagination?: boolean` - Habilitar paginación
- `rowId?: (row: T, index: number) => string | number` - ID de fila

## 📁 Estructura de Carpetas

```
src/components/
├── atoms/           # 11 componentes atómicos técnicos
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   ├── ErrorButton.tsx
│   ├── StatusChip.tsx
│   ├── PriorityChip.tsx
│   ├── FormInput.tsx
│   ├── FormSelect.tsx
│   ├── LoadingSpinner.tsx
│   ├── SkeletonLoader.tsx
│   ├── ToastNotification.tsx
│   ├── BreadcrumbNav.tsx
│   ├── TabNavigation.tsx
│   └── index.ts
├── molecules/       # 5 componentes moleculares técnicos
│   ├── FilterBar.tsx
│   ├── TicketInfoCard.tsx
│   ├── PageHeader.tsx
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   └── index.ts
├── organisms/       # 3 componentes de organismos técnicos
│   ├── TicketTable.tsx
│   ├── TicketCardList.tsx
│   ├── DataTable.tsx
│   └── index.ts
├── templates/       # 1 plantilla
│   ├── PageLayout.tsx
│   └── index.ts
└── styled/          # Styled components
    └── CommonStyled.tsx
```

## 🎨 Sistema de Temas

### Colores Institucionales
- **Primario:** `#94b43c` (Verde institucional)
- **Secundario:** `#002f6c` (Azul institucional)
- **Error:** `#f44336` (Rojo)
- **Advertencia:** `#ff9800` (Naranja)
- **Éxito:** `#4caf50` (Verde claro)

## 🎯 Principios de Diseño Técnico

1. **TypeScript Estricto** - Todos los componentes tienen tipos definidos
2. **Validación de Props** - Props requeridos y opcionales con defaults
3. **Accesibilidad** - ARIA labels y navegación por teclado
4. **Performance** - Optimizado con useCallback/useMemo
5. **Composición** - Componentes construidos por composición

## 📝 Estado de Implementación

### ✅ Completado
- 11 Átomos técnicos (UI, formularios, feedback, navegación)
- 5 Moléculas técnicas (filtros, formularios, headers)
- 3 Organismos técnicos (tablas básicas y avanzadas)
- 1 Plantilla (PageLayout)
- Sistema de temas y variantes
- TypeScript estricto en todos los componentes

### 🔄 Pendiente
- Hooks personalizados para componentes atómicos
- Validación de props con Zod
- Storybook para documentación visual
- Animaciones y transiciones
- Componentes de gráficos

## 📚 Recursos

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
