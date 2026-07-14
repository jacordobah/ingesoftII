/**
 * Servicio de Logging
 * 
 * Proporciona una interfaz unificada para logging en la aplicación.
 * En desarrollo muestra logs en consola, en producción podría enviar
 * a un servicio externo como Sentry, LogRocket, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${contextStr} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    // Mantener solo los últimos maxLogs logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // En desarrollo, mostrar en consola
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(level, message, context);
      
      switch (level) {
        case 'info':
          console.log(formattedMessage, data || '');
          break;
        case 'warn':
          console.warn(formattedMessage, data || '');
          break;
        case 'error':
          console.error(formattedMessage, data || '');
          break;
        case 'debug':
          console.debug(formattedMessage, data || '');
          break;
      }
    } else {
      // En producción, enviar a servicio externo
      // Aquí se implementaría el envío a Sentry, etc.
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Implementar envío a servicio externo en producción
    // Ejemplo: Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.data });
    if (entry.data instanceof Error) {
      // Sentry.captureException(entry.data);
    }
  }

  /**
   * Log de información
   */
  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context);
  }

  /**
   * Log de advertencia
   */
  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context);
  }

  /**
   * Log de error
   */
  error(message: string, error?: Error | any, context?: string) {
    this.log('error', message, error, context);
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: any, context?: string) {
    this.log('debug', message, data, context);
  }

  /**
   * Obtener todos los logs almacenados
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Limpiar todos los logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Exportar logs como JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Exportar funciones de conveniencia
export const logInfo = (message: string, data?: any, context?: string) => logger.info(message, data, context);
export const logWarn = (message: string, data?: any, context?: string) => logger.warn(message, data, context);
export const logError = (message: string, error?: Error | any, context?: string) => logger.error(message, error, context);
export const logDebug = (message: string, data?: any, context?: string) => logger.debug(message, data, context);
