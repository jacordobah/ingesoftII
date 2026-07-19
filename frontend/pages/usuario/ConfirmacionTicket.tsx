import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import type { Ticket } from '../../types';

export default function ConfirmacionTicket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (location.state?.ticket) {
      setTicket(location.state.ticket);
    } else {
      navigate('/usuario/nuevo');
    }
  }, [location, navigate]);

  if (!ticket) {
    return null;
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: '800px' }}>
        <Box>
          {/* Encabezado de éxito */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#94b43c', fontWeight: 'bold', mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              ¡Solicitud Enviada Exitosamente!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Su solicitud ha sido registrada y será atendida según la prioridad asignada.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* ID del ticket */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Código de Solicitud
            </Typography>
            <Typography variant="h3" sx={{ color: '#002f6c', fontWeight: 'bold', mt: 1, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
              {ticket.id}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Información del ticket */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Categoría
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.categoria}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Subcategoría
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.subcategoria}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Ubicación
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.ubicacion}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Cantidad de Equipos Afectados
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.cantidadEquipos}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Teléfono de Contacto
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.telefonoContacto}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Descripción
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {ticket.descripcion}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Tiempo estimado */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Tiempo de Respuesta Estimado
            </Typography>
            <Typography variant="h5" sx={{ color: '#002f6c', fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {ticket.tiempoEstimado}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Alerta de confirmación */}
          <Alert severity="success" sx={{ mb: 4 }}>
            Se ha enviado un correo de confirmación a {ticket.usuarioEmail}
          </Alert>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/usuario/nuevo')}
              sx={{
                bgcolor: '#94b43c',
                '&:hover': { bgcolor: '#83a133' },
                py: { xs: 1, sm: 1.5 },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Crear Nueva Solicitud
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/usuario/historial')}
              sx={{
                borderColor: '#002f6c',
                color: '#002f6c',
                '&:hover': { borderColor: '#002f6c', bgcolor: 'rgba(0, 47, 108, 0.05)' },
                py: { xs: 1, sm: 1.5 },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Ver Mis Solicitudes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
