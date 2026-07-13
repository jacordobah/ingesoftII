import { Breadcrumbs, Link, Typography, type BreadcrumbsProps } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbNavProps extends Omit<BreadcrumbsProps, 'children'> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

/**
 * Átomo: BreadcrumbNav
 * 
 * Navegación de migas de pan con enlaces activos.
 * 
 * @example
 * ```tsx
 * <BreadcrumbNav
 *   items={[
 *     { label: 'Inicio', path: '/' },
 *     { label: 'Admin', path: '/admin' },
 *     { label: 'Tickets' }
 *   ]}
 * />
 * ```
 */
export function BreadcrumbNav({ items, separator = '/', ...props }: BreadcrumbNavProps) {
  const location = useLocation();

  return (
    <Breadcrumbs
      {...props}
      separator={separator}
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-separator': {
          color: '#94b43c',
        },
        ...props.sx,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast || !item.path) {
          return (
            <Typography
              key={index}
              color="text.primary"
              sx={{ fontWeight: 500, color: '#002f6c' }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            component={RouterLink}
            to={item.path}
            underline="hover"
            sx={{
              color: location.pathname === item.path ? '#94b43c' : 'inherit',
              fontWeight: location.pathname === item.path ? 600 : 400,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
