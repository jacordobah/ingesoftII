import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Captura errores en componentes hijos y muestra una UI de fallback
 * en lugar de que toda la aplicación se bloquee.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // En producción, enviar a servicio de logging (Sentry, LogRocket, etc.)
    if (import.meta.env.PROD) {
      // Aquí se implementaría el envío a servicio externo
      // Sentry.captureException(error, { extra: errorInfo });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ color: '#d32f2f', mb: 2, fontWeight: 'bold' }}>
                Algo salió mal
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                Ha ocurrido un error inesperado en la aplicación. Por favor, intenta
                recargar la página.
              </Typography>
              
              {import.meta.env.DEV && this.state.error && (
                <Box
                  sx={{
                    textAlign: 'left',
                    bgcolor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    mb: 3,
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Error Details (Development Mode):
                  </Typography>
                  <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', mt: 1 }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Box>
              )}
              
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{
                  bgcolor: '#94b43c',
                  color: '#002f6c',
                  '&:hover': { bgcolor: '#7a9a30' },
                }}
              >
                Intentar de nuevo
              </Button>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
