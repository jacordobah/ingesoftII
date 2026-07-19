import { Button, type ButtonProps } from '@mui/material';

/**
 * Átomo: PrimaryButton
 * 
 * Botón primario institucional con color verde institucional.
 * 
 * @example
 * ```tsx
 * <PrimaryButton onClick={handleClick}>
 *   Guardar
 * </PrimaryButton>
 * ```
 */
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: '#94b43c',
        color: '#ffffff',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#7a9a30',
          color: '#ffffff',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
