import { AppBar, Toolbar, Typography, IconButton, type AppBarProps } from '@mui/material';

interface CustomAppBarProps extends Omit<AppBarProps, 'children'> {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  rightContent?: React.ReactNode;
}

/**
 * Átomo: AppBar
 * 
 * Barra de aplicación institucional con título y menú.
 * 
 * @example
 * ```tsx
 * <AppBar title="UIFCE Support System" onMenuClick={toggleDrawer} showMenuButton />
 * ```
 */
export function CustomAppBar({ title, onMenuClick, showMenuButton = true, rightContent, ...props }: CustomAppBarProps) {
  return (
    <AppBar
      {...props}
      position="static"
      sx={{
        backgroundColor: '#002f6c',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        ...props.sx,
      }}
    >
      <Toolbar>
        {showMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            ☰
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        {rightContent}
      </Toolbar>
    </AppBar>
  );
}
