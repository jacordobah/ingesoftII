import { useMemo, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { mockCategorias, mockEdificios } from '../../data/mockData';

export default function Dashboard() {
  const { tickets, users } = useApp();

  // Estados para filtros
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEdificio, setFiltroEdificio] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTecnico, setFiltroTecnico] = useState('');

  // Aplicar filtros a los tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((ticket) => {
      if (filtroFechaInicio && new Date(ticket.fechaCreacion) < new Date(filtroFechaInicio)) {
        return false;
      }
      if (filtroFechaFin && new Date(ticket.fechaCreacion) > new Date(filtroFechaFin)) {
        return false;
      }
      if (filtroCategoria && ticket.categoria !== filtroCategoria) {
        return false;
      }
      if (filtroEdificio && !ticket.ubicacion.includes(filtroEdificio)) {
        return false;
      }
      if (filtroEstado && ticket.estado !== filtroEstado) {
        return false;
      }
      if (filtroTecnico && ticket.tecnicoAsignado !== filtroTecnico) {
        return false;
      }
      return true;
    });
  }, [tickets, filtroFechaInicio, filtroFechaFin, filtroCategoria, filtroEdificio, filtroEstado, filtroTecnico]);

  // Métricas generales
  const metrics = useMemo(() => {
    const totalTickets = ticketsFiltrados.length;
    const ticketsPorEstado = {
      abierto: ticketsFiltrados.filter((t) => t.estado === 'abierto').length,
      en_proceso: ticketsFiltrados.filter((t) => t.estado === 'en_proceso').length,
      cerrado: ticketsFiltrados.filter((t) => t.estado === 'cerrado').length,
    };
    const ticketsPorPrioridad = {
      critica: ticketsFiltrados.filter((t) => t.prioridad === 'critica').length,
      media: ticketsFiltrados.filter((t) => t.prioridad === 'media').length,
      baja: ticketsFiltrados.filter((t) => t.prioridad === 'baja').length,
    };
    const ticketsSinAsignar = ticketsFiltrados.filter((t) => !t.tecnicoAsignado).length;

    // Tiempo promedio de respuesta (creación a primera asignación)
    const ticketsConAsignacion = ticketsFiltrados.filter((t) => t.tecnicoAsignado && t.fechaCreacion);
    const tiempoPromedioRespuesta = ticketsConAsignacion.length > 0
      ? ticketsConAsignacion.reduce((acc, t) => {
          const tiempo = new Date(t.fechaCreacion).getTime();
          return acc + tiempo;
        }, 0) / ticketsConAsignacion.length
      : 0;

    // Tiempo promedio de resolución (creación a cierre)
    const ticketsCerrados = ticketsFiltrados.filter((t) => t.estado === 'cerrado' && t.fechaResolucion && t.fechaCreacion);
    const tiempoPromedioResolucion = ticketsCerrados.length > 0
      ? ticketsCerrados.reduce((acc, t) => {
          const tiempo = new Date(t.fechaResolucion).getTime() - new Date(t.fechaCreacion).getTime();
          return acc + tiempo;
        }, 0) / ticketsCerrados.length
      : 0;

    // Tickets por técnico
    const tecnicos = users.filter((u) => u.rol === 'tecnico' || u.rol === 'admin');
    const ticketsPorTecnico = tecnicos.map((tecnico) => {
      const asignados = ticketsFiltrados.filter((t) => t.tecnicoAsignado === tecnico.id).length;
      const resueltos = ticketsFiltrados.filter((t) => t.tecnicoAsignado === tecnico.id && t.estado === 'cerrado').length;
      const pendientes = ticketsFiltrados.filter((t) => t.tecnicoAsignado === tecnico.id && t.estado !== 'cerrado').length;
      return {
        tecnico: tecnico.nombre,
        tecnicoId: tecnico.id,
        asignados,
        resueltos,
        pendientes,
        eficiencia: asignados > 0 ? ((resueltos / asignados) * 100).toFixed(1) : '0',
      };
    });

    // Tickets por categoría
    const ticketsPorCategoria = ticketsFiltrados.reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tickets por ubicación (edificio)
    const ticketsPorEdificio = ticketsFiltrados.reduce((acc, t) => {
      const edificio = t.ubicacion.split(' - ')[0] || t.ubicacion;
      acc[edificio] = (acc[edificio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tickets resueltos por semana (últimas 8 semanas)
    const ticketsResueltosPorSemana = useMemo(() => {
      const semanas: Record<string, number> = {};
      const hoy = new Date();
      
      // Inicializar últimas 8 semanas
      for (let i = 7; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - (i * 7));
        const inicioSemana = new Date(fecha);
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
        const key = inicioSemana.toISOString().split('T')[0];
        semanas[key] = 0;
      }

      // Contar tickets cerrados por semana
      ticketsFiltrados.forEach((ticket) => {
        if (ticket.estado === 'cerrado' && ticket.fechaResolucion) {
          const fechaResolucion = new Date(ticket.fechaResolucion);
          const inicioSemana = new Date(fechaResolucion);
          inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
          const key = inicioSemana.toISOString().split('T')[0];
          if (semanas.hasOwnProperty(key)) {
            semanas[key]++;
          }
        }
      });

      return Object.entries(semanas).map(([fecha, count]) => ({
        fecha: new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        count,
      }));
    }, [ticketsFiltrados]);

    return {
      totalTickets,
      ticketsPorEstado,
      ticketsPorPrioridad,
      ticketsSinAsignar,
      tiempoPromedioRespuesta,
      tiempoPromedioResolucion,
      ticketsPorTecnico,
      ticketsPorCategoria,
      ticketsPorEdificio,
      ticketsResueltosPorSemana,
    };
  }, [ticketsFiltrados, users]);

  const formatTiempo = (ms: number) => {
    const horas = ms / (1000 * 60 * 60);
    if (horas < 24) return `${horas.toFixed(1)} horas`;
    const dias = horas / 24;
    return `${dias.toFixed(1)} días`;
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 } }}>
      {/* Panel de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 3 }}>
          Filtros
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel shrink>Fecha Inicio</InputLabel>
            <TextField
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel shrink>Fecha Fin</InputLabel>
            <TextField
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filtroCategoria}
              label="Categoría"
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {mockCategorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel>Edificio</InputLabel>
            <Select
              value={filtroEdificio}
              label="Edificio"
              onChange={(e) => setFiltroEdificio(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {mockEdificios.map((edificio) => (
                <MenuItem key={edificio} value={edificio}>
                  {edificio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filtroEstado}
              label="Estado"
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="abierto">Abierto</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
              <MenuItem value="cerrado">Cerrado</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' } }}>
            <InputLabel>Técnico</InputLabel>
            <Select
              value={filtroTecnico}
              label="Técnico"
              onChange={(e) => setFiltroTecnico(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {users.filter((u) => u.rol === 'tecnico' || u.rol === 'admin').map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              setFiltroFechaInicio('');
              setFiltroFechaFin('');
              setFiltroCategoria('');
              setFiltroEdificio('');
              setFiltroEstado('');
              setFiltroTecnico('');
            }}
            sx={{ height: 56, alignSelf: 'center' }}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Paper>

      <Typography variant="h4" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 4 }}>
        Dashboard de Administración
      </Typography>

      {/* Resumen General */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: '#002f6c', color: 'white', flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 23%' } }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Total Tickets
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {metrics.totalTickets}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#94b43c', color: '#002f6c', flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 23%' } }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Abiertos
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {metrics.ticketsPorEstado.abierto}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#f59e0b', color: 'white', flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 23%' } }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              En Proceso
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {metrics.ticketsPorEstado.en_proceso}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#10b981', color: 'white', flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 23%' } }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Cerrados
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {metrics.ticketsPorEstado.cerrado}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Gráfico de Tickets Resueltos por Semana */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 3 }}>
          Tickets Resueltos por Semana (Últimas 8 semanas)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200, px: 2, pb: 2 }}>
          {metrics.ticketsResueltosPorSemana.map((semana, index) => {
            const maxCount = Math.max(...metrics.ticketsResueltosPorSemana.map((s) => s.count), 1);
            const height = maxCount > 0 ? (semana.count / maxCount) * 100 : 0;
            return (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#002f6c' }}>
                  {semana.count}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: `${height}%`,
                    minHeight: semana.count > 0 ? 20 : 0,
                    bgcolor: semana.count > 0 ? '#94b43c' : '#e5e7eb',
                    borderRadius: 1,
                    transition: 'height 0.3s ease',
                  }}
                />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  {semana.fecha}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Rendimiento por Técnico */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 2 }}>
          Rendimiento por Técnico
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {metrics.ticketsPorTecnico.map((tecnico) => (
            <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 31%' } }} key={tecnico.tecnicoId}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {tecnico.tecnico}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip label={`Asignados: ${tecnico.asignados}`} size="small" />
                  <Chip label={`Resueltos: ${tecnico.resueltos}`} size="small" color="success" />
                  <Chip label={`Pendientes: ${tecnico.pendientes}`} size="small" color="warning" />
                  <Chip label={`Eficiencia: ${tecnico.eficiencia}%`} size="small" color="info" />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Métricas de Prioridad, Sin Asignar y Tiempos */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Paper sx={{ p: 2, flex: { xs: '1 1 100%', sm: '1 1 48%', lg: '1 1 23%' } }}>
          <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1 }}>
            Tickets por Prioridad
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Crítica: ${metrics.ticketsPorPrioridad.critica}`}
              size="small"
              sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' }}
            />
            <Chip
              label={`Media: ${metrics.ticketsPorPrioridad.media}`}
              size="small"
              sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 'bold' }}
            />
            <Chip
              label={`Baja: ${metrics.ticketsPorPrioridad.baja}`}
              size="small"
              sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 'bold' }}
            />
          </Box>
        </Paper>
        <Paper sx={{ p: 2, flex: { xs: '1 1 100%', sm: '1 1 48%', lg: '1 1 23%' } }}>
          <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1 }}>
            Tickets Sin Asignar
          </Typography>
          <Typography variant="h5" sx={{ color: metrics.ticketsSinAsignar > 0 ? '#dc2626' : '#10b981', fontWeight: 'bold' }}>
            {metrics.ticketsSinAsignar}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: { xs: '1 1 100%', sm: '1 1 48%', lg: '1 1 23%' } }}>
          <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1 }}>
            Tiempo Promedio de Respuesta
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {formatTiempo(metrics.tiempoPromedioRespuesta)}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: { xs: '1 1 100%', sm: '1 1 48%', lg: '1 1 23%' } }}>
          <Typography variant="subtitle2" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 1 }}>
            Tiempo Promedio de Resolución
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {formatTiempo(metrics.tiempoPromedioResolucion)}
          </Typography>
        </Paper>
      </Box>

      {/* Tickets por Categoría y Edificio */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 2 }}>
            Tickets por Categoría
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(metrics.ticketsPorCategoria).map(([categoria, count]) => (
              <Chip
                key={categoria}
                label={`${categoria}: ${count}`}
                sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 'bold' }}
              />
            ))}
          </Box>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#002f6c', fontWeight: 'bold', mb: 2 }}>
            Tickets por Edificio
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(metrics.ticketsPorEdificio).map(([edificio, count]) => (
              <Chip
                key={edificio}
                label={`${edificio}: ${count}`}
                sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 'bold' }}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
