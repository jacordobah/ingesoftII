import { Button, type ButtonProps } from '@mui/material';

/**
 * Átomo: ErrorButton
 * 
 * Botón de error con borde rojo.
 * 
 * @example
 * ```tsx
 * <ErrorButton onClick={handleDelete}>
 *   Eliminar
 * </ErrorButton>
 * ```
 */
export function ErrorButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        borderColor: '#f44336',
        color: '#f44336',
        '&:hover': {
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
