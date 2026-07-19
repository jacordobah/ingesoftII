// Configuración de la API
// Backend real: Spring Boot, rutas bajo /api/v1.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Endpoints
// NOTA: el backend Java ahora tiene AuthController implementado con login/JWT.
export const ENDPOINTS = {
  auth: {
    login: `${API_URL.replace('/api/v1', '/api')}/auth/login`,
  },
  usuarios: {
    getAll: `${API_URL}/usuarios`,
    getById: (id: number) => `${API_URL}/usuarios/${id}`,
    create: `${API_URL}/usuarios`,
    delete: (id: number) => `${API_URL}/usuarios/${id}`,
  },
  tickets: {
    getAll: `${API_URL}/tickets`,
    create: `${API_URL}/tickets`,
    cambiarEstado: `${API_URL}/tickets/cambiar-estado`,
    asignarTecnico: `${API_URL}/tickets/asignar-tecnico`,
  },
  categorias: {
    getAll: `${API_URL}/categoria`,
    getById: (id: number) => `${API_URL}/categoria/${id}`,
    create: `${API_URL}/categoria`,
    update: `${API_URL}/categoria`,
    delete: (id: number) => `${API_URL}/categoria/${id}`,
    getSubcategorias: (categoriaId: number) => `${API_URL}/categoria/${categoriaId}/subcategorias`,
    createSubcategoria: (categoriaId: number) => `${API_URL}/categoria/${categoriaId}/subcategoria`,
    updateSubcategoria: `${API_URL}/categoria/subcategoria`,
    deleteSubcategoria: (id: number) => `${API_URL}/categoria/subcategoria/${id}`,
  },
  ubicaciones: {
    getAll: `${API_URL}/edificios`,
    getEdificioById: (id: number) => `${API_URL}/edificios/${id}`,
    createEdificio: `${API_URL}/edificios`,
    updateEdificio: `${API_URL}/edificios`,
    deleteEdificio: (id: number) => `${API_URL}/edificios/${id}`,
    getOficinas: (edificioId: number) => `${API_URL}/edificios/${edificioId}/oficinas`,
    createOficina: (edificioId: number) => `${API_URL}/edificios/${edificioId}/oficinas`,
    updateOficina: `${API_URL}/edificios/oficinas`,
    deleteOficina: (id: number) => `${API_URL}/edificios/oficinas/${id}`,
  },
  auditoria: {
    getAll: `${API_URL}/auditoria`,
    getByTicket: (ticketId: string) => `${API_URL}/auditoria/ticket/${ticketId}`,
  },
};

// Función helper para hacer peticiones
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || error.message || 'Error en la petición');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
