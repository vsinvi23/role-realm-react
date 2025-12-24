import apiClient, { setAuthToken, clearAuthToken } from '../client';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types';

const USERS_BASE = '/api/users';

export const authService = {
  /**
   * Login with email and password
   * POST /api/users/login
   * @returns AuthResponse with token and user info
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `${USERS_BASE}/login`,
      credentials
    );
    
    // Extract data from ApiResponse wrapper
    const authData = response.data.data;
    
    if (authData?.token) {
      setAuthToken(authData.token);
    }
    
    return authData!;
  },

  /**
   * Register a new user
   * POST /api/users/register
   * @returns AuthResponse with token (auto-login after registration)
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      `${USERS_BASE}/register`,
      data
    );
    
    const authData = response.data.data;
    
    if (authData?.token) {
      setAuthToken(authData.token);
    }
    
    return authData!;
  },

  /**
   * Logout - clear stored token
   */
  logout: (): void => {
    clearAuthToken();
  },
};

export default authService;
