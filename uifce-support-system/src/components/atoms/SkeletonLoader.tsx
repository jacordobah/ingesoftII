import { Skeleton, type SkeletonProps } from '@mui/material';

export type SkeletonVariant = 'text' | 'rectangular' | 'circular';
export type SkeletonAnimation = 'pulse' | 'wave' | false;

interface SkeletonLoaderProps extends Omit<SkeletonProps, 'variant' | 'animation'> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  count?: number;
  width?: number | string;
  height?: number | string;
}

/**
 * Átomo: SkeletonLoader
 * 
 * Skeleton para mostrar estado de carga con placeholder.
 * 
 * @example
 * ```tsx
 * <SkeletonLoader variant="text" count={3} />
 * <SkeletonLoader variant="rectangular" width={200} height={100} />
 * <SkeletonLoader variant="circular" width={40} height={40} />
 * ```
 */
export function SkeletonLoader({
  variant = 'text',
  animation = 'pulse',
  count = 1,
  width,
  height,
  ...props
}: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          animation={animation}
          width={width}
          height={height}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            ...props.sx,
          }}
          {...props}
        />
      ))}
    </>
  );
}
