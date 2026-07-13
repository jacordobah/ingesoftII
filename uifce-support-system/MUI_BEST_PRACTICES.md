# Mejores Prácticas de Material-UI (MUI)

Este documento describe las mejores prácticas y convenciones para el uso de Material-UI en el proyecto UIFCE Support System.

## 🎨 Tema Personalizado

### Colores Institucionales

El tema utiliza los colores institucionales de UIFCE:

- **Primario:** `#94b43c` (Verde institucional)
- **Secundario:** `#002f6c` (Azul institucional)
- **Error:** `#f44336` (Rojo)
- **Advertencia:** `#ff9800` (Naranja)
- **Éxito:** `#4caf50` (Verde claro)

### Uso del Tema

```tsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  return <Box sx={{ color: theme.palette.primary.main }} />;
}
```

## 🧬 Sistema de Diseño Atómico con MUI

### Átomos MUI

Los componentes atómicos de MUI están personalizados en `src/components/atoms/`:

- **FormInput** - Input con variantes y validación
- **FormSelect** - Select con opciones personalizadas
- **AppBar** - Barra de aplicación institucional
- **Dialog** - Dialog personalizado con bordes redondeados
- **Menu** - Menú desplegable con opciones
- **Icon** - Sistema de iconos semánticos
- **Snackbar** - Notificaciones toast
- **Alert** - Alertas con severidad

### Moléculas MUI

- **FormField** - Campo de formulario unificado
- **FormSection** - Sección de formulario
- **FilterBar** - Barra de filtros
- **PageHeader** - Encabezado de página

### Organismos MUI

- **DataTable** - Tabla de datos avanzada
- **TicketTable** - Tabla de tickets
- **TicketCardList** - Lista de tarjetas

## 🎯 Componentes Personalizados

### Botones

```tsx
import { PrimaryButton, SecondaryButton, ErrorButton } from '@/components/atoms';

// Botón primario
<PrimaryButton onClick={handleClick}>Guardar</PrimaryButton>

// Botón secundario
<SecondaryButton onClick={handleCancel}>Cancelar</SecondaryButton>

// Botón de error
<ErrorButton onClick={handleDelete}>Eliminar</ErrorButton>
```

### Formularios

```tsx
import { FormField, FormSection } from '@/components/molecules';

// Campo de formulario
<FormField
  type="input"
  label="Nombre"
  name="nombre"
  value={value}
  onChange={handleChange}
  error={hasError}
  helperText="Campo requerido"
/>

// Sección de formulario
<FormSection title="Información Personal">
  <FormField type="input" label="Nombre" name="nombre" value={value} onChange={handleChange} />
  <FormField type="input" label="Email" name="email" value={email} onChange={handleChange} />
</FormSection>
```

### Feedback

```tsx
import { Snackbar, Alert } from '@/components/atoms';

// Snackbar
<Snackbar
  open={isOpen}
  message="Operación completada"
  severity="success"
  onClose={handleClose}
/>

// Alert
<Alert
  severity="warning"
  title="Advertencia"
  message="Verifique la información"
  variant="outlined"
/>
```

## 📐 Responsive Design

### Breakpoints

El tema utiliza los breakpoints estándar de MUI:

- `xs`: 0px
- `sm`: 600px
- `md`: 900px
- `lg`: 1200px
- `xl`: 1536px

### Uso de Breakpoints

```tsx
<Box
  sx={{
    width: { xs: '100%', sm: '50%', md: '33.33%' },
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
  }}
>
  Contenido responsive
</Box>
```

### useMediaQuery

```tsx
import { useMediaQuery, useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## 🎭 Animaciones y Transiciones

### Transiciones Personalizadas

El tema incluye transiciones personalizadas para:

- **Botones:** Elevación al hover
- **Cards:** Elevación y sombra al hover
- **Inputs:** Borde verde al focus
- **Chips:** Escala al hover
- **IconButtons:** Rotación al hover

### Duraciones de Transición

```tsx
transitions: {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
}
```

## 🎨 Sistema de Iconos

### Iconos Semánticos

```tsx
import { Icon } from '@/components/atoms';

<Icon name="home" size="medium" />
<Icon name="ticket" size="large" color="primary" />
<Icon name="settings" size="small" />
```

### Nombres de Iconos Disponibles

- `home`, `dashboard`, `ticket`, `settings`
- `user`, `admin`, `logout`, `menu`
- `search`, `filter`, `add`, `edit`, `delete`
- `save`, `cancel`, `check`, `warning`, `error`
- `info`, `success`, `notifications`, `mail`
- `phone`, `location`, `category`, `history`, `people`

## 📐 Grid System

### Uso del Grid de MUI

```tsx
import { Grid, Paper } from '@mui/material';

<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Paper>Item 2</Paper>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
    <Paper>Item 3</Paper>
  </Grid>
</Grid>
```

### Stack (Alternativa Moderna)

```tsx
import { Stack } from '@mui/material';

<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
  <Button>Botón 1</Button>
  <Button>Botón 2</Button>
  <Button>Botón 3</Button>
</Stack>
```

## ♿ Accesibilidad

### ARIA Labels

```tsx
<Button
  aria-label="Cerrar diálogo"
  onClick={handleClose}
>
  <CloseIcon />
</Button>
```

### Navegación por Teclado

```tsx
<MenuItem
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Opción
</MenuItem>
```

### Roles Semánticos

```tsx
<Box role="navigation" aria-label="Menú principal">
  <List>
    {/* Items del menú */}
  </List>
</Box>
```

## 🎨 Estilos

### sx Prop vs Styled Components

**Usar `sx` prop para estilos dinámicos:**

```tsx
<Box sx={{ 
  bgcolor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    bgcolor: theme.palette.primary.dark,
  },
}}>
  Contenido
</Box>
```

**Usar styled-components para componentes reutilizables:**

```tsx
import styled from '@emotion/styled';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

### Evitar Estilos Inline

```tsx
// ❌ Evitar
<div style={{ color: 'red', fontSize: '16px' }} />

// ✅ Usar sx prop
<Box sx={{ color: 'error.main', fontSize: '1rem' }} />

// ✅ O usar styled-components
<StyledBox />
```

## 🚀 Performance

### Memoización de Componentes

```tsx
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<CircularProgress />}>
  <HeavyComponent />
</Suspense>
```

### Virtualización para Listas Largas

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={1000}
  itemSize={35}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>Item {index}</div>
  )}
</FixedSizeList>
```

## 🔧 TypeScript

### Tipado de Props

```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onAction?: () => void;
}

function MyComponent({ title, count, onAction }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}
```

### Tipos de MUI

```tsx
import type { ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

## 📦 Estructura de Archivos

```
src/
├── components/
│   ├── atoms/          # Componentes atómicos MUI
│   ├── molecules/      # Componentes moleculares
│   ├── organisms/      # Componentes de organismos
│   └── templates/      # Plantillas de layout
├── theme/
│   └── theme.ts        # Configuración del tema MUI
└── App.tsx             # ThemeProvider global
```

## 🎯 Convenciones de Nombres

### Componentes

- **Átomos:** PascalCase (ej. `FormInput`, `CustomDialog`)
- **Moléculas:** PascalCase (ej. `FormField`, `FilterBar`)
- **Organismos:** PascalCase (ej. `DataTable`, `TicketTable`)

### Archivos

- **Componentes:** PascalCase.tsx (ej. `FormInput.tsx`)
- **Utils:** camelCase.ts (ej. `formatDate.ts`)
- **Types:** camelCase.ts (ej. `ticketTypes.ts`)

## 🧪 Testing

### Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PrimaryButton } from './PrimaryButton';

test('calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);
  
  await userEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 📚 Recursos

- [Material-UI Documentation](https://mui.com/)
- [Material Design Guidelines](https://material.io/design)
- [MUI System](https://mui.com/system/)
- [MUI Icons](https://mui.com/components/material-icons/)
