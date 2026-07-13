import { FormControl, InputLabel, Select, MenuItem, type SelectProps } from '@mui/material';

export type FormSelectSize = 'small' | 'medium';

interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<SelectProps, 'size' | 'onChange'> {
  label: string;
  name: string;
  value: string;
  options: FormSelectOption[];
  onChange: (value: string) => void;
  size?: FormSelectSize;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Átomo: FormSelect
 * 
 * Select de formulario con opciones y validación integrada.
 * 
 * @example
 * ```tsx
 * <FormSelect
 *   label="Estado"
 *   name="estado"
 *   value={value}
 *   options={[
 *     { value: 'abierto', label: 'Abierto' },
 *     { value: 'cerrado', label: 'Cerrado' }
 *   ]}
 *   onChange={handleChange}
 *   error={hasError}
 *   helperText="Campo requerido"
 * />
 * ```
 */
export function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  size = 'medium',
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  disabled = false,
  placeholder,
  ...props
}: FormSelectProps) {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      size={size}
      disabled={disabled}
      required={required}
      sx={{ minWidth: 120 }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
        label={label}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty={!!placeholder}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? '#f44336' : 'rgba(0, 0, 0, 0.23)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94b43c',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#94b43c',
          },
          ...props.sx,
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <span style={{ fontSize: '0.75rem', color: error ? '#f44336' : '#666', marginTop: '3px' }}>
          {helperText}
        </span>
      )}
    </FormControl>
  );
}
