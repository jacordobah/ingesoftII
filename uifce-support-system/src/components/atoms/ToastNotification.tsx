import { Alert, AlertTitle, type AlertProps } from '@mui/material';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';
export type ToastVariant = 'filled' | 'outlined' | 'standard';

interface ToastNotificationProps extends Omit<AlertProps, 'severity' | 'variant'> {
  severity?: ToastSeverity;
  variant?: ToastVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}

/**
 * Átomo: ToastNotification
 * 
 * Notificación toast con diferentes severidades y variantes.
 * 
 * @example
 * ```tsx
 * <ToastNotification
 *   severity="success"
 *   title="Éxito"
 *   message="Operación completada correctamente"
 *   onClose={handleClose}
 * />
 * <ToastNotification
 *   severity="error"
 *   variant="outlined"
 *   message="Error al procesar la solicitud"
 * />
 * ```
 */
export function ToastNotification({
  severity = 'info',
  variant = 'filled',
  title,
  message,
  onClose,
  autoHideDuration = 6000,
  ...props
}: ToastNotificationProps) {
  return (
    <Alert
      {...props}
      severity={severity}
      variant={variant}
      onClose={onClose}
      sx={{
        '& .MuiAlert-icon': {
          color: severity === 'success' ? '#166534' : 
                 severity === 'error' ? '#991b1b' : 
                 severity === 'warning' ? '#92400e' : '#1e40af',
        },
        ...props.sx,
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}
