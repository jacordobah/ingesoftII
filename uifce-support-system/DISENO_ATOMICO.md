# Sistema de Diseño Atómico (Atomic Design)

Este proyecto implementa el **Diseño Atómico** de Brad Frost para crear una interfaz de usuario escalable, mantenible y consistente.

## 🧬 Jerarquía de Componentes

```
Átomos → Moléculas → Organismos → Plantillas → Páginas
```

## 🔬 Átomos

Los átomos son los componentes más básicos e indivisibles de la interfaz. No pueden descomponerse en componentes más pequeños.

### Átomos Disponibles

| Componente | Descripción | Uso |
|------------|-------------|-----|
| `PrimaryButton` | Botón primario institucional | Acciones principales |
| `SecondaryButton` | Botón secundario | Acciones secundarias |
| `ErrorButton` | Botón de error | Acciones destructivas |
| `StatusChip` | Chip de estado de ticket | Mostrar estado (abierto, en_proceso, cerrado) |
| `PriorityChip` | Chip de prioridad | Mostrar prioridad (crítica, media, baja) |

### Ejemplo de Uso

```tsx
import { PrimaryButton, StatusChip, PriorityChip } from '@/components/atoms';

<PrimaryButton onClick={handleSave}>Guardar</PrimaryButton>
<StatusChip status="abierto" />
<PriorityChip priority="critica" />
```

## 🔗 Moléculas

Las moléculas son grupos de átomos que funcionan juntos como una unidad. Son componentes relativamente simples que combinan átomos.

### Moléculas Disponibles

| Componente | Descripción | Átomos que contiene |
|------------|-------------|---------------------|
| `FilterBar` | Barra de filtros | Select, PrimaryButton |
| `TicketInfoCard` | Tarjeta de información de ticket | StatusChip, PriorityChip, Card |
| `PageHeader` | Encabezado de página | Typography, Box |

### Ejemplo de Uso

```tsx
import { FilterBar, PageHeader } from '@/components/molecules';

<PageHeader title="Cola de Tickets" subtitle="Gestión de tickets" />
<FilterBar
  filters={[
    { label: 'Estado', value: 'abierto', options: [...], onChange: handleChange }
  ]}
  onApply={handleApply}
/>
```

## 🧬 Organismos

Los organismos son componentes complejos compuestos por moléculas y átomos. Son secciones de la interfaz que funcionan de forma independiente.

### Organismos Disponibles

| Componente | Descripción | Moléculas/Átomos que contiene |
|------------|-------------|------------------------------|
| `TicketTable` | Tabla de tickets | StatusChip, PriorityChip, Table |
| `TicketCardList` | Lista de tarjetas de tickets | TicketInfoCard |

### Ejemplo de Uso

```tsx
import { TicketTable, TicketCardList } from '@/components/organisms';

<TicketTable tickets={tickets} onRowClick={handleRowClick} />
<TicketCardList tickets={tickets} onTicketClick={handleClick} />
```

## 📄 Plantillas

Las plantillas son estructuras de página que definen el layout sin contenido específico. Combinan organismos y moléculas.

### Plantillas Disponibles

| Componente | Descripción |
|------------|-------------|
| `PageLayout` | Layout base para páginas con encabezado |

### Ejemplo de Uso

```tsx
import { PageLayout } from '@/components/templates';

<PageLayout title="Cola de Tickets" subtitle="Gestión de tickets">
  <TicketTable tickets={tickets} />
</PageLayout>
```

## 📁 Estructura de Carpetas

```
src/components/
├── atoms/           # Componentes atómicos
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   ├── ErrorButton.tsx
│   ├── StatusChip.tsx
│   ├── PriorityChip.tsx
│   └── index.ts
├── molecules/       # Componentes moleculares
│   ├── FilterBar.tsx
│   ├── TicketInfoCard.tsx
│   ├── PageHeader.tsx
│   └── index.ts
├── organisms/       # Componentes de organismos
│   ├── TicketTable.tsx
│   ├── TicketCardList.tsx
│   └── index.ts
├── templates/       # Plantillas de layout
│   ├── PageLayout.tsx
│   └── index.ts
└── styled/          # Styled components reutilizables
    └── CommonStyled.tsx
```

## 🎨 Principios de Diseño

### 1. **Composición sobre Herencia**
Los componentes se construyen combinando componentes más pequeños en lugar de extenderlos.

### 2. **Reutilización**
Los átomos y moléculas se reutilizan en múltiples contextos, garantizando consistencia.

### 3. **Escalabilidad**
La estructura jerárquica permite agregar nuevos componentes sin afectar los existentes.

### 4. **Mantenibilidad**
Cada componente tiene una responsabilidad única y bien definida.

## 🚀 Beneficios

- **Consistencia Visual**: Los mismos átomos se usan en toda la aplicación
- **Desarrollo Más Rápido**: Reutilización de componentes probados
- **Fácil Mantenimiento**: Cambios en átomos se propagan automáticamente
- **Testing Simplificado**: Componentes pequeños son más fáciles de probar
- **Documentación Clara**: Estructura jerárquica auto-documentada

## 📝 Guía de Creación de Componentes

### Crear un Nuevo Átomo

1. Crear archivo en `src/components/atoms/`
2. El componente debe ser simple e indivisible
3. Agregar documentación JSDoc con ejemplo de uso
4. Exportar desde `index.ts`

### Crear una Nueva Molécula

1. Crear archivo en `src/components/molecules/`
2. Combinar 2+ átomos existentes
3. La molécula debe tener una responsabilidad clara
4. Agregar documentación JSDoc con ejemplo de uso
5. Exportar desde `index.ts`

### Crear un Nuevo Organismo

1. Crear archivo en `src/components/organisms/`
2. Combinar moléculas y átomos
3. El organismo debe ser una sección funcional independiente
4. Agregar documentación JSDoc con ejemplo de uso
5. Exportar desde `index.ts`

## 🔄 Migración de Componentes Existentes

Los componentes existentes se están migrando gradualmente al sistema de diseño atómico:

- ✅ Átomos creados
- ✅ Moléculas creadas
- ✅ Organismos creados
- ✅ Plantillas creadas
- 🔄 Refactorización de componentes existentes (pendiente)
- 🔄 Actualización de imports (pendiente)

## 📚 Recursos

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
