import { useMemo, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { calcularTiempoRestante, formatearFecha, formatearFechaHora } from '../../utils/ticketUtils';

export default function MisAsignaciones() {
  const { tickets, user, actualizarTicketCompleto, users } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [nuevoTecnico, setNuevoTecnico] = useState('');
  const [comentario, setComentario] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Filtrar tickets asignados al técnico actual
  const ticketsAsignados = useMemo(() => {
    return tickets.filter((t) => t.tecnicoAsignado === user?.id);
  }, [tickets, user]);

  // Obtener lista de técnicos y administradores activos
  const tecnicosYAdmins = useMemo(() => {
    return users.filter((u) => u.rol === 'tecnico' || u.rol === 'admin');
  }, [users]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    
    const ticketsResueltosMes = ticketsAsignados.filter(
      (t) => t.estado === 'cerrado' && t.fechaResolucion && new Date(t.fechaResolucion) >= inicioMes
    );
    
    const ticketsActivos = ticketsAsignados.filter(
      (t) => t.estado === 'abierto' || t.estado === 'en_proceso'
    );

    // Calcular tiempo promedio de respuesta (en horas)
    let tiempoPromedioHoras = 0;
    if (ticketsResueltosMes.length > 0) {
      const totalHoras = ticketsResueltosMes.reduce((acc, ticket) => {
        if (ticket.fechaCreacion && ticket.fechaResolucion) {
          const horas = (new Date(ticket.fechaResolucion).getTime() - new Date(ticket.fechaCreacion).getTime()) / (1000 * 60 * 60);
          return acc + horas;
        }
        return acc;
      }, 0);
      tiempoPromedioHoras = totalHoras / ticketsResueltosMes.length;
    }

    return {
      ticketsResueltosMes: ticketsResueltosMes.length,
      ticketsActivos: ticketsActivos.length,
      tiempoPromedioHoras: tiempoPromedioHoras.toFixed(1),
    };
  }, [ticketsAsignados]);

  // Filtrar y ordenar tickets por prioridad
  const ticketsFiltrados = useMemo(() => {
    let filtrados = ticketsAsignados;

    // Filtrar por estado
    if (filtroEstado === 'activos') {
      filtrados = filtrados.filter((t) => t.estado === 'abierto' || t.estado === 'en_proceso');
    } else if (filtroEstado === 'cerrados') {
      filtrados = filtrados.filter((t) => t.estado === 'cerrado');
    }

    // Ordenar por prioridad (crítica > media > baja) y luego por fecha
    const prioridadOrder = { critica: 0, media: 1, baja: 2 };
    return filtrados.sort((a, b) => {
      if (prioridadOrder[a.prioridad] !== prioridadOrder[b.prioridad]) {
        return prioridadOrder[a.prioridad] - prioridadOrder[b.prioridad];
      }
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
  }, [ticketsAsignados, filtroEstado]);

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica':
        return { bgcolor: '#fee2e2', color: '#991b1b' };
      case 'media':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'baja':
        return { bgcolor: '#f3f4f6', color: '#374151' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusColor = (estado: string) => {
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
  };

  const getStatusLabel = (estado: string) => {
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
  };

  const handleRowClick = (ticket: any) => {
    setTicketSeleccionado(ticket);
    setNuevoEstado(ticket.estado);
    setNuevoTecnico(ticket.tecnicoAsignado || '');
    setComentario('');
    setModalOpen(true);
  };

  const handleGuardarCambios = () => {
    if (!ticketSeleccionado) return;

    // Validación: técnico obligatorio al cambiar de abierto a en_proceso o cerrado
    if (ticketSeleccionado.estado === 'abierto' && (nuevoEstado === 'en_proceso' || nuevoEstado === 'cerrado')) {
      if (!nuevoTecnico) {
        alert('Para cambiar el estado del ticket, debe asignar un técnico.');
        return;
      }
    }

    // Validaciones si el estado es cerrado
    if (nuevoEstado === 'cerrado') {
      if (!nuevoTecnico) {
        alert('Para cerrar el ticket, debe asignar un técnico.');
        return;
      }
      if (!comentario || comentario.trim().length < 10) {
        alert('Para cerrar el ticket, debe agregar un comentario de al menos 10 caracteres.');
        return;
      }
    }

    // Guardar cambios usando actualizarTicketCompleto
    actualizarTicketCompleto(ticketSeleccionado.id, nuevoEstado as any, nuevoTecnico, comentario);
    
    setModalOpen(false);
    
    // Mostrar alerta de éxito
    setSnackbarMessage('El ticket se ha cerrado satisfactoriamente y se ha notificado al usuario.');
    setSnackbarOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTicketSeleccionado(null);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1400px' }}>
        <Box>
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Mis Asignaciones
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Tickets asignados a {user?.nombre}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtroEstado}
                  label="Estado"
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="activos">Activos</MenuItem>
                  <MenuItem value="cerrados">Cerrados</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Estadísticas */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Resueltos este mes
                </Typography>
                <Typography variant="h4" sx={{ color: '#94b43c', fontWeight: 'bold', mt: 0.5 }}>
                  {estadisticas.ticketsResueltosMes}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Tickets activos
                </Typography>
                <Typography variant="h4" sx={{ color: '#002f6c', fontWeight: 'bold', mt: 0.5 }}>
                  {estadisticas.ticketsActivos}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Tiempo promedio
                </Typography>
                <Typography variant="h4" sx={{ color: '#002f6c', fontWeight: 'bold', mt: 0.5 }}>
                  {estadisticas.tiempoPromedioHoras}h
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Vista móvil: Cards */}
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {ticketsFiltrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tienes tickets asignados
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {ticketsFiltrados.map((ticket) => (
                    <Card elevation={2} key={ticket.id} onClick={() => handleRowClick(ticket)} sx={{ cursor: 'pointer' }}>
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
                          {ticket.usuarioNombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {ticket.ubicacion}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {ticket.categoria}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 1,
                          }}
                        >
                          {ticket.descripcion}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {formatearFecha(ticket.fechaCreacion)} - {formatearFechaHora(ticket.fechaCreacion).split(',')[1]}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {ticket.estado !== 'cerrado' && (
                            <Chip
                              label={calcularTiempoRestante(ticket.fechaCreacion, ticket.tiempoEstimado)}
                              size="small"
                              sx={{
                                fontFamily: 'monospace',
                                bgcolor: calcularTiempoRestante(ticket.fechaCreacion, ticket.tiempoEstimado) === 'Tiempo excedido' ? '#fee2e2' : '#f3f4f6',
                                color: calcularTiempoRestante(ticket.fechaCreacion, ticket.tiempoEstimado) === 'Tiempo excedido' ? '#991b1b' : 'inherit',
                              }}
                            />
                          )}
                          <Chip
                            label={ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                            size="small"
                            sx={getPriorityColor(ticket.prioridad)}
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
                      ID Ticket
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 150 }}>
                      Solicitante
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                      Ubicación
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                      Categoría
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 200 }}>
                      Descripción
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                      Fecha Solicitud
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                      Tiempo Restante
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 80 }}>
                      Criticidad
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center', minWidth: 80 }}>
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketsFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No tienes tickets asignados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ticketsFiltrados.map((ticket) => (
                      <TableRow key={ticket.id} hover onClick={() => handleRowClick(ticket)} sx={{ cursor: 'pointer' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#002f6c', fontFamily: 'monospace' }}>
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {ticket.usuarioNombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {ticket.ubicacion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {ticket.categoria}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 200,
                            }}
                          >
                            {ticket.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatearFecha(ticket.fechaCreacion)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {formatearFechaHora(ticket.fechaCreacion).split(',')[1]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {ticket.estado !== 'cerrado' ? (
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                fontWeight: 500,
                                color: calcularTiempoRestante(ticket.fechaCreacion, ticket.tiempoEstimado) === 'Tiempo excedido' ? '#991b1b' : 'inherit',
                              }}
                            >
                              {calcularTiempoRestante(ticket.fechaCreacion, ticket.tiempoEstimado)}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Cerrado
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                            size="small"
                            sx={getPriorityColor(ticket.prioridad)}
                          />
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

        {/* Modal de detalle del ticket */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#002f6c', color: 'white' }}>
            Detalle del Ticket {ticketSeleccionado?.id}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {ticketSeleccionado && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Solicitante
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.usuarioNombre}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Ubicación
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.ubicacion}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Categoría
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.categoria} - {ticketSeleccionado.subcategoria}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.descripcion}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Teléfono de contacto
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.telefonoContacto}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Cantidad de equipos
                  </Typography>
                  <Typography variant="body1">{ticketSeleccionado.cantidadEquipos}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={nuevoEstado}
                      label="Estado"
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      disabled={ticketSeleccionado.estado === 'cerrado'}
                    >
                      <MenuItem value="abierto">Abierto</MenuItem>
                      <MenuItem value="en_proceso">En Proceso</MenuItem>
                      <MenuItem value="cerrado">Cerrado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Técnico Asignado</InputLabel>
                    <Select
                      value={nuevoTecnico}
                      label="Técnico Asignado"
                      onChange={(e) => setNuevoTecnico(e.target.value)}
                      disabled={ticketSeleccionado.estado === 'cerrado'}
                    >
                      <MenuItem value="">Sin asignar</MenuItem>
                      {tecnicosYAdmins.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.nombre} ({u.rol === 'admin' ? 'Admin' : 'Técnico'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {nuevoEstado === 'cerrado' && (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Comentario (obligatorio para cerrar)"
                      multiline
                      rows={3}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Agrega un comentario sobre el ticket..."
                      required
                    />
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            {ticketSeleccionado?.estado !== 'cerrado' && (
              <Button onClick={handleGuardarCambios} variant="contained" sx={{ bgcolor: '#002f6c', '&:hover': { bgcolor: '#001f4d' } }}>
                Guardar Cambios
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
