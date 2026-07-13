import { CircularProgress, Box, Typography, type CircularProgressProps } from '@mui/material';

export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingVariant = 'determinate' | 'indeterminate';

interface LoadingSpinnerProps extends Omit<CircularProgressProps, 'size' | 'variant'> {
  size?: LoadingSize;
  variant?: LoadingVariant;
  message?: string;
  fullScreen?: boolean;
  value?: number;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 60,
};

/**
 * Átomo: LoadingSpinner
 * 
 * Spinner de carga con mensaje opcional y variantes.
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="medium" message="Cargando..." />
 * <LoadingSpinner variant="determinate" value={75} />
 * <LoadingSpinner fullScreen message="Procesando solicitud" />
 * ```
 */
export function LoadingSpinner({
  size = 'medium',
  variant = 'indeterminate',
  message,
  fullScreen = false,
  value,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <CircularProgress
      {...props}
      size={sizeMap[size]}
      variant={variant}
      value={value}
      sx={{
        color: '#94b43c',
        ...props.sx,
      }}
    />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {spinner}
        {message && (
          <Typography sx={{ mt: 2, color: '#002f6c' }} variant="body1">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {spinner}
      {message && (
        <Typography sx={{ color: '#002f6c' }} variant="body2">
          {message}
        </Typography>
      )}
    </Box>
  );
}
