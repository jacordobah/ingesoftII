import { Box } from '@mui/material';
import { FormInput, FormSelect } from '../atoms';

export type FieldType = 'input' | 'select' | 'textarea';

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input' | 'textarea';
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

/**
 * Molécula: FormField
 * 
 * Campo de formulario unificado que puede ser input, textarea o select.
 * Incluye label, validación y helper text.
 * 
 * @example
 * ```tsx
 * <FormField
 *   type="input"
 *   label="Nombre"
 *   name="nombre"
 *   value={value}
 *   onChange={handleChange}
 *   error={hasError}
 *   helperText="Campo requerido"
 *   required
 * />
 * <FormField
 *   type="select"
 *   label="Estado"
 *   name="estado"
 *   value={value}
 *   onChange={handleChange}
 *   options={[{ value: 'activo', label: 'Activo' }]}
 * />
 * ```
 */
export function FormField(props: FormFieldProps) {
  const { type, label, error, helperText, required } = props;

  const commonProps = {
    label,
    name: props.name,
    value: props.value,
    onChange: props.onChange,
    error,
    helperText,
    required,
    disabled: props.disabled,
    fullWidth: props.fullWidth,
  };

  return (
    <Box sx={{ mb: 2 }}>
      {type === 'input' || type === 'textarea' ? (
        <FormInput
          {...commonProps}
          variant={props.type === 'input' ? props.variant : 'outlined'}
          size={props.type === 'input' ? props.size : 'medium'}
          multiline={type === 'textarea'}
          rows={type === 'textarea' ? 4 : undefined}
        />
      ) : type === 'select' ? (
        <FormSelect
          {...commonProps}
          options={props.options}
          placeholder={props.placeholder}
        />
      ) : null}
    </Box>
  );
}
