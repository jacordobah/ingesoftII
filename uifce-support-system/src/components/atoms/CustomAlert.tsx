import { Alert, AlertTitle, type AlertProps } from '@mui/material';

export type CustomAlertSeverity = 'success' | 'info' | 'warning' | 'error';
export type CustomAlertVariant = 'filled' | 'outlined' | 'standard';

interface CustomAlertProps extends Omit<AlertProps, 'severity' | 'variant'> {
  severity?: CustomAlertSeverity;
  variant?: CustomAlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
}

/**
 * Átomo: CustomAlert
 * 
 * Alerta personalizada con título, mensaje y severidad.
 * 
 * @example
 * ```tsx
 * <CustomAlert
 *   severity="success"
 *   title="Éxito"
 *   message="Operación completada correctamente"
 *   variant="filled"
 * />
 * ```
 */
export function CustomAlert({
  severity = 'info',
  variant = 'standard',
  title,
  message,
  onClose,
  ...props
}: CustomAlertProps) {
  return (
    <Alert
      {...props}
      severity={severity}
      variant={variant}
      onClose={onClose}
      sx={{
        borderRadius: 8,
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
