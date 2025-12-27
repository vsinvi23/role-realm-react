import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '@/api/services';
import { userService } from '@/api/services/userService';
import { 
  getAuthToken, 
  clearAllAuthData, 
  setUserData, 
  getUserData,
  isAuthenticated as checkIsAuthenticated 
} from '@/api/client';
import { UserStatus, GroupResponseDto } from '@/api/types';

// Cache keys
const GROUPS_CACHE_KEY = 'user_groups_cache';

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
  // User groups
  userGroups: GroupResponseDto[];
  groupNames: string[];
  hasNoGroups: boolean;
  hasGroup: (groupName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default context value for when provider isn't available (prevents HMR crashes)
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => ({ error: 'Auth not initialized' }),
  signup: async () => ({ error: 'Auth not initialized' }),
  socialLogin: async () => ({ error: 'Auth not initialized' }),
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  userGroups: [],
  groupNames: [],
  hasNoGroups: true,
  hasGroup: () => false,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Return default context instead of throwing - prevents crashes during HMR
  if (!context) {
    console.warn('useAuth called outside AuthProvider - using default context');
    return defaultAuthContext;
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to decode JWT and extract user info
const decodeToken = (token: string): { sub?: string; email?: string; userId?: number; role?: string; exp?: number } | null => {
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
  const [userGroups, setUserGroups] = useState<GroupResponseDto[]>([]);

  // Fetch user groups from API and cache them
  const fetchUserGroups = useCallback(async (userId: number) => {
    if (!userId || userId <= 0) return;
    
    try {
      const groups = await userService.getUserGroups(userId);
      setUserGroups(groups);
      // Cache in sessionStorage
      sessionStorage.setItem(GROUPS_CACHE_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
      setUserGroups([]);
    }
  }, []);

  // Clear groups (on logout)
  const clearUserGroups = useCallback(() => {
    setUserGroups([]);
    sessionStorage.removeItem(GROUPS_CACHE_KEY);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Use the centralized auth check
      if (checkIsAuthenticated()) {
        const storedUser = getUserData<AuthUser>();
        if (storedUser) {
          setUser(storedUser);
          // Load cached groups
          const cachedGroups = sessionStorage.getItem(GROUPS_CACHE_KEY);
          if (cachedGroups) {
            try {
              setUserGroups(JSON.parse(cachedGroups));
            } catch {
              sessionStorage.removeItem(GROUPS_CACHE_KEY);
            }
          } else {
            // Fetch groups if not cached
            fetchUserGroups(storedUser.id);
          }
        } else {
          // Token exists but no user data - clear everything
          clearAllAuthData();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [fetchUserGroups]);

  // Set up token expiry checker
  useEffect(() => {
    if (!user) return;

    const token = getAuthToken();
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    // Calculate time until expiry
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    if (timeUntilExpiry <= 0) {
      // Token already expired
      handleLogout();
      return;
    }

    // Set timer to logout when token expires
    const timer = setTimeout(() => {
      handleLogout();
    }, timeUntilExpiry);

    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    clearAllAuthData();
    clearUserGroups();
  }, [clearUserGroups]);

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
        setUserData(authUser);
        // Fetch user groups after login
        fetchUserGroups(authUser.id);
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
        setUserData(authUser);
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

  // Derived group values
  const groupNames = userGroups.map(g => g.name.toUpperCase());
  const isAdmin = groupNames.includes('ADMIN');
  const hasNoGroups = userGroups.length === 0;
  const hasGroup = useCallback((groupName: string) => {
    return groupNames.includes(groupName.toUpperCase());
  }, [groupNames]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        socialLogin,
        logout: handleLogout,
        isAuthenticated: !!user,
        isAdmin,
        userGroups,
        groupNames,
        hasNoGroups,
        hasGroup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
