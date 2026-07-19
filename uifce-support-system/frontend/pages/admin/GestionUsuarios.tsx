import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { User } from '../../types';
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
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../contexts/AppContext';
import { ENDPOINTS, apiRequest } from '../../config/api';

const ADMIN_PROTEGIDO = 'uniic_bog@unal.edu.co';

// El backend usa 'Usuario'|'Tecnico'|'Administrador'; el front usa
// 'usuario'|'tecnico'|'admin'.
const ROL_HACIA_BACKEND: Record<'tecnico' | 'admin', string> = {
  tecnico: 'Tecnico',
  admin: 'Administrador',
};

export default function GestionUsuarios() {
  const { users, tickets, recargarDatos } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoRol, setNuevoRol] = useState<'tecnico' | 'admin'>('tecnico');
  const [isCreating, setIsCreating] = useState(false);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);

  const tecnicosYAdmins = users.filter((u) => u.rol === 'tecnico' || u.rol === 'admin');
  const admins = users.filter((u) => u.rol === 'admin');

  const handleCambiarRol = (usuario: User) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.rol === 'admin' || usuario.rol === 'tecnico' ? usuario.rol : 'tecnico');
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCrearUsuario = () => {
    setNuevoEmail('');
    setNuevoRol('tecnico');
    setIsCreating(true);
    setModalOpen(true);
  };

  const tieneTicketsAsignados = (usuario: User) => {
    return tickets.some((t) => t.tecnicoAsignado === usuario.nombre);
  };

  const handleEliminarClick = (usuario: User) => {
    setUsuarioAEliminar(usuario);
    setEliminarModalOpen(true);
  };

  const handleEliminarConfirmar = async () => {
    if (!usuarioAEliminar) return;
    try {
      await apiRequest(ENDPOINTS.usuarios.delete(usuarioAEliminar.id), { method: 'DELETE' });
      await recargarDatos();
    } catch (error) {
      console.error('No se pudo eliminar el usuario:', error);
      alert('No se pudo eliminar el usuario.');
    }
    setEliminarModalOpen(false);
    setUsuarioAEliminar(null);
  };

  const handleEliminarCancelar = () => {
    setEliminarModalOpen(false);
    setUsuarioAEliminar(null);
  };

  const handleGuardar = async () => {
    if (isCreating) {
      try {
        await apiRequest(ENDPOINTS.usuarios.create, {
          method: 'POST',
          body: JSON.stringify({ nombre: nuevoEmail.split('@')[0], email: nuevoEmail, rol: ROL_HACIA_BACKEND[nuevoRol] }),
        });
        await recargarDatos();
      } catch (error) {
        console.error('No se pudo crear el usuario:', error);
        alert('No se pudo crear el usuario.');
        return;
      }
    } else {
      // Validación: debe haber al menos un admin
      if (nuevoRol !== 'admin' && admins.length === 1 && admins[0].id === usuarioSeleccionado?.id) {
        alert('El sistema debe tener al menos un usuario administrador.');
        return;
      }
      // El backend no expone un endpoint para cambiar el rol de un usuario
      // existente (UserController solo tiene crear/listar/eliminar).
      console.warn('Cambiar rol no esta soportado por el backend todavia.');
      alert('Cambiar el rol de un usuario existente no esta soportado por el backend todavia.');
      return;
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
                color: '#ffffff',
                fontWeight: 'bold',
                '&:hover': { 
                  bgcolor: '#7a9a30',
                  color: '#ffffff',
                },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Agregar Usuario
            </Button>
          </Box>
          {isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {tecnicosYAdmins.map((usuario) => (
                <Card key={usuario.id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {usuario.nombre}
                      </Typography>
                      <Chip
                        label={usuario.rol === 'admin' ? 'Administrador' : 'Técnico'}
                        size="small"
                        sx={{
                          bgcolor: usuario.rol === 'admin' ? '#94b43c' : '#e0e0e0',
                          color: usuario.rol === 'admin' ? '#002f6c' : '#666',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {usuario.email}
                    </Typography>
                    {esAdminProtegido(usuario.email) && (
                      <Chip
                        label="Protegido"
                        size="small"
                        sx={{ mb: 1, bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}
                      />
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexDirection: 'column' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCambiarRol(usuario)}
                        disabled={esAdminProtegido(usuario.email)}
                        fullWidth
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
                        fullWidth
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
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
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
          )}
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
            
            {usuarioAEliminar && tieneTicketsAsignados(usuarioAEliminar) && (
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
