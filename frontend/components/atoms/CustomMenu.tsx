import { Menu, MenuItem, type MenuProps } from '@mui/material';

export interface MenuItemOption {
  label: string;
  value: string;
  disabled?: boolean;
  divider?: boolean;
}

interface CustomMenuProps extends Omit<MenuProps, 'children' | 'onClose'> {
  items: MenuItemOption[];
  onMenuItemSelect: (value: string) => void;
  onClose?: () => void;
}

/**
 * Átomo: CustomMenu
 * 
 * Menú desplegable personalizado con opciones.
 * 
 * @example
 * ```tsx
 * <CustomMenu
 *   anchorEl={anchorEl}
 *   open={open}
 *   onClose={handleClose}
 *   items={[
 *     { label: 'Editar', value: 'edit' },
 *     { label: 'Eliminar', value: 'delete', divider: true }
 *   ]}
 *   onMenuItemSelect={handleSelect}
 * />
 * ```
 */
export function CustomMenu({ items, onMenuItemSelect, onClose, ...props }: CustomMenuProps) {
  const handleSelect = (value: string) => {
    onMenuItemSelect(value);
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Menu
      {...props}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        ...props.sx,
      }}
    >
      {items.map((item) => (
        <MenuItem
          key={item.value}
          onClick={() => handleSelect(item.value)}
          disabled={item.disabled}
          divider={item.divider}
          sx={{
            color: '#002f6c',
            '&:hover': {
              backgroundColor: 'rgba(148, 180, 60, 0.1)',
            },
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
