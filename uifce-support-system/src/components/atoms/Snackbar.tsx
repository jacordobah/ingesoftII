import { Snackbar, Alert, type SnackbarProps } from '@mui/material';

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

interface CustomSnackbarProps extends Omit<SnackbarProps, 'children'> {
  message: string;
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
  onClose?: () => void;
}

/**
 * Átomo: CustomSnackbar
 * 
 * Snackbar de notificación con severidad y auto-hide.
 * 
 * @example
 * ```tsx
 * <CustomSnackbar
 *   open={isOpen}
 *   message="Operación completada"
 *   severity="success"
 *   onClose={handleClose}
 * />
 * ```
 */
export function CustomSnackbar({
  message,
  severity = 'info',
  autoHideDuration = 6000,
  onClose,
  open,
  ...props
}: CustomSnackbarProps) {
  return (
    <Snackbar
      {...props}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiSnackbar-root': {
          maxWidth: '400px',
        },
        ...props.sx,
      }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        variant="filled"
        sx={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
