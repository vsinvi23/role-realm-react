import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/api/services';
import { getAuthToken, clearAuthToken } from '@/api/client';
import { UserStatus } from '@/api/types';

interface AuthUser {
  id: number;
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
  signup: (email: string, password: string, name: string, mobileNo?: string) => Promise<{ error?: string }>;
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

// Helper to decode JWT and extract user info
const decodeToken = (token: string): { sub?: string; email?: string; userId?: number; role?: string } | null => {
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

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token) as { exp?: number } | null;
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
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
        // Check if token is expired
        if (isTokenExpired(token)) {
          clearAuthToken();
          localStorage.removeItem('auth_user');
        } else {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            clearAuthToken();
            localStorage.removeItem('auth_user');
          }
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
        // Decode token to get additional info
        const decoded = decodeToken(response.token);
        
        // Create user object from AuthResponse
        const authUser: AuthUser = {
          id: response.userId,
          email: response.email,
          name: response.email.split('@')[0], // Default name from email
          status: 'ACTIVE',
          role: decoded?.role === 'admin' ? 'admin' : 'user',
        };
        
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        return {};
      }
      
      return { error: response.message || 'Login failed' };
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

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    mobileNo?: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password || !name) {
        return { error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }

      const response = await authService.register({
        name,
        email,
        password,
        mobileNo,
      });

      if (response.token) {
        // Auto-login after successful registration
        const authUser: AuthUser = {
          id: response.userId,
          email: response.email,
          name: name,
          status: 'ACTIVE',
          role: 'user',
        };
        
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        return {};
      }

      return { error: response.message || 'Registration failed' };
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
    return { error: `${provider} login is not yet configured. Please use email/password.` };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('auth_user');
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
