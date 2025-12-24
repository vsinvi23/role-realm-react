import apiClient from '../client';
import { ApiResponse, UserDto, UserPagedResponse } from '../types';

const USERS_BASE = '/api/users';

export interface UserQueryParams {
  page?: number;
  size?: number;
}

export const userService = {
  /**
   * Get paginated list of users
   * GET /api/users?page=0&size=10
   */
  getUsers: async (params?: UserQueryParams): Promise<UserPagedResponse> => {
    const response = await apiClient.get<ApiResponse<UserPagedResponse>>(USERS_BASE, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data.data || { items: [], totalElements: 0, page: 0, size: 10 };
  },

  /**
   * Get a single user by ID
   * GET /api/users/:id
   */
  getUser: async (userId: number): Promise<UserDto> => {
    const response = await apiClient.get<ApiResponse<UserDto>>(`${USERS_BASE}/${userId}`);
    return response.data.data!;
  },
};

export default userService;
