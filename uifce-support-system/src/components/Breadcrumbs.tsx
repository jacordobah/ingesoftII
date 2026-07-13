import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, type BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CustomBreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  showHome?: boolean;
}

/**
 * Componente Breadcrumbs
 * 
 * Muestra la ruta de navegación actual del usuario.
 * Si no se proporcionan items, los genera automáticamente desde la ruta actual.
 * 
 * @example
 * ```tsx
 * <Breadcrumbs />
 * <Breadcrumbs items={[{ label: 'Admin', path: '/admin' }, { label: 'Dashboard' }]} />
 * ```
 */
export default function Breadcrumbs({ 
  items, 
  homeLabel = 'Inicio', 
  showHome = true,
  ...props 
}: CustomBreadcrumbsProps) {
  const location = useLocation();

  // Generar breadcrumbs automáticamente desde la ruta si no se proporcionan items
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);

  // Agregar home si está habilitado
  const allItems = showHome 
    ? [{ label: homeLabel, path: '/' }, ...breadcrumbItems]
    : breadcrumbItems;

  return (
    <MuiBreadcrumbs
      aria-label="Navegación"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 3 }}
      {...props}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        
        if (isLast) {
          return (
            <Typography 
              key={index} 
              color="#002f6c" 
              sx={{ fontWeight: 600 }}
            >
              {item.label}
            </Typography>
          );
        }
        
        return (
          <Link
            key={index}
            component={RouterLink}
            to={item.path || '/'}
            underline="hover"
            sx={{ color: '#666', '&:hover': { color: '#94b43c' } }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

/**
 * Generar breadcrumbs automáticamente desde la ruta actual
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  if (pathname === '/' || pathname === '/login') {
    return [];
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convertir el segmento a formato legible
    const label = formatSegment(segment);
    
    breadcrumbs.push({
      label,
      path: index === pathSegments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Formatear un segmento de ruta para hacerlo legible
 */
function formatSegment(segment: string): string {
  // Mapeos específicos para rutas conocidas
  const routeMap: Record<string, string> = {
    'usuario': 'Usuario',
    'tecnico': 'Técnico',
    'admin': 'Administrador',
    'nuevo': 'Nuevo Ticket',
    'historial': 'Historial',
    'confirmacion': 'Confirmación',
    'cola': 'Cola de Tickets',
    'asignaciones': 'Mis Asignaciones',
    'dashboard': 'Dashboard',
    'categorias': 'Categorías',
    'ubicaciones': 'Ubicaciones',
    'usuarios': 'Usuarios',
    'auditoria': 'Auditoría',
  };

  if (routeMap[segment]) {
    return routeMap[segment];
  }

  // Formato por defecto: capitalizar primera letra
  return segment
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
