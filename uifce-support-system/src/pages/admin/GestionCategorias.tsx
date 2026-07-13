import { useState } from 'react';
import type { Subcategoria } from '../../types';
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
import { mockCategorias, mockSubcategorias, mockTickets } from '../../data/mockData';

export default function GestionCategorias() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<Subcategoria | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'categoria' | 'subcategoria'>('subcategoria');
  const [editNombre, setEditNombre] = useState('');
  const [editPuntaje, setEditPuntaje] = useState('');
  const [editOculto, setEditOculto] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCategoriaClick = (categoriaId: string) => {
    setCategoriaSeleccionada(categoriaId);
    setSubcategoriaSeleccionada(null);
  };

  const handleEditarCategoria = (e: React.MouseEvent, categoriaId: string) => {
    e.stopPropagation();
    const categoria = mockCategorias.find((c) => c.id === categoriaId);
    if (categoria) {
      setEditNombre(categoria.nombre);
      setEditOculto(categoria.oculto || false);
      setModalType('categoria');
      setIsCreating(false);
      setModalOpen(true);
    }
  };

  const handleCrearCategoria = () => {
    setEditNombre('');
    setEditOculto(false);
    setModalType('categoria');
    setIsCreating(true);
    setModalOpen(true);
  };

  const tieneTicketsAsociados = (id: string, type: 'categoria' | 'subcategoria') => {
    if (type === 'categoria') {
      return mockTickets.some(t => t.categoria === id);
    } else {
      return mockTickets.some(t => t.subcategoria === id);
    }
  };

  const handleSubcategoriaClick = (subcategoria: any) => {
    setSubcategoriaSeleccionada(subcategoria);
    setEditNombre(subcategoria.nombre);
    setEditPuntaje(subcategoria.puntaje.toString());
    setEditOculto(subcategoria.oculto || false);
    setModalType('subcategoria');
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCrearSubcategoria = () => {
    setEditNombre('');
    setEditPuntaje('');
    setEditOculto(false);
    setModalType('subcategoria');
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleGuardar = () => {
    // Aquí se implementaría la lógica para guardar los cambios
    console.log('Guardar:', { 
      type: modalType, 
      id: modalType === 'categoria' ? categoriaSeleccionada : subcategoriaSeleccionada?.id, 
      nombre: editNombre, 
      puntaje: editPuntaje
    });
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const subcategoriasFiltradas = categoriaSeleccionada
    ? mockSubcategorias.filter((sub) => sub.categoriaId === categoriaSeleccionada)
    : [];

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
        <Box sx={{ p: { xs: 3, sm: 4 }, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Gestión de Categorías
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Selecciona una categoría para ver sus subcategorías
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 500 }}>
          {/* Lista de categorías */}
          <Box sx={{ width: { xs: '100%', md: '40%' }, borderRight: { md: 1 }, borderColor: 'divider' }}>
            <List sx={{ py: 0 }}>
              {mockCategorias.map((categoria) => (
                <ListItem key={categoria.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleCategoriaClick(categoria.id)}
                    selected={categoriaSeleccionada === categoria.id}
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
                      primary={categoria.nombre}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: categoriaSeleccionada === categoria.id ? 600 : 400,
                        },
                      }}
                    />
                    <IconButton
                      onClick={(e) => handleEditarCategoria(e, categoria.id)}
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
                  onClick={handleCrearCategoria}
                  sx={{
                    justifyContent: 'center',
                    py: 2,
                    color: '#94b43c',
                    fontWeight: 'bold',
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Agregar Categoría
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Lista de subcategorías */}
          <Box sx={{ width: { xs: '100%', md: '60%' }, p: { xs: 2, sm: 3 } }}>
            {categoriaSeleccionada ? (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: '#002f6c' }}>
                  Subcategorías
                </Typography>
                {subcategoriasFiltradas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay subcategorías para esta categoría
                  </Typography>
                ) : (
                  <List sx={{ py: 0 }}>
                    {subcategoriasFiltradas.map((subcategoria) => (
                      <ListItem key={subcategoria.id} disablePadding>
                        <ListItemButton
                          onClick={() => handleSubcategoriaClick(subcategoria)}
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
                                <Typography>{subcategoria.nombre}</Typography>
                                <IconButton size="small" sx={{ color: '#94b43c' }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                <Chip
                                  label={`Puntaje: ${subcategoria.puntaje}`}
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
                        onClick={handleCrearSubcategoria}
                        sx={{
                          justifyContent: 'center',
                          py: 2,
                          color: '#94b43c',
                          fontWeight: 'bold',
                        }}
                      >
                        <AddIcon sx={{ mr: 1 }} />
                        Agregar Subcategoría
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  Selecciona una categoría del menú izquierdo
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal de edición */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#002f6c', fontWeight: 'bold' }}>
          {isCreating ? (modalType === 'categoria' ? 'Nueva Categoría' : 'Nueva Subcategoría') : (modalType === 'categoria' ? 'Editar Categoría' : 'Editar Subcategoría')}
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
            {modalType === 'subcategoria' && (
              <TextField
                fullWidth
                label="Puntaje"
                type="number"
                value={editPuntaje}
                onChange={(e) => setEditPuntaje(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            
            {!isCreating && (
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

            {!isCreating && (
              <Box sx={{ mt: 3 }}>
                {tieneTicketsAsociados(
                  modalType === 'categoria' ? categoriaSeleccionada || '' : subcategoriaSeleccionada?.id || '',
                  modalType
                ) ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Esta {modalType === 'categoria' ? 'categoría' : 'subcategoría'} tiene tickets asociados. Solo puede ocultarla, no eliminarla.
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
