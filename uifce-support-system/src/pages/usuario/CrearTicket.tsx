import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { mockCategorias, mockSubcategorias, mockUbicaciones, mockEdificios } from '../../data/mockData';

export default function CrearTicket() {
  const { crearTicket } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoria: '',
    subcategoria: '',
    edificio: '',
    ubicacion: '',
    cantidadEquipos: '',
    telefonoContacto: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoriaSeleccionada = mockCategorias.find((c) => c.id === formData.categoria);
  const subcategoriasFiltradas = mockSubcategorias.filter(
    (s) => s.categoriaId === formData.categoria
  );
  const ubicacionesFiltradas = mockUbicaciones.filter(
    (u) => u.edificio === formData.edificio
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset campos dependientes
    if (field === 'categoria') {
      setFormData((prev) => ({ ...prev, subcategoria: '' }));
    }
    if (field === 'edificio') {
      setFormData((prev) => ({ ...prev, ubicacion: '' }));
    }
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoria) newErrors.categoria = 'Debe seleccionar una categoría';
    if (!formData.subcategoria) newErrors.subcategoria = 'Debe seleccionar una subcategoría';
    if (!formData.edificio) newErrors.edificio = 'Debe seleccionar un edificio';
    if (!formData.ubicacion) newErrors.ubicacion = 'Debe seleccionar una ubicación';
    if (!formData.cantidadEquipos) newErrors.cantidadEquipos = 'Debe ingresar la cantidad de equipos';
    else {
      const cantidadNum = Number(formData.cantidadEquipos);
      if (isNaN(cantidadNum) || cantidadNum < 1 || cantidadNum > 99)
        newErrors.cantidadEquipos = 'Debe ingresar un número entre 1 y 99';
    }
    if (!formData.telefonoContacto) newErrors.telefonoContacto = 'Debe ingresar un teléfono de contacto';
    if (!formData.descripcion) newErrors.descripcion = 'Debe ingresar una descripción';
    else if (formData.descripcion.length < 10)
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Obtener puntajes
    const subcategoriaSeleccionada = subcategoriasFiltradas.find((s) => s.nombre === formData.subcategoria);
    const puntajeSubcategoria = subcategoriaSeleccionada?.puntaje || 0;
    const puntajeUbicacion = ubicacionesFiltradas.find((u) => u.nombre === formData.ubicacion)?.puntaje || 0;
    
    // Calcular puntaje de cantidad de equipos basado en el número ingresado
    const cantidadNum = Number(formData.cantidadEquipos);
    let puntajeCantidad = 0;
    if (cantidadNum >= 1 && cantidadNum <= 3) puntajeCantidad = 5;
    else if (cantidadNum >= 4 && cantidadNum <= 14) puntajeCantidad = 12;
    else if (cantidadNum >= 15 && cantidadNum <= 30) puntajeCantidad = 20;
    else if (cantidadNum > 30) puntajeCantidad = 30;

    // RF-02, RF-03, RF-04, RF-05, RF-06: Crear ticket
    const nuevoTicket = crearTicket({
      categoria: categoriaSeleccionada?.nombre || '',
      subcategoria: formData.subcategoria,
      ubicacion: `${formData.edificio} - ${formData.ubicacion}`,
      cantidadEquipos: formData.cantidadEquipos,
      telefonoContacto: formData.telefonoContacto,
      descripcion: formData.descripcion,
      puntajeSubcategoria,
      puntajeUbicacion,
      puntajeCantidad,
    });

    // Navegar a la página de confirmación con el ticket creado
    navigate('/usuario/confirmacion', { state: { ticket: nuevoTicket } });
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: '900px' }}>
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Formulario de Solicitud de Soporte Técnico
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Ingrese los datos requeridos. La asignación de tiempos de respuesta se procesará
              automáticamente según la matriz de prioridades.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
              {/* Categoría */}
              <FormControl fullWidth error={!!errors.categoria}>
                <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Categoría del Servicio</InputLabel>
                <Select
                  value={formData.categoria}
                  label="Categoría del Servicio"
                  onChange={(e) => handleChange('categoria', e.target.value)}
                >
                  {mockCategorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoria && (
                  <Typography variant="caption" color="error" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {errors.categoria}
                  </Typography>
                )}
              </FormControl>

              {/* Subcategoría */}
              <FormControl fullWidth error={!!errors.subcategoria} disabled={!formData.categoria}>
                <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>¿Cuál es el problema principal?</InputLabel>
                <Select
                  value={formData.subcategoria}
                  label="¿Cuál es el problema principal?"
                  onChange={(e) => handleChange('subcategoria', e.target.value)}
                >
                  {subcategoriasFiltradas.map((sub) => (
                    <MenuItem key={sub.id} value={sub.nombre}>
                      {sub.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subcategoria && (
                  <Typography variant="caption" color="error" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {errors.subcategoria}
                  </Typography>
                )}
              </FormControl>

              {/* Edificio */}
              <FormControl fullWidth error={!!errors.edificio}>
                <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Edificio</InputLabel>
                <Select
                  value={formData.edificio}
                  label="Edificio"
                  onChange={(e) => handleChange('edificio', e.target.value)}
                >
                  {mockEdificios.map((edificio) => (
                    <MenuItem key={edificio} value={edificio}>
                      {edificio}
                    </MenuItem>
                  ))}
                </Select>
                {errors.edificio && (
                  <Typography variant="caption" color="error" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {errors.edificio}
                  </Typography>
                )}
              </FormControl>

              {/* Ubicación */}
              <FormControl fullWidth error={!!errors.ubicacion} disabled={!formData.edificio}>
                <InputLabel sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>Ubicación Específica</InputLabel>
                <Select
                  value={formData.ubicacion}
                  label="Ubicación Específica"
                  onChange={(e) => handleChange('ubicacion', e.target.value)}
                >
                  {ubicacionesFiltradas.map((ub) => (
                    <MenuItem key={ub.id} value={ub.nombre}>
                      {ub.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ubicacion && (
                  <Typography variant="caption" color="error" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {errors.ubicacion}
                  </Typography>
                )}
              </FormControl>

              {/* Cantidad de Equipos */}
              <TextField
                fullWidth
                type="number"
                label="Cantidad de Equipos Afectados"
                value={formData.cantidadEquipos}
                onChange={(e) => {
                  const value = e.target.value;
                  // Limitar a máximo 2 dígitos (1-99)
                  if (value === '' || (Number(value) >= 1 && Number(value) <= 99)) {
                    handleChange('cantidadEquipos', value);
                  }
                }}
                error={!!errors.cantidadEquipos}
                helperText={errors.cantidadEquipos || 'Ingrese el número de equipos afectados (1-99)'}
                sx={{
                  '& .MuiInputLabel-root': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                  '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } },
                }}
              />

              {/* Teléfono de Contacto */}
              <TextField
                fullWidth
                label="Teléfono de Contacto / Extensión"
                value={formData.telefonoContacto}
                onChange={(e) => handleChange('telefonoContacto', e.target.value)}
                error={!!errors.telefonoContacto}
                helperText={errors.telefonoContacto || 'Ingrese un número de teléfono o extensión para contacto'}
                placeholder="Ej: 1234567 o Ext. 123"
                sx={{
                  '& .MuiInputLabel-root': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                  '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } },
                }}
              />

              {/* Descripción */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción Detallada del Problema"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                error={!!errors.descripcion}
                helperText={errors.descripcion || 'Proporcione la mayor cantidad de detalles técnicos posibles...'}
                placeholder="Describa el problema con el mayor detalle posible..."
                sx={{
                  '& .MuiInputLabel-root': { fontSize: { xs: '0.85rem', sm: '1rem' } },
                  '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } },
                }}
              />

              {/* Botón de envío */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  bgcolor: '#94b43c',
                  '&:hover': { bgcolor: '#83a133' },
                  py: { xs: 1, sm: 1.5 },
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Enviar Solicitud
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
