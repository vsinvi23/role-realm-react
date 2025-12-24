import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

// API Base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Token storage key
const TOKEN_KEY = 'authToken';
const USER_KEY = 'auth_user';

// In-memory token cache for better performance and security
// Token is primarily stored in sessionStorage but cached in memory for quick access
let tokenCache: string | null = null;

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token from memory cache or sessionStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      clearAuthToken();
      clearUserData();
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Store authentication token
 * Uses sessionStorage for persistence across page refreshes
 * Also caches in memory for quick access
 */
export const setAuthToken = (token: string): void => {
  tokenCache = token;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // sessionStorage might be unavailable in some contexts
    console.warn('sessionStorage unavailable, using memory only');
  }
};

/**
 * Get authentication token
 * First checks memory cache, then falls back to sessionStorage
 */
export const getAuthToken = (): string | null => {
  // Return from memory cache if available
  if (tokenCache) {
    return tokenCache;
  }
  
  // Try to get from sessionStorage
  try {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      // Update memory cache
      tokenCache = storedToken;
      return storedToken;
    }
  } catch (e) {
    // sessionStorage unavailable
  }
  
  return null;
};

/**
 * Clear authentication token from all storage
 */
export const clearAuthToken = (): void => {
  tokenCache = null;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // sessionStorage unavailable
  }
};

/**
 * Store user data in sessionStorage
 */
export const setUserData = (userData: object): void => {
  try {
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (e) {
    console.warn('Failed to store user data');
  }
};

/**
 * Get user data from sessionStorage
 */
export const getUserData = <T>(): T | null => {
  try {
    const data = sessionStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Clear user data from sessionStorage
 */
export const clearUserData = (): void => {
  try {
    sessionStorage.removeItem(USER_KEY);
  } catch (e) {
    // sessionStorage unavailable
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      clearAuthToken();
      clearUserData();
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all auth-related data
 */
export const clearAllAuthData = (): void => {
  clearAuthToken();
  clearUserData();
};

export default apiClient;
