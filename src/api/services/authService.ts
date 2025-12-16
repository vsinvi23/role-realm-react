import apiClient, { setAuthToken, clearAuthToken } from '../client';
import { AuthLoginRequest, AuthSignupRequest, AuthTokenResponse } from '../types';

const AUTH_BASE = '/api/auth';

export const authService = {
  /**
   * Login with email and password
   * @returns JWT token
   */
  login: async (credentials: AuthLoginRequest): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>(
      `${AUTH_BASE}/login`,
      credentials
    );
    // Store token on successful login
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Signup / Register a new user
   * @returns void (201 Created on success)
   */
  signup: async (data: AuthSignupRequest): Promise<void> => {
    await apiClient.post(`${AUTH_BASE}/signup`, data);
  },

  /**
   * Logout - clear stored token
   */
  logout: (): void => {
    clearAuthToken();
  },
};

export default authService;
