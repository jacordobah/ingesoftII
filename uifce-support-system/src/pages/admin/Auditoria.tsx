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
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useApp } from '../../contexts/AppContext';
import { formatearFechaHora } from '../../utils/ticketUtils';

export default function Auditoria() {
  const { auditoria } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const exportarTodo = () => {
    const csvContent = [
      ['ID', 'Ticket ID', 'Acción', 'Usuario', 'Rol', 'Fecha', 'Detalles'].join(','),
      ...auditoria.map((a) => [
        a.id,
        a.ticketId,
        a.accion,
        a.usuario,
        a.usuarioRol,
        formatearFechaHora(a.fecha),
        JSON.stringify(a.detalles),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'creacion_ticket':
        return { bgcolor: '#dbeafe', color: '#1e40af' };
      case 'asignacion_ticket':
        return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'reasignacion_ticket':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'cambio_estado':
        return { bgcolor: '#fce7f3', color: '#9d174d' };
      case 'modificacion_categoria':
        return { bgcolor: '#e0e7ff', color: '#3730a3' };
      case 'inclusion_comentario':
        return { bgcolor: '#f3e8ff', color: '#6b21a8' };
      case 'cierre_ticket':
        return { bgcolor: '#dcfce7', color: '#166534' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getAccionLabel = (accion: string) => {
    return accion.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#002f6c', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Auditoría del Sistema
        </Typography>
        <Button
          variant="contained"
          onClick={exportarTodo}
          startIcon={<DownloadIcon />}
          sx={{ bgcolor: '#94b43c', '&:hover': { bgcolor: '#7a9a30' }, width: { xs: '100%', sm: 'auto' } }}
        >
          Exportar Todo
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {auditoria.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  No hay registros de auditoría
                </Typography>
              </Box>
            ) : (
              auditoria.slice().reverse().slice(0, 20).map((registro) => (
                <Card key={registro.id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {formatearFechaHora(registro.fecha)}
                      </Typography>
                      <Chip
                        label={getAccionLabel(registro.accion)}
                        size="small"
                        sx={getAccionColor(registro.accion)}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {registro.usuario}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', mb: 0.5 }}>
                      {registro.usuarioRol}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#002f6c' }}>
                      Ticket: {registro.ticketId}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                        {registro.detalles.estadoAnterior && (
                          <span>Estado: {registro.detalles.estadoAnterior} → {registro.detalles.estadoNuevo}</span>
                        )}
                        {registro.detalles.tecnicoAnterior && (
                          <span>Técnico: {registro.detalles.tecnicoAnterior} → {registro.detalles.tecnicoNuevo}</span>
                        )}
                        {registro.detalles.categoriaAnterior && (
                          <span>Categoría: {registro.detalles.categoriaAnterior} → {registro.detalles.categoriaNueva}</span>
                        )}
                        {registro.detalles.comentario && (
                          <span>Comentario: {registro.detalles.comentario}</span>
                        )}
                        {registro.detalles.motivo && (
                          <span>Motivo: {registro.detalles.motivo}</span>
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Acción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#002f6c' }}>Detalles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditoria.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay registros de auditoría
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditoria.slice().reverse().slice(0, 20).map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>{formatearFechaHora(registro.fecha)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getAccionLabel(registro.accion)}
                          size="small"
                          sx={getAccionColor(registro.accion)}
                        />
                      </TableCell>
                      <TableCell>{registro.usuario}</TableCell>
                      <TableCell>{registro.usuarioRol}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{registro.ticketId}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          {registro.detalles.estadoAnterior && (
                            <span>Estado: {registro.detalles.estadoAnterior} → {registro.detalles.estadoNuevo}</span>
                          )}
                          {registro.detalles.tecnicoAnterior && (
                            <span>Técnico: {registro.detalles.tecnicoAnterior} → {registro.detalles.tecnicoNuevo}</span>
                          )}
                          {registro.detalles.categoriaAnterior && (
                            <span>Categoría: {registro.detalles.categoriaAnterior} → {registro.detalles.categoriaNueva}</span>
                          )}
                          {registro.detalles.comentario && (
                            <span>Comentario: {registro.detalles.comentario}</span>
                          )}
                          {registro.detalles.motivo && (
                            <span>Motivo: {registro.detalles.motivo}</span>
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
