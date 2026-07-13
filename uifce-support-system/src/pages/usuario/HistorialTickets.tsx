import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import type { Ticket } from '../../types';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { formatearFecha, formatearFechaHora } from '../../utils/ticketUtils';

export default function HistorialTickets() {
  const { user, tickets, getTicketsByUsuario, users } = useApp();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const misTickets = useMemo(() => {
    if (!user) return [];
    return getTicketsByUsuario(user.id);
  }, [user, tickets, getTicketsByUsuario]);

  // Función para obtener el nombre del técnico por ID
  const getNombreTecnico = useCallback((tecnicoId: string) => {
    const tecnico = users.find((u) => u.id === tecnicoId);
    return tecnico ? tecnico.nombre : tecnicoId;
  }, [users]);

  const getStatusColor = useCallback((estado: string) => {
    switch (estado) {
      case 'abierto':
        return { bgcolor: '#eff6ff', color: '#1e40af' };
      case 'en_proceso':
        return { bgcolor: '#fffbeb', color: '#92400e' };
      case 'cerrado':
        return { bgcolor: '#f0fdf4', color: '#166534' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  }, []);

  const getStatusLabel = useCallback((estado: string) => {
    switch (estado) {
      case 'abierto':
        return 'Abierto';
      case 'en_proceso':
        return 'En Proceso';
      case 'cerrado':
        return 'Cerrado';
      default:
        return estado;
    }
  }, []);

  const handleVerDetalle = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTicket(null);
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
        <Box>
          <Box sx={{ p: { xs: 3, sm: 4 }, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Historial de Solicitudes Registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Consulte la trazabilidad, comentarios y estados asignados por el equipo técnico.
            </Typography>
          </Box>

          {/* Vista móvil: Cards */}
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {misTickets.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tiene tickets registrados
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/usuario/crear-ticket')}
                    sx={{
                      mt: 2,
                      bgcolor: '#94b43c',
                      '&:hover': { bgcolor: '#83a133' },
                    }}
                  >
                    Crear Nuevo Ticket
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {misTickets.map((ticket) => (
                    <Card elevation={2} key={ticket.id} sx={{ cursor: 'pointer' }} onClick={() => handleVerDetalle(ticket)}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#002f6c', fontFamily: 'monospace' }}>
                            {ticket.id}
                          </Typography>
                          <Chip
                            label={getStatusLabel(ticket.estado)}
                            size="small"
                            sx={getStatusColor(ticket.estado)}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {ticket.categoria}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {ticket.ubicacion}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {formatearFecha(ticket.fechaCreacion)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={ticket.tiempoEstimado}
                            size="small"
                            sx={{ fontFamily: 'monospace', bgcolor: '#f3f4f6' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            /* Vista desktop: Tabla */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                      Código ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                      Fecha / Hora
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 200 }}>
                      Detalle del Problema
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', minWidth: 100 }}>
                      Tiempo Estimado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', minWidth: 80 }}>
                      Estado Actual
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {misTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No tiene tickets registrados
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/usuario/nuevo')}
                          sx={{
                            mt: 2,
                            bgcolor: '#94b43c',
                            '&:hover': { bgcolor: '#83a133' },
                          }}
                        >
                          Crear Nuevo Ticket
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    misTickets.map((ticket) => (
                      <TableRow key={ticket.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleVerDetalle(ticket)}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#002f6c', fontFamily: 'monospace' }}>
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatearFecha(ticket.fechaCreacion)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatearFechaHora(ticket.fechaCreacion).split(',')[1]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {ticket.categoria} — {ticket.ubicacion}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 300,
                            }}
                          >
                            {ticket.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            {ticket.tiempoEstimado}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusLabel(ticket.estado)}
                            size="small"
                            sx={getStatusColor(ticket.estado)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Modal de detalle del ticket */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#002f6c', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Detalle de Solicitud
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedTicket && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Código ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#002f6c' }}>
                  {selectedTicket.id}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Fecha de Creación
                  </Typography>
                  <Typography variant="body2">
                    {formatearFechaHora(selectedTicket.fechaCreacion)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Estado
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedTicket.estado)}
                    size="small"
                    sx={getStatusColor(selectedTicket.estado)}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Categoría
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.categoria}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Subcategoría
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.subcategoria}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Ubicación
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.ubicacion}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Cantidad de Equipos
                  </Typography>
                  <Typography variant="body1">
                    {selectedTicket.cantidadEquipos}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Tiempo Estimado
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {selectedTicket.tiempoEstimado}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Teléfono de Contacto
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.telefonoContacto}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                  Descripción
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.descripcion}
                </Typography>
              </Box>

              {selectedTicket.tecnicoAsignado && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Técnico Asignado
                  </Typography>
                  <Typography variant="body1">
                    {getNombreTecnico(selectedTicket.tecnicoAsignado)}
                  </Typography>
                </Box>
              )}

              {selectedTicket.estado === 'cerrado' && selectedTicket.fechaResolucion && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 0.5 }}>
                    Fecha de Resolución
                  </Typography>
                  <Typography variant="body2">
                    {formatearFechaHora(selectedTicket.fechaResolucion)}
                  </Typography>
                </Box>
              )}

              {selectedTicket.comentarios && selectedTicket.comentarios.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1 }}>
                    Comentarios ({selectedTicket.comentarios.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedTicket.comentarios.map((comentario) => (
                      <Box key={comentario.id} sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {comentario.autor} ({comentario.autorRol}) - {formatearFechaHora(comentario.fecha)}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {comentario.contenido}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: '#002f6c', '&:hover': { bgcolor: '#001f4d' } }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
