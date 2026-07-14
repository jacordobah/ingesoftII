import { TextField, type TextFieldProps } from '@mui/material';

export type FormInputVariant = 'standard' | 'outlined' | 'filled';
export type FormInputSize = 'small' | 'medium';

interface FormInputProps extends Omit<TextFieldProps, 'variant' | 'size' | 'onChange'> {
  variant?: FormInputVariant;
  size?: FormInputSize;
  error?: boolean;
  helperText?: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Átomo: FormInput
 * 
 * Input de formulario con variantes y validación integrada.
 * 
 * @example
 * ```tsx
 * <FormInput
 *   label="Nombre"
 *   name="nombre"
 *   value={value}
 *   onChange={handleChange}
 *   error={hasError}
 *   helperText="Campo requerido"
 *   variant="outlined"
 *   size="small"
 * />
 * ```
 */
export function FormInput({
  variant = 'outlined',
  size = 'medium',
  error = false,
  helperText,
  label,
  name,
  value,
  onChange,
  fullWidth = true,
  required = false,
  disabled = false,
  ...props
}: FormInputProps) {
  return (
    <TextField
      {...props}
      variant={variant}
      size={size}
      error={error}
      helperText={helperText}
      label={label}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#94b43c',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#94b43c',
        },
        ...props.sx,
      }}
    />
  );
}
