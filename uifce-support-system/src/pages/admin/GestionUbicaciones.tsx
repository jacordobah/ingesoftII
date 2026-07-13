import { useState } from 'react';
import type { Ubicacion } from '../../types';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockUbicaciones, mockEdificios, mockTickets } from '../../data/mockData';

export default function GestionUbicaciones() {
  const [edificioSeleccionado, setEdificioSeleccionado] = useState<string | null>(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'edificio' | 'ubicacion'>('ubicacion');
  const [editNombre, setEditNombre] = useState('');
  const [editPuntaje, setEditPuntaje] = useState('');
  const [editOculto, setEditOculto] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdificioClick = (edificio: string) => {
    setEdificioSeleccionado(edificio);
    setUbicacionSeleccionada(null);
  };

  const handleEditarEdificio = (e: React.MouseEvent, edificio: string) => {
    e.stopPropagation();
    setEditNombre(edificio);
    setEditPuntaje('');
    setEditOculto(false);
    setModalType('edificio');
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCrearEdificio = () => {
    setEditNombre('');
    setEditPuntaje('');
    setEditOculto(false);
    setModalType('edificio');
    setIsCreating(true);
    setModalOpen(true);
  };

  const tieneTicketsAsociados = (ubicacionId: string) => {
    return mockTickets.some(t => t.ubicacion === ubicacionId);
  };

  const handleUbicacionClick = (ubicacion: any) => {
    setUbicacionSeleccionada(ubicacion);
    setEditNombre(ubicacion.nombre);
    setEditPuntaje(ubicacion.puntaje.toString());
    setEditOculto(ubicacion.oculto || false);
    setModalType('ubicacion');
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCrearUbicacion = () => {
    setEditNombre('');
    setEditPuntaje('');
    setEditOculto(false);
    setModalType('ubicacion');
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleGuardar = () => {
    console.log('Guardar:', { 
      type: modalType, 
      edificio: modalType === 'edificio' ? edificioSeleccionado : ubicacionSeleccionada?.edificio,
      id: modalType === 'ubicacion' ? ubicacionSeleccionada?.id : null,
      nombre: editNombre, 
      puntaje: editPuntaje
    });
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const ubicacionesFiltradas = edificioSeleccionado
    ? mockUbicaciones.filter((ub) => ub.edificio === edificioSeleccionado)
    : [];

  const contarUbicacionesPorEdificio = (edificio: string) => {
    return mockUbicaciones.filter((ub) => ub.edificio === edificio).length;
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
        <Box sx={{ p: { xs: 3, sm: 4 }, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Gestión de Ubicaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Selecciona un edificio para ver sus ubicaciones
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 500 }}>
          {/* Lista de edificios */}
          <Box sx={{ width: { xs: '100%', md: '40%' }, borderRight: { md: 1 }, borderColor: 'divider' }}>
            <List sx={{ py: 0 }}>
              {mockEdificios.map((edificio) => (
                <ListItem key={edificio} disablePadding>
                  <ListItemButton
                    onClick={() => handleEdificioClick(edificio)}
                    selected={edificioSeleccionado === edificio}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'rgba(148, 180, 60, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(148, 180, 60, 0.2)',
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={edificio}
                      secondary={`${contarUbicacionesPorEdificio(edificio)} ubicaciones`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: edificioSeleccionado === edificio ? 600 : 400,
                        },
                      }}
                    />
                    <IconButton
                      onClick={(e) => handleEditarEdificio(e, edificio)}
                      size="small"
                      sx={{ color: '#94b43c' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleCrearEdificio}
                  sx={{
                    justifyContent: 'center',
                    py: 2,
                    color: '#94b43c',
                    fontWeight: 'bold',
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Agregar Edificio
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Lista de ubicaciones */}
          <Box sx={{ width: { xs: '100%', md: '60%' }, p: { xs: 2, sm: 3 } }}>
            {edificioSeleccionado ? (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: '#002f6c' }}>
                  Ubicaciones
                </Typography>
                {ubicacionesFiltradas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay ubicaciones para este edificio
                  </Typography>
                ) : (
                  <List sx={{ py: 0 }}>
                    {ubicacionesFiltradas.map((ubicacion) => (
                      <ListItem key={ubicacion.id} disablePadding>
                        <ListItemButton
                          onClick={() => handleUbicacionClick(ubicacion)}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: 'white',
                            boxShadow: 1,
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>{ubicacion.nombre}</Typography>
                                <IconButton size="small" sx={{ color: '#94b43c' }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip
                                  label={`Puntaje: ${ubicacion.puntaje}`}
                                  size="small"
                                  sx={{
                                    bgcolor: '#94b43c',
                                    color: '#002f6c',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={handleCrearUbicacion}
                        sx={{
                          justifyContent: 'center',
                          py: 2,
                          color: '#94b43c',
                          fontWeight: 'bold',
                        }}
                      >
                        <AddIcon sx={{ mr: 1 }} />
                        Agregar Ubicación
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  Selecciona un edificio del menú izquierdo
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal de edición */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#002f6c', fontWeight: 'bold' }}>
          {isCreating ? (modalType === 'edificio' ? 'Nuevo Edificio' : 'Nueva Ubicación') : (modalType === 'edificio' ? 'Editar Edificio' : 'Editar Ubicación')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
              sx={{ mb: 2 }}
            />
            {modalType === 'ubicacion' && (
              <TextField
                fullWidth
                label="Puntaje"
                type="number"
                value={editPuntaje}
                onChange={(e) => setEditPuntaje(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            
            {!isCreating && modalType === 'ubicacion' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={editOculto}
                    onChange={(e) => setEditOculto(e.target.checked)}
                    color="warning"
                  />
                }
                label="Ocultar"
                sx={{ mb: 2 }}
              />
            )}

            {!isCreating && modalType === 'ubicacion' && (
              <Box sx={{ mt: 3 }}>
                {tieneTicketsAsociados(ubicacionSeleccionada?.id || '') ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Esta ubicación tiene tickets asociados. Solo puede ocultarla, no eliminarla.
                  </Alert>
                ) : (
                  <Button
                    onClick={() => console.log('Eliminar')}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ mt: 2 }}
                  >
                    Eliminar
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleGuardar} variant="contained" sx={{ bgcolor: '#94b43c', color: '#002f6c', '&:hover': { bgcolor: '#7a9a30' } }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
