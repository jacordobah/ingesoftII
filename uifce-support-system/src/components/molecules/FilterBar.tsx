import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PrimaryButton } from '../atoms';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: Array<{
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }>;
  onApply?: () => void;
  onReset?: () => void;
}

/**
 * Molécula: FilterBar
 * 
 * Barra de filtros compuesta por múltiples selects y botones de acción.
 * 
 * @example
 * ```tsx
 * <FilterBar
 *   filters={[
 *     { label: 'Estado', value: 'abierto', options: [...], onChange: handleChange },
 *     { label: 'Prioridad', value: 'critica', options: [...], onChange: handleChange }
 *   ]}
 *   onApply={handleApply}
 *   onReset={handleReset}
 * />
 * ```
 */
export function FilterBar({ filters, onApply, onReset }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
        alignItems: 'flex-end',
      }}
    >
      {filters.map((filter, index) => (
        <FormControl key={index} sx={{ minWidth: 200, flex: '1 1 auto' }}>
          <InputLabel>{filter.label}</InputLabel>
          <Select
            value={filter.value}
            label={filter.label}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      
      {onApply && (
        <PrimaryButton onClick={onApply} sx={{ minWidth: 120 }}>
          Aplicar
        </PrimaryButton>
      )}
      
      {onReset && (
        <PrimaryButton onClick={onReset} variant="outlined" sx={{ minWidth: 120 }}>
          Limpiar
        </PrimaryButton>
      )}
    </Box>
  );
}
