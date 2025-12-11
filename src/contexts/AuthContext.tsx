import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }
      
      // Mock user - admin if email contains 'admin'
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !password || !name) {
        return { error: 'All fields are required' };
      }
      
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
      }
      
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'github'): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: crypto.randomUUID(),
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: provider === 'github' 
          ? 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          : 'https://lh3.googleusercontent.com/a/default-user',
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
