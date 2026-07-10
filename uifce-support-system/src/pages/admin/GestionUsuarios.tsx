import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockUsers, mockTickets } from '../../data/mockData';

const ADMIN_PROTEGIDO = 'uniic_bog@unal.edu.co';

export default function GestionUsuarios() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoRol, setNuevoRol] = useState<'tecnico' | 'admin'>('tecnico');
  const [isCreating, setIsCreating] = useState(false);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<any>(null);

  const tecnicosYAdmins = mockUsers.filter((u) => u.rol === 'tecnico' || u.rol === 'admin');
  const admins = mockUsers.filter((u) => u.rol === 'admin');

  const handleCambiarRol = (usuario: any) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.rol);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCrearUsuario = () => {
    setNuevoEmail('');
    setNuevoRol('tecnico');
    setIsCreating(true);
    setModalOpen(true);
  };

  const tieneTicketsAsignados = (usuarioId: string) => {
    return mockTickets.some(t => t.tecnicoAsignado === usuarioId);
  };

  const handleEliminarClick = (usuario: any) => {
    setUsuarioAEliminar(usuario);
    setEliminarModalOpen(true);
  };

  const handleEliminarConfirmar = () => {
    console.log('Eliminar usuario:', usuarioAEliminar?.id);
    setEliminarModalOpen(false);
    setUsuarioAEliminar(null);
  };

  const handleEliminarCancelar = () => {
    setEliminarModalOpen(false);
    setUsuarioAEliminar(null);
  };

  const handleGuardar = () => {
    if (isCreating) {
      // Crear nuevo usuario
      console.log('Crear usuario:', { email: nuevoEmail, rol: nuevoRol });
    } else {
      // Validación: debe haber al menos un admin
      if (nuevoRol !== 'admin' && admins.length === 1 && admins[0].id === usuarioSeleccionado.id) {
        alert('El sistema debe tener al menos un usuario administrador.');
        return;
      }
      console.log('Cambiar rol:', { userId: usuarioSeleccionado.id, nuevoRol });
    }
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const esAdminProtegido = (email: string) => email === ADMIN_PROTEGIDO;

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
        <Box sx={{ p: { xs: 3, sm: 4 }, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Lista de técnicos y administradores
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrearUsuario}
              sx={{
                bgcolor: '#94b43c',
                color: '#002f6c',
                '&:hover': { bgcolor: '#7a9a30' },
              }}
            >
              Agregar Usuario
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tecnicosYAdmins.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.rol === 'admin' ? 'Administrador' : 'Técnico'}
                        sx={{
                          bgcolor: usuario.rol === 'admin' ? '#94b43c' : '#e0e0e0',
                          color: usuario.rol === 'admin' ? '#002f6c' : '#666',
                          fontWeight: 'bold',
                        }}
                      />
                      {esAdminProtegido(usuario.email) && (
                        <Chip
                          label="Protegido"
                          size="small"
                          sx={{ ml: 1, bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCambiarRol(usuario)}
                          disabled={esAdminProtegido(usuario.email)}
                          sx={{
                            color: '#94b43c',
                            borderColor: '#94b43c',
                            '&:hover': {
                              borderColor: '#7a9a30',
                              bgcolor: 'rgba(148, 180, 60, 0.1)',
                            },
                          }}
                        >
                          Cambiar Rol
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEliminarClick(usuario)}
                          disabled={esAdminProtegido(usuario.email) || usuario.rol === 'admin'}
                          color="error"
                          sx={{
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                              borderColor: '#d32f2f',
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                            },
                          }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Modal de cambio de rol / crear usuario */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#002f6c', fontWeight: 'bold' }}>
          {isCreating ? 'Crear Nuevo Usuario' : 'Cambiar Rol de Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {isCreating ? (
              <>
                <TextField
                  fullWidth
                  label="Email"
                  value={nuevoEmail}
                  onChange={(e) => setNuevoEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={nuevoRol}
                    label="Rol"
                    onChange={(e) => setNuevoRol(e.target.value as 'tecnico' | 'admin')}
                  >
                    <MenuItem value="tecnico">Técnico</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Usuario: <strong>{usuarioSeleccionado?.nombre}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Email: {usuarioSeleccionado?.email}
                </Typography>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Nuevo Rol</InputLabel>
                  <Select
                    value={nuevoRol}
                    label="Nuevo Rol"
                    onChange={(e) => setNuevoRol(e.target.value as 'tecnico' | 'admin')}
                  >
                    <MenuItem value="tecnico">Técnico</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>

                {nuevoRol !== 'admin' && admins.length === 1 && admins[0].id === usuarioSeleccionado?.id && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Este es el único administrador del sistema. Debe haber al menos un administrador.
                  </Alert>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleGuardar} 
            variant="contained" 
            sx={{ bgcolor: '#94b43c', color: '#002f6c', '&:hover': { bgcolor: '#7a9a30' } }}
            disabled={!isCreating && nuevoRol !== 'admin' && admins.length === 1 && admins[0].id === usuarioSeleccionado?.id}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={eliminarModalOpen} onClose={handleEliminarCancelar} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#002f6c', fontWeight: 'bold' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{usuarioAEliminar?.nombre}</strong> ({usuarioAEliminar?.email})?
            </Typography>
            
            {tieneTicketsAsignados(usuarioAEliminar?.id || '') && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Este técnico tiene tickets asignados. No se recomienda eliminar usuarios con tickets activos.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleEliminarCancelar} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleEliminarConfirmar} 
            variant="contained" 
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
