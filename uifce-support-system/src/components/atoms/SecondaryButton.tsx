import { Button, type ButtonProps } from '@mui/material';

/**
 * Átomo: SecondaryButton
 * 
 * Botón secundario con borde y color institucional.
 * 
 * @example
 * ```tsx
 * <SecondaryButton onClick={handleCancel}>
 *   Cancelar
 * </SecondaryButton>
 * ```
 */
export function SecondaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        color: '#002f6c',
        borderColor: '#94b43c',
        fontWeight: 'bold',
        '&:hover': {
          borderColor: '#7a9a30',
          backgroundColor: 'rgba(148, 180, 60, 0.1)',
          color: '#002f6c',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
