import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { AuthLoginRequest, AuthSignupRequest, UserResponse } from '../types';
import { getAuthToken, clearAuthToken } from '../client';
import { AxiosError } from 'axios';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: AuthLoginRequest) => Promise<boolean>;
  signup: (data: AuthSignupRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthApi = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: AuthLoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(axiosError.response?.data?.message || 'Login failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: AuthSignupRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signup(data);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 409) {
        setError('Email already exists');
      } else {
        setError(axiosError.response?.data?.message || 'Signup failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };
};

export default useAuthApi;
