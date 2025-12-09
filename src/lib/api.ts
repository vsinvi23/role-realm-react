import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints for users (mock - replace with real endpoints)
export const userApi = {
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (data: unknown) => api.post('/users', data),
  updateUser: (id: string, data: unknown) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  inviteUser: (email: string, role: string) => api.post('/users/invite', { email, role }),
};

export const roleApi = {
  getRoles: () => api.get('/roles'),
  getRole: (id: string) => api.get(`/roles/${id}`),
  createRole: (data: unknown) => api.post('/roles', data),
  updateRole: (id: string, data: unknown) => api.put(`/roles/${id}`, data),
  deleteRole: (id: string) => api.delete(`/roles/${id}`),
};
