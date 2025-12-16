import apiClient from '../client';
import {
  UserRequest,
  UserResponse,
  PageResponse,
  UserQueryParams,
} from '../types';

const USERS_BASE = '/api/users';

export const userService = {
  /**
   * Get paginated list of users with optional filters
   */
  getUsers: async (params?: UserQueryParams): Promise<PageResponse<UserResponse>> => {
    const response = await apiClient.get<PageResponse<UserResponse>>(USERS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        status: params?.status,
        search: params?.search,
      },
    });
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  getUser: async (userId: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(`${USERS_BASE}/${userId}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  createUser: async (data: UserRequest): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(USERS_BASE, data);
    return response.data;
  },

  /**
   * Update an existing user
   */
  updateUser: async (userId: string, data: UserRequest): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(`${USERS_BASE}/${userId}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`${USERS_BASE}/${userId}`);
  },
};

export default userService;
