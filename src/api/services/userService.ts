import apiClient from '../client';
import { ApiResponse, UserDto, PagedResponse } from '../types';

const USERS_BASE = '/api/users';

export interface UserQueryParams {
  page?: number;
  size?: number;
}

export const userService = {
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
