// Configuración de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Endpoints
export const ENDPOINTS = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
  },
  usuarios: {
    getAll: `${API_URL}/usuarios`,
    getById: (id: string) => `${API_URL}/usuarios/${id}`,
    create: `${API_URL}/usuarios`,
    update: (id: string) => `${API_URL}/usuarios/${id}`,
    delete: (id: string) => `${API_URL}/usuarios/${id}`,
  },
  tickets: {
    getAll: `${API_URL}/tickets`,
    getById: (id: string) => `${API_URL}/tickets/${id}`,
    create: `${API_URL}/tickets`,
    update: (id: string) => `${API_URL}/tickets/${id}`,
    delete: (id: string) => `${API_URL}/tickets/${id}`,
    addComment: (id: string) => `${API_URL}/tickets/${id}/comentarios`,
  },
  categorias: {
    getAll: `${API_URL}/categorias`,
    getById: (id: string) => `${API_URL}/categorias/${id}`,
    create: `${API_URL}/categorias`,
    update: (id: string) => `${API_URL}/categorias/${id}`,
    delete: (id: string) => `${API_URL}/categorias/${id}`,
    createSubcategoria: (id: string) => `${API_URL}/categorias/${id}/subcategorias`,
    updateSubcategoria: (id: string) => `${API_URL}/categorias/subcategorias/${id}`,
    deleteSubcategoria: (id: string) => `${API_URL}/categorias/subcategorias/${id}`,
  },
  ubicaciones: {
    getAll: `${API_URL}/ubicaciones`,
    getEdificioById: (id: string) => `${API_URL}/ubicaciones/edificios/${id}`,
    createEdificio: `${API_URL}/ubicaciones/edificios`,
    updateEdificio: (id: string) => `${API_URL}/ubicaciones/edificios/${id}`,
    deleteEdificio: (id: string) => `${API_URL}/ubicaciones/edificios/${id}`,
    createUbicacion: (id: string) => `${API_URL}/ubicaciones/edificios/${id}/ubicaciones`,
    updateUbicacion: (id: string) => `${API_URL}/ubicaciones/ubicaciones/${id}`,
    deleteUbicacion: (id: string) => `${API_URL}/ubicaciones/ubicaciones/${id}`,
  },
  auditoria: {
    getAll: `${API_URL}/auditoria`,
    getById: (id: string) => `${API_URL}/auditoria/${id}`,
    getByTicket: (ticketId: string) => `${API_URL}/auditoria/ticket/${ticketId}`,
    create: `${API_URL}/auditoria`,
  },
};

// Función helper para hacer peticiones
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || error.message || 'Error en la petición');
  }

  return response.json();
}
