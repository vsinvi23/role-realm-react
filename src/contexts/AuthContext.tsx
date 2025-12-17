import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, userService } from '@/api/services';
import { getAuthToken, clearAuthToken, setAuthToken } from '@/api/client';
import { UserResponse, UserStatus } from '@/api/types';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  socialLogin: (provider: 'google' | 'github') => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to decode JWT and extract user info (basic implementation)
const decodeToken = (token: string): { sub?: string; email?: string } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const storedUser = localStorage.getItem('auth_user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          clearAuthToken();
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }

      const response = await authService.login({ email, password });
      
      if (response.token) {
        // Decode token to get user info
        const decoded = decodeToken(response.token);
        
        // Create user object (adjust based on your JWT payload structure)
        const authUser: AuthUser = {
          id: decoded?.sub || crypto.randomUUID(),
          email: decoded?.email || email,
          name: email.split('@')[0],
          status: 'ACTIVE',
          role: email.includes('admin') ? 'admin' : 'user', // Adjust based on actual role from JWT
        };
        
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        return {};
      }
      
      return { error: 'Login failed' };
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 401) {
        return { error: 'Invalid email or password' };
      }
      return { error: error.response?.data?.message || 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password || !name) {
        return { error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      await authService.signup({
        name,
        email,
        password,
        status: 'ACTIVE',
      });

      // Auto-login after signup
      return await login(email, password);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 409) {
        return { error: 'Email already exists' };
      }
      return { error: error.response?.data?.message || 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'github'): Promise<{ error?: string }> => {
    // Social login would require OAuth implementation on the backend
    // For now, return an error indicating it's not implemented
    return { error: `${provider} login is not yet configured. Please use email/password.` };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        socialLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
