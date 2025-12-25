import apiClient from '../client';
import { ApiResponse, UserDto, UserPagedResponse, GroupResponseDto } from '../types';

const USERS_BASE = '/api/users';
const ADMIN_USERS_BASE = '/api/admin/users';

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
    return response.data.data || { items: [], totalElements: 0, currentPage: 0, pageSize: 10 };
  },

  /**
   * Get a single user by ID
   * GET /api/users/:id
   */
  getUser: async (userId: number): Promise<UserDto> => {
    const response = await apiClient.get<ApiResponse<UserDto>>(`${USERS_BASE}/${userId}`);
    return response.data.data!;
  },

  /**
   * Get groups for a user
   * GET /api/users/:id/groups
   */
  getUserGroups: async (userId: number): Promise<GroupResponseDto[]> => {
    const response = await apiClient.get<ApiResponse<GroupResponseDto[]>>(`${USERS_BASE}/${userId}/groups`);
    return response.data.data || [];
  },

  /**
   * Delete a user (admin only)
   * DELETE /api/admin/users/:id
   */
  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`${ADMIN_USERS_BASE}/${userId}`);
  },
};

export default userService;
