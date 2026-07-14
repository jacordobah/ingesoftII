import { Box, Paper, Typography, Divider } from '@mui/material';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Molécula: FormSection
 * 
 * Sección de formulario con título, descripción opcional y contenido.
 * 
 * @example
 * ```tsx
 * <FormSection title="Información Personal" description="Complete sus datos">
 *   <FormField type="input" label="Nombre" name="nombre" value={value} onChange={handleChange} />
 *   <FormField type="input" label="Email" name="email" value={email} onChange={handleChange} />
 * </FormSection>
 * ```
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid rgba(148, 180, 60, 0.2)',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        <Divider sx={{ mt: 2, borderColor: 'rgba(148, 180, 60, 0.3)' }} />
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
}
