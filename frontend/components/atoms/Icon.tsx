import { Icon as MuiIcon, type IconProps } from '@mui/material';

export type IconName = 
  | 'home'
  | 'dashboard'
  | 'ticket'
  | 'settings'
  | 'user'
  | 'admin'
  | 'logout'
  | 'menu'
  | 'close'
  | 'search'
  | 'filter'
  | 'add'
  | 'edit'
  | 'delete'
  | 'save'
  | 'cancel'
  | 'check'
  | 'warning'
  | 'error'
  | 'info'
  | 'success'
  | 'arrow_back'
  | 'arrow_forward'
  | 'expand_more'
  | 'expand_less'
  | 'notifications'
  | 'mail'
  | 'phone'
  | 'location'
  | 'category'
  | 'assignment'
  | 'history'
  | 'people'
  | 'build'
  | 'lock'
  | 'unlock';

interface CustomIconProps extends Omit<IconProps, 'children'> {
  name: IconName;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
};

/**
 * Átomo: CustomIcon
 * 
 * Icono personalizado con nombres semánticos y tamaños.
 * 
 * @example
 * ```tsx
 * <CustomIcon name="home" size="medium" />
 * <CustomIcon name="ticket" size="large" color="primary" />
 * ```
 */
export function CustomIcon({ name, size = 'medium', ...props }: CustomIconProps) {
  return (
    <MuiIcon
      {...props}
      fontSize={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
      sx={{
        fontSize: sizeMap[size],
        ...props.sx,
      }}
    >
      {getIconPath(name)}
    </MuiIcon>
  );
}

function getIconPath(name: IconName): string {
  const iconMap: Record<IconName, string> = {
    home: 'home',
    dashboard: 'dashboard',
    ticket: 'confirmation_number',
    settings: 'settings',
    user: 'person',
    admin: 'admin_panel_settings',
    logout: 'logout',
    menu: 'menu',
    close: 'close',
    search: 'search',
    filter: 'filter_list',
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    save: 'save',
    cancel: 'cancel',
    check: 'check',
    warning: 'warning',
    error: 'error',
    info: 'info',
    success: 'check_circle',
    arrow_back: 'arrow_back',
    arrow_forward: 'arrow_forward',
    expand_more: 'expand_more',
    expand_less: 'expand_less',
    notifications: 'notifications',
    mail: 'mail',
    phone: 'phone',
    location: 'location_on',
    category: 'category',
    assignment: 'assignment',
    history: 'history',
    people: 'people',
    build: 'build',
    lock: 'lock',
    unlock: 'unlock',
  };

  return iconMap[name] || 'help';
}
