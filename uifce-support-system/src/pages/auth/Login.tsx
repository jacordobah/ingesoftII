import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';
import { validateEmail, validateField } from '../../utils/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validar email con formato institucional
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Email inválido');
      return;
    }

    // Validar que sea correo institucional UNAL
    if (!email.endsWith('@unal.edu.co')) {
      setEmailError('Debe usar su correo institucional @unal.edu.co');
      return;
    }

    // Validar contraseña
    const passwordValidation = validateField(password, { 
      required: true, 
      minLength: 6 
    });
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: 500,
          }}
        >
          {/* Branding institucional */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: '#002f6c',
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              UIFCE
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Soporte Técnico
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#002f6c',
                fontWeight: 600,
              }}
            >
              Facultad de Ciencias Económicas
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ingrese su correo institucional para acceder al sistema
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo Institucional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              required
              sx={{ mb: 2 }}
              placeholder="usuario@unal.edu.co"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
              required
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#002f6c',
                color: '#ffffff',
                fontWeight: 'bold',
                '&:hover': { 
                  bgcolor: '#001f4d',
                  color: '#ffffff',
                },
                py: 1.5,
              }}
            >
              Iniciar Sesión
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Sistema de Gestión de Tickets de Soporte Técnico
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
